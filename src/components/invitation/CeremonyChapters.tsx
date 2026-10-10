"use client";

import { motion } from "motion/react";
import type { Ceremony, CeremonyTheme, Invitation } from "@/lib/invitation";
import { GoldCorners, LotusDivider } from "./Ornaments";

const THEMES: Record<
  CeremonyTheme,
  { overlay: string; accent: string; frame: string }
> = {
  haldi: {
    overlay:
      "bg-[linear-gradient(180deg,rgba(255,248,220,0.2),rgba(250,204,21,0.2)_50%,rgba(120,53,15,0.5))]",
    accent: "text-[#854d0e]",
    frame: "border-[#facc15]/50",
  },
  mehendi: {
    overlay:
      "bg-[linear-gradient(180deg,rgba(236,253,245,0.16),rgba(52,211,153,0.2)_50%,rgba(6,78,59,0.5))]",
    accent: "text-[#065f46]",
    frame: "border-[#6ee7b7]/50",
  },
  sangeet: {
    overlay:
      "bg-[linear-gradient(180deg,rgba(245,243,255,0.16),rgba(167,139,250,0.22)_50%,rgba(76,29,149,0.5))]",
    accent: "text-[#5b21b6]",
    frame: "border-[#c4b5fd]/50",
  },
  wedding: {
    overlay:
      "bg-[linear-gradient(180deg,rgba(255,241,242,0.16),rgba(251,113,133,0.2)_50%,rgba(136,19,55,0.48))]",
    accent: "text-[#9d174d]",
    frame: "border-[#fda4af]/60",
  },
  reception: {
    overlay:
      "bg-[linear-gradient(180deg,rgba(255,251,235,0.14),rgba(251,191,36,0.16)_50%,rgba(30,27,75,0.52))]",
    accent: "text-[#78350f]",
    frame: "border-[#fcd34d]/55",
  },
};

function CeremonyPanel({ ceremony }: { ceremony: Ceremony }) {
  const theme = THEMES[ceremony.theme] ?? THEMES.wedding;

  return (
    <section id={ceremony.id} className="relative isolate w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: ceremony.image ? `url(${ceremony.image})` : undefined,
          backgroundColor: "#4a1530",
        }}
      />
      {ceremony.showContent !== false ? (
        <div className={`absolute inset-0 ${theme.overlay}`} />
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl items-center px-5 py-20 sm:py-28">
        {ceremony.showContent !== false ? (
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div
              className={`relative rounded-[32px] border bg-[#fffafb] px-6 py-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.16)] sm:px-12 sm:py-14 ${theme.frame}`}
            >
              <GoldCorners />
              {ceremony.kicker ? (
                <p
                  className={`font-serif text-[11px] tracking-[0.42em] uppercase ${theme.accent}`}
                >
                  {ceremony.kicker}
                </p>
              ) : null}
              <h2 className="hero-names mt-3 break-words text-5xl sm:text-6xl">
                {ceremony.title}
              </h2>
              <LotusDivider />
              {ceremony.poem ? (
                <p className="mx-auto max-w-xl font-serif text-lg leading-relaxed tracking-normal break-words text-[#4a1530] sm:text-xl">
                  {ceremony.poem}
                </p>
              ) : null}
              <div className="mt-8 space-y-1 font-serif tracking-normal text-[#6b2040]">
                {ceremony.date ? <p>{ceremony.date}</p> : null}
                {ceremony.time ? <p>{ceremony.time}</p> : null}
                {ceremony.venue ? <p className="italic">{ceremony.venue}</p> : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

export function CeremonyChapters({ data }: { data: Invitation }) {
  if (!data.ceremonies.length) return null;

  return (
    <div id="events" className="flex flex-col">
      {data.ceremonies.map((ceremony) => (
        <CeremonyPanel key={ceremony.id} ceremony={ceremony} />
      ))}
    </div>
  );
}
