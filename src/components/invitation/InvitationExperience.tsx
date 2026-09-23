"use client";

import { useCallback, useEffect, useState } from "react";
import type { Invitation } from "@/lib/invitation";
import { CeremonyChapters } from "./CeremonyChapters";
import { CoupleGallery } from "./CoupleGallery";
import { FlowerShower } from "./FlowerShower";
import { DateReveal } from "./DateReveal";
import { OpeningGate } from "./OpeningGate";
import { InvitationFooter, VenueMap } from "./VenueFooter";

export function InvitationExperience({ data }: { data: Invitation }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = opened ? "" : "hidden";
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [opened]);

  const scrollToCouple = useCallback(() => {
    document.getElementById("couple")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="invitation-page relative min-h-dvh w-full">
      <OpeningGate data={data} onComplete={() => setOpened(true)} />
      <FlowerShower active={opened} />
      <main className={opened ? "relative z-10 w-full opacity-100" : "relative z-10 w-full opacity-0"}>
        <DateReveal data={data} onScroll={scrollToCouple} />
        <CoupleGallery data={data} />
        <CeremonyChapters data={data} />
        <VenueMap data={data} />
        <InvitationFooter data={data} />
      </main>
    </div>
  );
}
