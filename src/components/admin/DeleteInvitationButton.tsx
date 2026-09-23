"use client";

import { deleteInvitationAction } from "@/lib/actions";

export function DeleteInvitationButton({ id }: { id: string }) {
  return (
    <form
      action={deleteInvitationAction}
      className="inline"
      onSubmit={(event) => {
        if (!window.confirm("Delete this invitation page?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-[#9d174d]/60">
        Delete
      </button>
    </form>
  );
}
