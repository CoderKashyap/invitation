"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Invitation } from "@/lib/invitation";
import { LotusDivider } from "./Ornaments";

export function CoupleGallery({ data }: { data: Invitation }) {
  const photos = data.coupleImages.filter((image) => image.src);

  const showText = data.showCoupleIntro !== false;

  return (
    <section id="couple" className="relative">
      {showText ? (
        <div className="px-5 py-20 text-center sm:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-serif text-xs tracking-[0.4em] text-[#c81e4a] uppercase">
              {data.greeting}
            </p>
            <h2 className="hero-names mt-3 text-5xl sm:text-6xl">
              {data.groom.firstName} & {data.bride.firstName}
            </h2>
            <LotusDivider />
            <p className="mx-auto max-w-2xl font-serif text-lg leading-relaxed text-[#6b2040]">
              {data.verse}
            </p>
            <p className="mt-3 font-serif text-sm italic text-[#9d174d]/85">
              {data.blessing}
            </p>
            <p className="mt-5 font-serif text-xs tracking-[0.28em] text-[#c81e4a] uppercase">
              {data.familiesLine}
            </p>
            <div className="mt-4 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="font-cinzel text-xl tracking-[0.2em] text-[#9d174d] uppercase">
                  {data.groom.fullName}
                </p>
                <p className="mt-2 font-serif text-sm text-[#6b2040]/80">
                  {data.groom.parents}
                </p>
              </div>
              <div>
                <p className="font-cinzel text-xl tracking-[0.2em] text-[#9d174d] uppercase">
                  {data.bride.fullName}
                </p>
                <p className="mt-2 font-serif text-sm text-[#6b2040]/80">
                  {data.bride.parents}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : data.coupleIntroImage ? (
        <div className="w-full leading-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.coupleIntroImage}
            alt={`${data.groom.firstName} and ${data.bride.firstName}`}
            className="block h-auto w-full"
          />
        </div>
      ) : null}

      {data.showGallery && photos.length ? (
        <div
          className="relative w-full overflow-hidden px-5 py-6 sm:py-8"
          style={
            data.galleryBackground
              ? {
                  backgroundImage: `url(${data.galleryBackground})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : undefined
          }
        >
        <div className="relative mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((image, index) => (
            <motion.figure
              key={`${image.src}-${index}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-[28px] border border-[#f9a8d4] bg-white shadow-[0_16px_40px_rgba(225,29,72,0.1)]"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={image.src}
                  alt={image.alt || image.caption || "Couple photo"}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#4a1530]/55 via-transparent to-transparent" />
              </div>
              {image.caption ? (
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-left font-script text-2xl text-white">
                  {image.caption}
                </figcaption>
              ) : null}
            </motion.figure>
          ))}
        </div>
        </div>
      ) : null}
    </section>
  );
}
