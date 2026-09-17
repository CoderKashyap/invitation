export function GoldCorners({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-3 sm:inset-5 ${className}`}>
      <span className="absolute top-0 left-0 h-10 w-10 border-t border-l border-[#f9a8d4]" />
      <span className="absolute top-0 right-0 h-10 w-10 border-t border-r border-[#f9a8d4]" />
      <span className="absolute bottom-0 left-0 h-10 w-10 border-b border-l border-[#f9a8d4]" />
      <span className="absolute right-0 bottom-0 h-10 w-10 border-b border-r border-[#f9a8d4]" />
    </div>
  );
}

export function LotusDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-3" aria-hidden>
      <span className="h-px w-12 bg-linear-to-r from-transparent to-[#f472b6] sm:w-20" />
      <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
        <path
          d="M14 20c-2.2-3.8-6.8-6.4-10.6-7.2 2.6-1.2 5.2.2 6.6 1.6C8.6 9.2 9.4 4.6 14 2c4.6 2.6 5.4 7.2 4 12.4 1.4-1.4 4-2.8 6.6-1.6C20.8 13.6 16.2 16.2 14 20Z"
          fill="#f472b6"
          fillOpacity="0.95"
        />
        <circle cx="14" cy="12.5" r="1.4" fill="#fff1f2" />
      </svg>
      <span className="h-px w-12 bg-linear-to-l from-transparent to-[#f472b6] sm:w-20" />
    </div>
  );
}

export function OmMark({ className = "" }: { className?: string }) {
  return (
    <p
      className={`font-script text-4xl leading-none text-[#c81e4a] ${className}`}
      aria-hidden
    >
      ॐ
    </p>
  );
}

export function ScrollHint({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2 text-[#9d174d]/80 transition hover:text-[#c81e4a]"
      aria-label="Scroll to continue"
    >
      <span className="font-serif text-[11px] tracking-[0.35em] uppercase">
        Scroll
      </span>
      <span className="scroll-chevron block h-8 w-5 rounded-full border border-[#f472b6]/70">
        <span className="mx-auto mt-1.5 block h-2 w-0.5 rounded-full bg-[#e11d48]" />
      </span>
    </button>
  );
}
