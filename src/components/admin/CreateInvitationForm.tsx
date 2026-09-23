"use client";

import { useActionState } from "react";
import { createInvitationAction } from "@/lib/actions";
import type { PublicUser } from "@/lib/types";

export function CreateInvitationForm({
  owners,
  showOwner,
}: {
  owners: PublicUser[];
  showOwner: boolean;
}) {
  const [state, action, pending] = useActionState(createInvitationAction, null);

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
      <label className="block font-serif text-sm text-[#6b2040]">
        Internal title
        <input
          name="title"
          required
          placeholder="Aarav & Diya"
          className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 outline-none focus:border-[#e11d48]"
        />
      </label>
      <label className="block font-serif text-sm text-[#6b2040]">
        Shareable link slug
        <input
          name="slug"
          required
          placeholder="aarav-diya"
          className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 outline-none focus:border-[#e11d48]"
        />
        <span className="mt-1 block text-xs text-[#9d174d]/70">
          Guests will open /i/your-slug
        </span>
      </label>
      <label className="block font-serif text-sm text-[#6b2040]">
        Amount charged from this client (INR)
        <input
          name="chargedAmount"
          type="number"
          min="0"
          step="1"
          defaultValue="0"
          className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 outline-none focus:border-[#e11d48]"
        />
      </label>
      <label className="block font-serif text-sm text-[#6b2040]">
        Additional client information
        <textarea
          name="extraNotes"
          rows={4}
          placeholder="Phone, package, delivery notes, extras…"
          className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 outline-none focus:border-[#e11d48]"
        />
      </label>
      {showOwner ? (
        <label className="block font-serif text-sm text-[#6b2040]">
          Assigned admin
          <select
            name="ownerId"
            className="mt-2 w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 outline-none focus:border-[#e11d48]"
          >
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#c81e4a] px-6 py-3 font-serif text-sm tracking-[0.16em] text-white uppercase disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create page"}
      </button>
    </form>
  );
}
