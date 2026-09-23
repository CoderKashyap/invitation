"use client";

import { useActionState } from "react";
import { createAdminAction } from "@/lib/actions";

export function CreateAdminForm() {
  const [state, action, pending] = useActionState(createAdminAction, null);

  return (
    <form
      action={action}
      className="mt-8 max-w-xl space-y-5 rounded-[28px] border border-[#f9a8d4] bg-white p-8"
    >
      {state && !state.ok ? (
        <p className="rounded-2xl bg-[#fff1f2] px-4 py-3 font-serif text-sm text-[#c81e4a]">
          {state.error}
        </p>
      ) : null}
      {state && state.ok ? (
        <p className="rounded-2xl bg-[#fff1f2] px-4 py-3 font-serif text-sm text-[#c81e4a]">
          Admin created.
        </p>
      ) : null}
      <label className="block font-serif text-sm text-[#6b2040]">
        Name
        <input
          name="name"
          required
          className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 outline-none focus:border-[#e11d48]"
        />
      </label>
      <label className="block font-serif text-sm text-[#6b2040]">
        Email
        <input
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 outline-none focus:border-[#e11d48]"
        />
      </label>
      <label className="block font-serif text-sm text-[#6b2040]">
        Password
        <input
          name="password"
          type="password"
          minLength={8}
          required
          className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 outline-none focus:border-[#e11d48]"
        />
      </label>
      <label className="block font-serif text-sm text-[#6b2040]">
        Role
        <select
          name="role"
          defaultValue="ADMIN"
          className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 outline-none focus:border-[#e11d48]"
        >
          <option value="ADMIN">Admin</option>
          <option value="SUPERADMIN">Superadmin</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#c81e4a] px-6 py-3 font-serif text-sm tracking-[0.16em] text-white uppercase disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
