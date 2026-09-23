"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Invitation } from "@/lib/invitation";
import { Countdown } from "./Countdown";
import { PartyPopper } from "./PartyPopper";

const COUNT = 140;
const RAW_PETAL = "/images/petal-red.png";

function heartOnBorder(t: number, scale = 1) {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return {
    x: 50 + x * 2.08 * scale,
    y: 48 - y * 1.88 * scale,
  };
}

function insideHeart(px: number, py: number) {
  const x = (px - 50) / 30;
  const y = (47 - py) / 28;
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y <= 0;
}

function rand(i: number, salt: number) {
  const n = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function buildPetals() {
  const starts: { x: number; y: number; rot: number; size: number }[] = [];
  let i = 0;
  while (starts.length < COUNT && i < 2000) {
    const x = 14 + rand(i, 1) * 72;
    const y = 16 + rand(i, 2) * 72;
    i += 1;
    if (!insideHeart(x, y)) continue;
    starts.push({
      x,
      y,
      rot: rand(i, 3) * 360,
      size: 18 + rand(i, 4) * 8,
    });
  }

  return starts.map((start, index) => {
    const ring = index % 3 === 0 ? 1.16 : index % 3 === 1 ? 1.08 : 1.01;
    const t = (index / COUNT) * Math.PI * 2;
    const p = heartOnBorder(t, ring);
    const q = heartOnBorder(t + 0.06, ring);
    const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + 90;
    return {
      id: index,
      start,
      end: {
        x: p.x,
        y: p.y,
        rot: angle + (index % 2 === 0 ? -16 : 16),
        size: 20 + (index % 3) * 3,
      },
    };
  });
}

function knockoutWhite(src: string) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(src);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i];
        const g = px[i + 1];
        const b = px[i + 2];
        if (r > 228 && g > 228 && b > 228) {
          px[i + 3] = 0;
        } else if (r > 200 && g > 200 && b > 200) {
          px[i + 3] = Math.round(px[i + 3] * 0.25);
        }
      }
      ctx.putImageData(data, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("petal missing"));
    img.src = src;
  });
}

export function HeartScratch({
  data,
  onScroll,
}: {
  data: Invitation;
  onScroll: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const flownRef = useRef<Set<number>>(new Set());
  const revealedRef = useRef(false);
  const petals = useMemo(buildPetals, []);
  const [ready, setReady] = useState(false);
  const [petalUrl, setPetalUrl] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    knockoutWhite(RAW_PETAL)
      .then((url) => {
        setPetalUrl(url);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  const sendNearby = (clientX: number, clientY: number) => {
    const wrap = wrapRef.current;
    if (!wrap || revealedRef.current) return;
    const rect = wrap.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * 100;
    const py = ((clientY - rect.top) / rect.height) * 100;
    let changed = false;
    for (const petal of petals) {
      if (flownRef.current.has(petal.id)) continue;
      const dx = petal.start.x - px;
      const dy = petal.start.y - py;
      if (dx * dx + dy * dy < 170) {
        flownRef.current.add(petal.id);
        changed = true;
      }
    }
    if (!changed) return;
    if (flownRef.current.size > COUNT * 0.3 && !revealedRef.current) {
      revealedRef.current = true;
      petals.forEach((petal) => flownRef.current.add(petal.id));
      setRevealed(true);
      setBurst((n) => n + 1);
    }
    setTick((n) => n + 1);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* optional */
    }
    sendNearby(e.clientX, e.clientY);
  };

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center bg-[#fff7f4] px-5 py-12">
      {ready ? <PartyPopper burst={burst} /> : null}
      <p className="font-cinzel text-[10px] tracking-[0.42em] text-[#9a3b3b] uppercase">
        {data.scratchKicker}
      </p>
      <h2 className="hero-names mt-2 text-5xl sm:text-6xl">
        {data.groom.firstName} & {data.bride.firstName}
      </h2>

      <div
        ref={wrapRef}
        className="relative mt-6 aspect-square w-full max-w-[420px] cursor-crosshair touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={(e) => {
          if (e.buttons === 0 && e.pointerType !== "touch") return;
          sendNearby(e.clientX, e.clientY);
        }}
      >
        <motion.div
          className="absolute inset-0 z-0 flex flex-col items-center justify-center px-[26%] text-center"
          initial={false}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.5, delay: revealed ? 0.45 : 0 }}
        >
          <p className="font-cinzel text-[11px] font-semibold text-[#9a3b3b] uppercase">
            {data.wedding.weekday}
          </p>
          <p className="mt-1 font-cinzel text-5xl leading-none font-semibold text-[#8f1d2c] sm:text-6xl">
            {data.wedding.day}
          </p>
          <p className="mt-2 font-cinzel text-[11px] text-[#9a3b3b] uppercase">
            {data.wedding.month} {data.wedding.year}
          </p>
          <p className="mt-2 font-serif text-sm text-[#5c2a2a]">{data.wedding.venue}</p>
        </motion.div>

        {ready
          ? petals.map((petal) => {
              const flown = flownRef.current.has(petal.id);
              const spot = flown ? petal.end : petal.start;
              return (
                <motion.span
                  key={petal.id}
                  className="pointer-events-none absolute z-20"
                  initial={false}
                  animate={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    rotate: spot.rot,
                    scale: flown ? 1 : 1,
                  }}
                  transition={{
                    duration: flown ? 0.85 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    width: spot.size,
                    height: spot.size,
                    marginLeft: -spot.size / 2,
                    marginTop: -spot.size / 2,
                  }}
                >
                  {petalUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={petalUrl} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <svg viewBox="0 0 64 80" className="h-full w-full">
                      <path
                        d="M32 76C12 54 8 30 20 16C27 8 32 12 32 20C32 12 37 8 44 16C56 30 52 54 32 76Z"
                        fill="#d2042d"
                      />
                    </svg>
                  )}
                </motion.span>
              );
            })
          : null}
      </div>

      <p className="mt-4 min-h-6 font-serif text-sm text-[#8f1d2c]/70">
        {revealed ? "" : "Scratch the petals"}
      </p>

      {ready ? (
        <div className="w-full max-w-md">
          <Countdown iso={data.wedding.iso} visible={revealed} />
        </div>
      ) : null}

      {revealed ? (
        <button
          type="button"
          onClick={onScroll}
          className="mt-8 font-cinzel text-xs tracking-[0.28em] text-[#8f1d2c] uppercase"
        >
          Continue
        </button>
      ) : null}
    </section>
  );
}
