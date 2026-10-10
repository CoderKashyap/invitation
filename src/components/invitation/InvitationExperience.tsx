"use client";

import { useCallback, useEffect, useState } from "react";
import type { Invitation } from "@/lib/invitation";
import { CeremonyChapters } from "./CeremonyChapters";
import { CoupleGallery } from "./CoupleGallery";
import { FlowerShower } from "./FlowerShower";
import { OpeningGate } from "./OpeningGate";
import { ScratchCards } from "./ScratchCards";
import { InvitationAudio } from "./InvitationAudio";
import { BrandingBar, InvitationFooter, VenueMap } from "./VenueFooter";

function jumpToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function InvitationExperience({ data }: { data: Invitation }) {
  const [opened, setOpened] = useState(false);
  const [visit, setVisit] = useState(0);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    jumpToTop();

    const onPageShow = (event: PageTransitionEvent) => {
      jumpToTop();
      if (event.persisted) {
        setOpened(false);
        setVisit((n) => n + 1);
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = opened ? "" : "hidden";
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [opened]);

  const openInvitation = useCallback(() => {
    jumpToTop();
    setOpened(true);
  }, []);

  const scrollToEvents = useCallback(() => {
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="invitation-page relative min-h-dvh w-full">
      <OpeningGate key={visit} data={data} onComplete={openInvitation} />
      <InvitationAudio src={data.backgroundAudio} active={opened} />
      <FlowerShower active={opened} />
      <main
        className={`relative z-10 w-full transition-opacity duration-700 ${
          opened ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <CoupleGallery data={data} />
        <ScratchCards data={data} onContinue={scrollToEvents} />
        <CeremonyChapters data={data} />
        <VenueMap data={data} />
        <InvitationFooter data={data} />
        <BrandingBar data={data} />
      </main>
    </div>
  );
}
