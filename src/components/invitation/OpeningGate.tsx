"use client";

import { useEffect, useRef, useState } from "react";
import type { Invitation } from "@/lib/invitation";

export function OpeningGate({
  data,
  onEnter,
  onComplete,
}: {
  data: Invitation;
  onEnter?: () => void;
  onComplete: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const started = useRef(false);
  const finishing = useRef(false);
  const revealed = useRef(false);
  const failsafe = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const finish = () => {
    if (finishing.current) return;
    finishing.current = true;
    window.clearTimeout(failsafe.current);
    setLeaving(true);
    onComplete();
    window.setTimeout(() => setGone(true), 900);
  };

  const revealVideo = () => {
    if (revealed.current) return;
    revealed.current = true;
    setReady(true);
  };

  const playVideo = async () => {
    const video = videoRef.current;
    if (!video || started.current) return;
    started.current = true;
    revealVideo();
    setPlaying(true);
    onEnter?.();
    try {
      await video.play();
      const duration = video.duration;
      const waitMs =
        duration && Number.isFinite(duration) ? (duration + 1.2) * 1000 : 20_000;
      window.clearTimeout(failsafe.current);
      failsafe.current = window.setTimeout(finish, waitMs);
    } catch {
      finish();
    }
  };

  useEffect(() => {
    if (!data.introVideo) {
      onEnter?.();
      onComplete();
      setGone(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const onReady = () => revealVideo();
    const onFail = () => finish();

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("canplaythrough", onReady);
    video.addEventListener("ended", finish);
    video.addEventListener("error", onFail);

    if (video.readyState >= 1) onReady();
    video.load();

    const timeout = window.setTimeout(onReady, 1200);

    return () => {
      window.clearTimeout(timeout);
      window.clearTimeout(failsafe.current);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", onFail);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.introVideo]);

  if (gone) return null;

  return (
    <div
      className={`opening-gate ${leaving ? "is-opening" : ""}`}
      role="dialog"
      aria-label="Wedding invitation opening"
    >
      {data.introVideo ? (
        <video
          ref={videoRef}
          className="intro-video is-visible"
          src={data.introVideo}
          playsInline
          preload="auto"
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (!video?.duration || !Number.isFinite(video.duration)) return;
            if (video.currentTime >= video.duration - 0.08) finish();
          }}
        />
      ) : null}

      {data.introVideo && !ready && !playing ? (
        <div className="intro-hold" aria-hidden="true" />
      ) : null}

      {data.introVideo && ready && !playing ? (
        <button
          type="button"
          className="intro-play-hit"
          onClick={() => void playVideo()}
          aria-label="Play opening video"
        />
      ) : null}
    </div>
  );
}
