"use client";

import Image from "next/image";
import type { Invitation } from "@/lib/invitation";
import { ScrollHint } from "./Ornaments";

export function HeroInvitation({
  data,
  onScroll,
}: {
  data: Invitation;
  onScroll: () => void;
}) {
  return (
    <section className="flex h-dvh w-full justify-center bg-[#fffafb]">
      <div className="relative h-full w-full lg:w-[min(100%,calc(100dvh*9/16))]">
        <Image
          src={data.heroImage}
          alt="Wedding greeting with floral arch and deities"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-x-[9%] top-[13%] bottom-[34%] flex flex-col items-center justify-center text-center">
          <p className="font-serif text-xs leading-loose font-semibold tracking-[0.2em] text-[#9d174d] uppercase sm:text-sm">
            {data.familiesLine}
          </p>
          <p className="mt-3 font-serif text-lg leading-relaxed text-[#6b2040]">
            The wedding celebration of
          </p>
          <h1 className="hero-names mt-4 text-7xl leading-[1.1] lg:text-8xl">
            {data.groom.firstName}
          </h1>
          <p className="font-serif text-sm leading-7 text-[#4a1530] sm:text-base sm:leading-8">
            {data.groom.parents}
          </p>
          <p className="font-script text-4xl leading-relaxed text-[#e11d48]">
            and
          </p>
          <h2 className="hero-names mt-2 text-7xl leading-[1.1] lg:text-8xl">
            {data.bride.firstName}
          </h2>
          <p className="mt-2 font-serif text-sm leading-7 text-[#4a1530] sm:text-base sm:leading-8">
            {data.bride.parents}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
          <ScrollHint onClick={onScroll} />
        </div>
      </div>
    </section>
  );
}
