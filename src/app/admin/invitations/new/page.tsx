import { getSession } from "@/lib/auth";
import { listUsers } from "@/lib/store";
import { CreateInvitationForm } from "@/components/admin/CreateInvitationForm";

export default async function NewInvitationPage() {
  const session = await getSession();
  if (!session) return null;
  const owners = session.role === "SUPERADMIN" ? await listUsers() : [];

  return (
    <div>
      <p className="font-serif text-xs tracking-[0.3em] text-[#c81e4a] uppercase">
        New page
      </p>
      <h1 className="hero-names mt-1 text-5xl">Create invitation</h1>
      <p className="mt-2 max-w-xl font-serif text-[#6b2040]">
        Start from the current design. You can then change every image and line of
        copy for this couple.
      </p>
      <CreateInvitationForm
        owners={owners}
        showOwner={session.role === "SUPERADMIN"}
      />
    </div>
  );
}
