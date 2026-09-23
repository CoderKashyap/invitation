import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#fffafb] px-5 text-center">
      <p className="font-serif text-xs tracking-[0.35em] text-[#c81e4a] uppercase">
        Missing page
      </p>
      <h1 className="hero-names mt-3 text-6xl">Invitation not found</h1>
      <Link href="/" className="mt-8 font-serif text-[#c81e4a]">
        Back home
      </Link>
    </main>
  );
}
