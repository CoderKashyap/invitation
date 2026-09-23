"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <form
      action={action}
      className="w-full max-w-md rounded-[28px] border border-[#f9a8d4] bg-white p-8 shadow-[0_20px_50px_rgba(225,29,72,0.12)]"
    >
      <p className="font-serif text-xs tracking-[0.35em] text-[#c81e4a] uppercase">
        Studio
      </p>
      <h1 className="hero-names mt-2 text-5xl">Sign in</h1>
      <p className="mt-3 font-serif text-[#6b2040]">
        Manage wedding invitation pages, images, and client charges.
      </p>
      {state && !state.ok ? (
        <p className="mt-5 rounded-2xl bg-[#fff1f2] px-4 py-3 font-serif text-sm text-[#c81e4a]">
          {state.error}
        </p>
      ) : null}
      <label className="mt-8 block font-serif text-sm text-[#6b2040]">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 text-[#4a1530] outline-none focus:border-[#e11d48]"
        />
      </label>
      <label className="mt-4 block font-serif text-sm text-[#6b2040]">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 text-[#4a1530] outline-none focus:border-[#e11d48]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="mt-8 w-full rounded-full bg-[#c81e4a] px-6 py-3 font-serif tracking-[0.18em] text-white uppercase disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Enter dashboard"}
      </button>
      <p className="mt-6 font-serif text-xs leading-relaxed text-[#9d174d]/70">
        Seeded accounts: superadmin@invitation.local / SuperAdmin123! and
        admin@invitation.local / Admin123!
      </p>
    </form>
  );
}
