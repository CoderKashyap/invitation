"use client";

import { useRef, useState } from "react";
import type { Invitation } from "@/lib/invitation";
import { OmMark } from "./Ornaments";

export function OpeningGate({
  data,
  onComplete,
}: {
  data: Invitation;
  onComplete: () => void;
}) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const started = useRef(false);

  const open = () => {
    if (started.current) return;
    started.current = true;
    setOpening(true);
    window.setTimeout(() => {
      onComplete();
    }, 1650);
    window.setTimeout(() => setGone(true), 2400);
  };

  if (gone) return null;

  return (
    <div
      className={`opening-gate ${opening ? "is-opening" : ""}`}
      role="dialog"
      aria-label="Open wedding invitation"
    >
      <div className="door-stage">
        <div className="door door-left">
          <div
            className="door-skin"
            style={{ backgroundImage: `url(${data.doorImage})` }}
          />
        </div>
        <div className="door door-right">
          <div
            className="door-skin door-skin-right"
            style={{ backgroundImage: `url(${data.doorImage})` }}
          />
        </div>
      </div>

      <div className="relative z-20 flex min-h-full flex-col items-center justify-center px-4">
        <p className="envelope-caption mb-7">
          A wedding invitation awaits
        </p>

        <button
          type="button"
          onClick={open}
          className={`envelope ${opening ? "is-open" : ""}`}
          aria-label="Open envelope"
        >
          <span className="envelope-shadow" />
          <span className="envelope-body" />
          <span className="envelope-pocket" />
          <span className="envelope-letter">
            <OmMark className="text-2xl" />
            <span className="font-script text-3xl text-[#be185d]">
              {data.groom.firstName} & {data.bride.firstName}
            </span>
            <span className="mt-1 font-serif text-[10px] tracking-[0.3em] text-[#9d174d] uppercase">
              Request the pleasure
            </span>
          </span>
          <span className="envelope-flap" />
          <span className={`wax-seal ${opening ? "is-broken" : ""}`}>
            <span className="font-cinzel text-sm tracking-widest text-[#ffe4ec]">
              {data.initials}
            </span>
          </span>
        </button>

        <p className="envelope-caption mt-8">
          {opening ? "Opening…" : "Tap the seal to open"}
        </p>
      </div>
    </div>
  );
}
