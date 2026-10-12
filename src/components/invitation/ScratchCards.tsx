"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Invitation } from "@/lib/invitation";
import { Countdown } from "./Countdown";
import { GoldCorners, LotusDivider } from "./Ornaments";
import { PartyPopper } from "./PartyPopper";

function paintFoil(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const rose = ctx.createLinearGradient(0, 0, width, height);
  rose.addColorStop(0, "#fff1f2");
  rose.addColorStop(0.18, "#fda4af");
  rose.addColorStop(0.4, "#e11d48");
  rose.addColorStop(0.62, "#fb7185");
  rose.addColorStop(0.82, "#be185d");
  rose.addColorStop(1, "#ffe4ec");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = rose;
  ctx.fillRect(0, 0, width, height);

  const sheen = ctx.createRadialGradient(
    width * 0.28,
    height * 0.22,
    8,
    width * 0.45,
    height * 0.4,
    Math.max(width, height) * 0.85,
  );
  sheen.addColorStop(0, "rgba(255,255,255,0.46)");
  sheen.addColorStop(0.45, "rgba(255,228,236,0.1)");
  sheen.addColorStop(1, "rgba(136,19,55,0.22)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);

  for (let x = -height; x < width + height; x += 14) {
    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate(Math.PI / 5.2);
    ctx.fillStyle =
      x % 28 === 0 ? "rgba(255,241,242,0.24)" : "rgba(190,24,93,0.1)";
    ctx.fillRect(0, 0, 5, height * 2.4);
    ctx.restore();
  }

  ctx.fillStyle = "rgba(255,228,236,0.55)";
  for (let i = 0; i < 90; i += 1) {
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.4 + 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(255, 241, 242, 0.55)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 7]);
  ctx.strokeRect(12, 12, width - 24, height - 24);
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255, 241, 242, 0.92)";
  ctx.textAlign = "center";
  ctx.font = `600 16px "Cinzel", serif`;
  ctx.fillText("SCRATCH TO REVEAL", width / 2, height / 2 - 8);
  ctx.font = `500 15px "Cormorant Garamond", serif`;
  ctx.fillStyle = "rgba(255, 228, 236, 0.82)";
  ctx.fillText("The wedding date waits beneath", width / 2, height / 2 + 16);
}

export function ScratchCards({
  data,
  onContinue,
}: {
  data: Invitation;
  onContinue?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const drawing = useRef(false);
  const revealedRef = useRef(false);
  const foilLocked = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper || revealedRef.current || foilLocked.current) return;
    const rect = wrapper.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctxRef.current = ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintFoil(ctx, rect.width, rect.height);
  }, []);

  useEffect(() => {
    setupCanvas();
    const wrapper = wrapperRef.current;
    const observer = wrapper ? new ResizeObserver(() => setupCanvas()) : null;
    if (wrapper) observer?.observe(wrapper);
    window.addEventListener("resize", setupCanvas);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", setupCanvas);
    };
  }, [setupCanvas]);

  const finishReveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    setBurst((n) => n + 1);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  }, []);

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || revealedRef.current) return;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    for (let i = 3; i < pixels.length; i += 32) {
      if (pixels[i] < 120) clear += 1;
    }
    if (clear / (pixels.length / 32) > 0.18) finishReveal();
  }, [finishReveal]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || revealedRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 56;
    ctx.beginPath();
    const last = lastPoint.current;
    if (last) {
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.1, y);
    }
    ctx.stroke();
    lastPoint.current = { x, y };
    foilLocked.current = true;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (revealedRef.current) return;
    e.preventDefault();
    drawing.current = true;
    lastPoint.current = null;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* optional */
    }
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drawing.current) return;
    scratchAt(e.clientX, e.clientY);
    measure();
  };

  const onPointerUp = () => {
    drawing.current = false;
    lastPoint.current = null;
    measure();
  };

  return (
    <section
      id="scratch-cards"
      className="relative overflow-hidden px-5 py-14 sm:py-20"
      style={
        data.scratchUseTheme && data.scratchBackground
          ? {
              backgroundImage: `url(${data.scratchBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <PartyPopper burst={burst} />
      {data.scratchUseTheme && data.scratchBackground ? null : (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(251,113,133,0.22),transparent_70%)]" />
      )}
      <div className="relative mx-auto max-w-xl text-center">
        {/* <p className="font-serif text-xs tracking-[0.4em] text-[#c81e4a] uppercase">
          {data.scratchKicker || "The auspicious day"}
        </p> */}
        <h2 className="hero-names mt-3 text-5xl sm:text-6xl">
          {data.scratchTitle || "Scratch to reveal"}
        </h2>
        <LotusDivider />
        {/* <p className="mx-auto max-w-md font-serif text-lg leading-relaxed text-[#6b2040]">
          Gently scratch the foil to reveal the wedding date.
        </p> */}

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="scratch-luxury relative mx-auto mt-8 overflow-hidden rounded-[26px] border border-[#f9a8d4] bg-[#fffafb] p-4 shadow-[0_22px_50px_rgba(190,24,93,0.1)] sm:p-5"
        >
          <GoldCorners />
          <div
            ref={wrapperRef}
            className={`gold-foil relative h-[168px] w-full cursor-crosshair touch-none overflow-hidden rounded-[18px] select-none sm:h-[180px] ${
              revealed ? "is-revealed" : ""
            }`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(180deg,#fffafb,#fff1f2)] px-5 py-4 text-center">
              <p className="font-cinzel text-[10px] tracking-[0.34em] text-[#9a3b3b] uppercase">
                {data.wedding.weekday}
              </p>
              <p className="mt-1 font-cinzel text-5xl leading-none font-semibold text-[#8f1d2c] sm:text-6xl">
                {data.wedding.day}
              </p>
              <p className="mt-2 font-cinzel text-xs tracking-[0.22em] text-[#9a3b3b] uppercase">
                {data.wedding.month} {data.wedding.year}
              </p>
            </div>
            <canvas
              ref={canvasRef}
              className={`pointer-events-none absolute inset-0 z-10 h-full w-full transition-opacity duration-700 ${
                revealed ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
          <Countdown iso={data.wedding.iso} visible={revealed} compact />
          <p className="mt-3 font-serif text-sm tracking-normal text-[#8f1d2c]/75">
            {revealed ? "The date is revealed." : "Scratch the rose foil."}
          </p>
          {revealed && onContinue ? (
            <button
              type="button"
              onClick={onContinue}
              className="mt-3 font-cinzel text-[11px] tracking-[0.32em] text-[#8f1d2c] uppercase"
            >
              Continue
            </button>
          ) : null}
        </motion.article>
      </div>
    </section>
  );
}
