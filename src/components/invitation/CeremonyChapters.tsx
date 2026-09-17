"use client";

import { motion } from "motion/react";
import type { Ceremony, Invitation } from "@/lib/invitation";
import { GoldCorners, LotusDivider } from "./Ornaments";

const THEMES: Record<
  Ceremony["theme"],
  { overlay: string; accent: string; frame: string }
> = {
  haldi: {
    overlay:
      "bg-[linear-gradient(180deg,rgba(255,248,220,0.15),rgba(250,204,21,0.18)_50%,rgba(120,53,15,0.45))]",
    accent: "text-[#854d0e]",
    frame: "border-[#facc15]/50",
  },
  mehendi: {
    overlay:
      "bg-[linear-gradient(180deg,rgba(236,253,245,0.12),rgba(52,211,153,0.16)_50%,rgba(6,78,59,0.45))]",
    accent: "text-[#065f46]",
    frame: "border-[#6ee7b7]/50",
  },
  sangeet: {
    overlay:
      "bg-[linear-gradient(180deg,rgba(245,243,255,0.12),rgba(167,139,250,0.18)_50%,rgba(76,29,149,0.45))]",
    accent: "text-[#5b21b6]",
    frame: "border-[#c4b5fd]/50",
  },
  wedding: {
    overlay:
      "bg-[linear-gradient(180deg,rgba(255,241,242,0.12),rgba(251,113,133,0.16)_50%,rgba(136,19,55,0.42))]",
    accent: "text-[#9d174d]",
    frame: "border-[#fda4af]/60",
  },
};

function CeremonyPanel({ ceremony }: { ceremony: Ceremony }) {
  const theme = THEMES[ceremony.theme];

  return (
    <section
      id={ceremony.id}
      className="relative flex h-[68vh] min-h-[68vh] items-end overflow-hidden sm:items-center"
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: `url(${ceremony.image})` }}
      />
      <div className={`absolute inset-0 ${theme.overlay}`} />

      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-3xl px-5 py-10 sm:py-14"
      >
        <div
          className={`relative overflow-hidden rounded-[32px] border bg-white/82 px-6 py-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.12)] backdrop-blur-md sm:px-12 sm:py-14 ${theme.frame}`}
        >
          <GoldCorners />
          <p
            className={`font-serif text-[11px] tracking-[0.42em] uppercase ${theme.accent}`}
          >
            {ceremony.kicker}
          </p>
          <h2 className="hero-names mt-3 text-5xl sm:text-6xl">{ceremony.title}</h2>
          <LotusDivider />
          <p className="mx-auto max-w-xl font-serif text-lg leading-relaxed text-[#4a1530] sm:text-xl">
            {ceremony.poem}
          </p>
          <div className="mt-8 space-y-1 font-serif text-[#6b2040]">
            <p>{ceremony.date}</p>
            <p>{ceremony.time}</p>
            <p className="italic">{ceremony.venue}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function CeremonyChapters({ data }: { data: Invitation }) {
  const preWedding = data.ceremonies.filter((c) => c.id !== "wedding");
  const wedding = data.ceremonies.find((c) => c.id === "wedding");

  return (
    <div>
      {preWedding.map((ceremony) => (
        <CeremonyPanel key={ceremony.id} ceremony={ceremony} />
      ))}
      {wedding ? <CeremonyPanel ceremony={wedding} /> : null}

      <section id="rituals" className="relative overflow-hidden bg-[#fff5f7] px-5 py-24">
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="font-serif text-xs tracking-[0.4em] text-[#c81e4a] uppercase">
            The wedding day
          </p>
          <h2 className="hero-names mt-3 text-5xl sm:text-6xl">
            Baarat, varmala & rituals
          </h2>
          <LotusDivider />
          <p className="mx-auto max-w-2xl font-serif text-lg text-[#6b2040]">
            {wedding?.poem}
          </p>
          <p className="mt-4 font-cinzel tracking-[0.18em] text-[#9d174d] uppercase">
            {data.wedding.displayDate}
          </p>
          <p className="mt-1 font-serif text-[#6b2040]/80">
            {data.wedding.venue}, {data.wedding.city}
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.rituals.map((ritual, index) => (
              <motion.article
                key={ritual.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.5 }}
                className="rounded-3xl border border-[#f9a8d4] bg-white p-6 text-left shadow-[0_12px_30px_rgba(225,29,72,0.08)]"
              >
                <p className="font-cinzel text-lg text-[#c81e4a]">{ritual.name}</p>
                <p className="mt-1 font-serif text-sm tracking-[0.2em] text-[#9d174d] uppercase">
                  {ritual.time}
                </p>
                <p className="mt-3 font-serif text-sm leading-relaxed text-[#6b2040]/85">
                  {ritual.note}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
