"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Invitation } from "@/lib/invitation";
import { Countdown, CountdownNote } from "./Countdown";
import { LotusDivider } from "./Ornaments";
import { PartyPopper } from "./PartyPopper";

export function ScratchDate({ data }: { data: Invitation }) {
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

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#f3f3f3");
    gradient.addColorStop(0.2, "#c9cdd3");
    gradient.addColorStop(0.45, "#9aa1ab");
    gradient.addColorStop(0.7, "#dfe3e8");
    gradient.addColorStop(1, "#8b929c");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "rgba(255,255,255,0.28)";
    for (let x = -rect.height; x < rect.width; x += 10) {
      ctx.save();
      ctx.translate(x, 0);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(0, 0, 3, rect.height * 2);
      ctx.restore();
    }

    ctx.fillStyle = "rgba(0,0,0,0.08)";
    for (let i = 0; i < 180; i += 1) {
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1.2, 1.2);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, rect.width - 20, rect.height - 20);
    ctx.setLineDash([]);

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    ctx.fillStyle = "rgba(60, 64, 72, 0.88)";
    ctx.font = `700 18px "Cinzel", serif`;
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", cx, cy - 4);
    ctx.font = `500 13px "Cormorant Garamond", serif`;
    ctx.fillStyle = "rgba(60, 64, 72, 0.7)";
    ctx.fillText("Use your finger or cursor", cx, cy + 16);
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
    if (clear / (pixels.length / 32) > 0.22) finishReveal();
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
    ctx.lineWidth = 44;
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
      /* pointer capture is optional */
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
    <section id="date" className="relative px-5 py-20 sm:py-28">
      <PartyPopper burst={burst} />
      <div className="mx-auto max-w-xl text-center">
        <p className="font-serif text-xs tracking-[0.4em] text-[#c81e4a] uppercase">
          The auspicious day
        </p>
        <h2 className="mt-3 font-script text-5xl text-[#c81e4a] sm:text-6xl">
          Save our date
        </h2>
        <LotusDivider />

        <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-[22px] border border-[#e8c48a] bg-[#fffdf8] text-center shadow-[0_18px_40px_rgba(80,30,40,0.12)]">
          <div className="bg-[#c81e4a] px-5 py-3">
            <p className="font-cinzel text-sm tracking-[0.28em] text-white uppercase">
              Official scratch card
            </p>
          </div>
          <div className="px-5 pt-5">
            <p className="font-script text-3xl text-[#c81e4a]">
              {data.groom.firstName} & {data.bride.firstName}
            </p>
            <p className="mt-1 font-serif text-sm text-[#6b2040]">
              Scratch the silver panel to reveal the wedding date
            </p>
          </div>

          <div className="px-5 py-5">
            <div
              ref={wrapperRef}
              className={`foil-card relative aspect-2/1 w-full cursor-crosshair touch-none overflow-hidden rounded-[14px] border-[3px] border-dashed border-[#b0b6be] select-none ${
                revealed ? "is-revealed" : ""
              }`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fff7ed] px-4">
                <p className="font-serif text-xs tracking-[0.28em] text-[#c81e4a] uppercase">
                  {data.wedding.weekday}
                </p>
                <p className="hero-names text-6xl leading-none">
                  {data.wedding.day}
                </p>
                <p className="font-cinzel text-sm tracking-[0.18em] text-[#9d174d] uppercase">
                  {data.wedding.month} {data.wedding.year}
                </p>
              </div>
              <canvas
                ref={canvasRef}
                className={`pointer-events-none absolute inset-0 z-10 h-full w-full ${
                  revealed ? "opacity-0" : ""
                }`}
              />
            </div>
          </div>

          <div className="border-t border-dashed border-[#e8c48a] px-5 py-4">
            <p className="font-serif text-sm text-[#6b2040]">
              {data.wedding.venue}, {data.wedding.city}
            </p>
          </div>
        </div>

        <Countdown iso={data.wedding.iso} visible={revealed} />
        {revealed ? <CountdownNote data={data} /> : null}
      </div>
    </section>
  );
}
