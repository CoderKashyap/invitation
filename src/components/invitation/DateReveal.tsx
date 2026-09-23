"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Invitation } from "@/lib/invitation";
import { Countdown } from "./Countdown";
import { GoldCorners, LotusDivider, OmMark } from "./Ornaments";
import { PartyPopper } from "./PartyPopper";

export function DateReveal({
  data,
  onScroll,
}: {
  data: Invitation;
  onScroll: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const [burst, setBurst] = useState(0);

  const open = () => {
    if (opened) return;
    setOpened(true);
    setBurst((n) => n + 1);
  };

  return (
    <section className="relative flex min-h-dvh w-full items-center justify-center bg-[#fff7f4] px-4 py-12">
      <PartyPopper burst={burst} />

      <article className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-[#f4d4c4] bg-[#fffaf6] shadow-[0_30px_80px_rgba(143,29,44,0.12)]">
        <GoldCorners />
        <div className="pointer-events-none absolute inset-x-5 top-5 h-px bg-linear-to-r from-transparent via-[#e8b4b8] to-transparent" />
        <div className="pointer-events-none absolute inset-x-5 bottom-5 h-px bg-linear-to-r from-transparent via-[#e8b4b8] to-transparent" />

        <div className="relative min-h-[72vh] sm:min-h-[640px]">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.button
                key="cover"
                type="button"
                onClick={open}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.55 }}
                className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
                aria-label="Break the seal to reveal the wedding date"
              >
                <OmMark className="text-3xl" />
                <p className="mt-5 font-cinzel text-[11px] tracking-[0.38em] text-[#9a3b3b] uppercase">
                  {data.scratchKicker}
                </p>
                <LotusDivider />
                <p className="max-w-xs font-serif text-lg leading-relaxed text-[#5c2a2a]">
                  A date has been chosen. Break the seal when you are ready.
                </p>

                <div className="relative mt-14 w-full">
                  <span className="absolute inset-x-0 top-1/2 h-[18px] -translate-y-1/2 bg-[linear-gradient(90deg,#7f1d1d,#be123c_40%,#fb7185_50%,#be123c_60%,#7f1d1d)] shadow-[0_8px_18px_rgba(127,29,29,0.28)]" />
                  <span className="relative z-10 mx-auto grid h-[74px] w-[74px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fb7185,#e11d48_62%,#9d174d)] shadow-[0_8px_16px_rgba(190,24,93,0.35),inset_0_0_0_3px_rgba(255,228,236,0.65)]">
                    <span className="absolute inset-2 rounded-full border border-dashed border-white/55" />
                    <span className="relative font-cinzel text-sm tracking-[0.18em] text-[#ffe4ec]">
                      {data.initials}
                    </span>
                  </span>
                </div>
                <p className="mt-10 font-cinzel text-[10px] tracking-[0.32em] text-[#9a3b3b] uppercase">
                  {data.scratchHint || "Tap the seal"}
                </p>
              </motion.button>
            ) : (
              <motion.div
                key="date"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center px-8 py-12 text-center"
              >
                <div className="flex w-full flex-col items-center">
                  <p className="font-cinzel text-[11px] tracking-[0.34em] text-[#9a3b3b] uppercase">
                    {data.wedding.weekday}
                  </p>
                  <p className="mt-3 font-cinzel text-7xl leading-none font-semibold text-[#8f1d2c] sm:text-8xl">
                    {data.wedding.day}
                  </p>
                  <p className="mt-4 font-cinzel text-sm tracking-[0.22em] text-[#9a3b3b] uppercase">
                    {data.wedding.month} {data.wedding.year}
                  </p>
                  <LotusDivider />
                  <p className="font-serif text-lg text-[#5c2a2a]">
                    {data.wedding.venue}
                  </p>
                  <p className="mt-1 font-serif text-sm text-[#5c2a2a]/70">
                    {data.wedding.city}
                  </p>

                  <div className="w-full max-w-sm">
                    <Countdown iso={data.wedding.iso} visible />
                  </div>

                  <button
                    type="button"
                    onClick={onScroll}
                    className="mt-8 font-cinzel text-[11px] tracking-[0.32em] text-[#8f1d2c] uppercase"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </article>
    </section>
  );
}
