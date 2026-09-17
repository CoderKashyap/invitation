"use client";

import { useEffect, useState } from "react";
import type { Invitation } from "@/lib/invitation";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Countdown({ iso, visible }: { iso: string; visible: boolean }) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return null;

  const target = new Date(iso).getTime();
  const diff = Math.max(target - now, 0);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div
      className={`grid grid-cols-4 gap-2 overflow-hidden sm:gap-4 transition-all duration-700 ${
        visible
          ? "mt-10 max-h-40 translate-y-0 opacity-100"
          : "pointer-events-none mt-0 max-h-0 translate-y-6 opacity-0"
      }`}
    >
      {units.map((unit) => (
        <div
          key={unit.label}
          className="rounded-2xl border border-[#f9a8d4] bg-white px-1 py-4 text-center shadow-[0_10px_28px_rgba(225,29,72,0.1)] sm:px-3"
        >
          <p className="font-cinzel text-2xl text-[#c81e4a] sm:text-4xl">
            {pad(unit.value)}
          </p>
          <p className="mt-1 font-serif text-[10px] tracking-[0.2em] text-[#9d174d]/80 uppercase sm:text-xs">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CountdownNote({ data }: { data: Invitation }) {
  return (
    <p className="mt-5 font-serif text-sm italic text-[#6b2040]/80 sm:text-base">
      Until {data.groom.firstName} & {data.bride.firstName} say forever
    </p>
  );
}
