"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function InvitationAudio({
  src,
  active,
  mediaRef,
}: {
  src: string;
  active: boolean;
  mediaRef?: RefObject<HTMLAudioElement | null>;
}) {
  const localRef = useRef<HTMLAudioElement>(null);
  const audioRef = mediaRef ?? localRef;
  const [on, setOn] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setOn(true);
    const onPause = () => setOn(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [src, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src || !active) return;

    const start = async () => {
      try {
        audio.volume = 0.55;
        await audio.play();
      } catch {
        /* click handler also tries play() */
      }
    };

    void start();
    return () => {
      audio.pause();
    };
  }, [src, active, audioRef]);

  if (!src) return null;

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (on) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch {
      /* ignored */
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        type="button"
        onClick={() => void toggle()}
        className={`fixed right-3 bottom-14 z-[90] grid h-9 w-9 place-items-center rounded-full bg-[#c81e4a] text-white shadow-[0_8px_18px_rgba(190,24,93,0.35)] ${
          active ? "" : "pointer-events-none opacity-0"
        }`}
        aria-label={on ? "Mute invitation audio" : "Play invitation audio"}
      >
        {on ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M4 9v6h3.5L12 19.5V4.5L7.5 9H4zm11.5 3a3.5 3.5 0 0 0-2-3.16v6.32A3.5 3.5 0 0 0 15.5 12zm0-7.2v1.62A6.5 6.5 0 0 1 20 12a6.5 6.5 0 0 1-4.5 5.58V19.2A8.1 8.1 0 0 0 21.6 12 8.1 8.1 0 0 0 15.5 4.8z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M4 9v6h3.5L12 19.5V4.5L7.5 9H4zm12.7-.3 1.4 1.4L16.4 12l1.7 1.9-1.4 1.4L15 13.4l-1.7 1.9-1.4-1.4L13.6 12l-1.7-1.9 1.4-1.4L15 10.6l1.7-1.9z" />
          </svg>
        )}
      </button>
    </>
  );
}
