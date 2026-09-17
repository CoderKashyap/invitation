"use client";

import type { Invitation } from "@/lib/invitation";
import { LotusDivider, OmMark } from "./Ornaments";

export function VenueMap({ data }: { data: Invitation }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(data.map.query)}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.map.query)}`;

  return (
    <section id="venue" className="relative px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-serif text-xs tracking-[0.4em] text-[#c81e4a] uppercase">
          Join us here
        </p>
        <h2 className="hero-names mt-3 text-5xl sm:text-6xl">Venue</h2>
        <LotusDivider />
        <p className="font-cinzel text-lg tracking-[0.14em] text-[#9d174d] uppercase">
          {data.map.label}
        </p>
        <p className="mt-2 font-serif text-[#6b2040]">{data.map.address}</p>
        <p className="mt-1 font-serif text-sm text-[#6b2040]/75">
          {data.wedding.displayDate} · {data.wedding.displayTime}
        </p>

        <div className="relative mt-10 overflow-hidden rounded-[28px] border border-[#f9a8d4] bg-white shadow-[0_18px_50px_rgba(225,29,72,0.12)]">
          <iframe
            title={`${data.map.label} on Google Maps`}
            src={src}
            className="pointer-events-none h-[280px] w-full border-0 md:h-[340px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
          />
        </div>

        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c81e4a] px-6 py-3 font-serif text-sm tracking-[0.18em] text-white uppercase transition hover:bg-[#9d174d]"
        >
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}

export function InvitationFooter({ data }: { data: Invitation }) {
  return (
    <footer className="relative z-20 overflow-hidden border-t border-[#f9a8d4] bg-[linear-gradient(180deg,#fffafb,#ffe4ec)] px-5 py-16 pb-24 text-center">
      <div className="pointer-events-none absolute top-0 right-8 left-8 h-px bg-linear-to-r from-transparent via-[#f472b6] to-transparent" />
      <OmMark />
      <LotusDivider />
      <p className="font-script text-4xl text-[#c81e4a] sm:text-5xl">
        We request the pleasure of your company
      </p>
      <p className="hero-names mt-3 text-4xl">
        {data.groom.firstName} & {data.bride.firstName}
      </p>
      <p className="mt-4 font-serif text-[#6b2040]">
        {data.wedding.displayDate}
      </p>
      <p className="mt-1 font-serif text-sm text-[#6b2040]/80">
        {data.map.label} · {data.wedding.city}
      </p>
      <p className="mt-8 font-serif text-sm italic text-[#9d174d]/80">
        With love, light, and the blessings of our families
      </p>
      <p className="mt-10 font-serif text-[11px] tracking-[0.28em] text-[#9d174d]/50 uppercase">
        A wedding invitation
      </p>
    </footer>
  );
}
