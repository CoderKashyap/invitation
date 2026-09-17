"use client";

import { useMemo, type CSSProperties } from "react";

type Bloom = {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
  drift: string;
  rotate: string;
  kind: 0 | 1 | 2;
};

function Rose({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 28c-6-4.5-10-9-10-14 0-4 3-7 7-7 1.8 0 3.4.8 4.4 2C18.4 7.8 20 7 21.8 7c4 0 7 3 7 7 0 5-4 9.5-10 14Z" fill="#fb7185" />
      <path d="M16 26c-4.2-3.4-7.2-7-7.2-10.8 0-2.6 1.8-4.4 4-4.4 1.2 0 2.3.6 3 1.6.7-1 1.8-1.6 3-1.6 2.2 0 4 1.8 4 4.4 0 3.8-3 7.4-7.2 10.8Z" fill="#fda4af" />
      <circle cx="16" cy="14.5" r="2.2" fill="#fff1f2" />
      <path d="M10 24c2 1 4 2 6 2s4-1 6-2" stroke="#9d174d" strokeWidth="0.7" opacity=".35" />
    </svg>
  );
}

function Blossom({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="8" r="5" fill="#f9a8d4" />
      <circle cx="24" cy="13" r="5" fill="#fb7185" />
      <circle cx="22" cy="22" r="5" fill="#f472b6" />
      <circle cx="10" cy="22" r="5" fill="#fb7185" />
      <circle cx="8" cy="13" r="5" fill="#f9a8d4" />
      <circle cx="16" cy="16" r="4" fill="#fff7ed" />
      <circle cx="16" cy="16" r="1.8" fill="#e11d48" />
    </svg>
  );
}

function Lotus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 26c-2.4-4.2-7.4-7-11.5-8 2.8-1.3 5.6.2 7.2 1.7C10.2 14 11 9.2 16 6.4c5 2.8 5.8 7.6 4.3 13.3 1.6-1.5 4.4-3 7.2-1.7C23.4 19 18.4 21.8 16 26Z" fill="#f472b6" />
      <path d="M16 24c-1.6-3.2-5-5.4-8-6.2 2 .2 3.8 1.4 5 2.6C12.2 16 13 12.6 16 10.6c3 2 3.8 5.4 3 9.8 1.2-1.2 3-2.4 5-2.6-3 .8-6.4 3-8 6.2Z" fill="#fecdd3" />
      <circle cx="16" cy="16" r="1.6" fill="#fff1f2" />
    </svg>
  );
}

const KINDS = [Rose, Blossom, Lotus] as const;

export function FlowerShower({ active }: { active: boolean }) {
  const blooms = useMemo<Bloom[]>(
    () =>
      Array.from({ length: 22 }, (_, id) => ({
        id,
        left: `${(id * 4.6) % 100}%`,
        delay: `${(id * 0.5) % 9}s`,
        duration: `${10 + (id % 6)}s`,
        size: 16 + (id % 7) * 3,
        drift: `${id % 2 === 0 ? 22 : -26}px`,
        rotate: `${id % 2 === 0 ? 240 : -260}deg`,
        kind: (id % 3) as 0 | 1 | 2,
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="flower-layer" aria-hidden>
      {blooms.map((bloom) => {
        const Icon = KINDS[bloom.kind];
        return (
          <span
            key={bloom.id}
            className="mini-flower"
            style={
              {
                left: bloom.left,
                animationDelay: bloom.delay,
                animationDuration: bloom.duration,
                "--drift": bloom.drift,
                "--spin": bloom.rotate,
              } as CSSProperties
            }
          >
            <Icon size={bloom.size} />
          </span>
        );
      })}
    </div>
  );
}
