"use client";

import { motion } from "motion/react";
import type { Invitation } from "@/lib/invitation";
import { LotusDivider } from "./Ornaments";

const THEME_DOT: Record<string, string> = {
  haldi: "bg-[#f4d35e]",
  mehendi: "bg-[#7dce8a]",
  sangeet: "bg-[#c4a0ff]",
  wedding: "bg-[#f4a5b8]",
};

export function EventsTimeline({ data }: { data: Invitation }) {
  return (
    <section id="events" className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-serif text-xs tracking-[0.4em] text-[#f4a5b8] uppercase">
          The celebrations
        </p>
        <h2 className="mt-3 font-script text-5xl text-[#ffe4ec] sm:text-6xl">
          Events & timeline
        </h2>
        <LotusDivider />
      </div>

      <ol className="relative mx-auto mt-14 max-w-xl">
        <span className="absolute top-2 bottom-2 left-[15px] w-px bg-linear-to-b from-[#f4a5b8] via-[#f4a5b8]/40 to-transparent sm:left-1/2" />
        {data.ceremonies.map((event, index) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: index * 0.05 }}
            className={`relative mb-10 flex gap-6 sm:mb-12 ${
              index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
            }`}
          >
            <span
              className={`absolute top-2 left-[9px] z-10 h-3.5 w-3.5 rounded-full ring-4 ring-[#2a0818] sm:left-1/2 sm:-translate-x-1/2 ${THEME_DOT[event.theme]}`}
            />
            <div className="ml-10 flex-1 sm:ml-0 sm:w-[calc(50%-28px)] sm:flex-none">
              <article className="rounded-3xl border border-[#f4a5b8]/25 bg-[#5c1a38]/55 p-5 text-left shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                <p className="font-serif text-[11px] tracking-[0.28em] text-[#f4a5b8] uppercase">
                  {event.kicker}
                </p>
                <h3 className="mt-1 font-cinzel text-xl text-[#ffe4ec]">
                  {event.title}
                </h3>
                <p className="mt-2 font-serif text-sm text-[#ffd6e0]/80">
                  {event.date}
                </p>
                <p className="font-serif text-sm text-[#ffd6e0]/70">{event.time}</p>
                <p className="mt-2 font-serif text-sm italic text-[#f4a5b8]/80">
                  {event.venue}
                </p>
              </article>
            </div>
            <div className="hidden flex-1 sm:block" />
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
