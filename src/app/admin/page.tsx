import Link from "next/link";
import { getSession } from "@/lib/auth";
import { listInvitations, listUsers } from "@/lib/store";
import { DeleteInvitationButton } from "@/components/admin/DeleteInvitationButton";

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default async function AdminHomePage() {
  const session = await getSession();
  if (!session) return null;
  const invitations = await listInvitations(
    session.role === "SUPERADMIN" ? undefined : session.id,
  );
  const users = session.role === "SUPERADMIN" ? await listUsers() : [];
  const ownerName = (id: string) => users.find((user) => user.id === id)?.name ?? "You";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-serif text-xs tracking-[0.3em] text-[#c81e4a] uppercase">
            Dashboard
          </p>
          <h1 className="hero-names mt-1 text-5xl">Invitations</h1>
          <p className="mt-2 font-serif text-[#6b2040]">
            Each page gets its own shareable link. Edit words, dates, and images
            without changing the design.
          </p>
        </div>
        <Link
          href="/admin/invitations/new"
          className="rounded-full bg-[#c81e4a] px-5 py-3 font-serif text-sm tracking-[0.16em] text-white uppercase"
        >
          New invitation
        </Link>
      </div>

        <div className="mt-10 overflow-x-auto rounded-[28px] border border-[#f9a8d4] bg-white">
        {invitations.length === 0 ? (
          <p className="px-6 py-16 text-center font-serif text-[#6b2040]">
            No invitation pages yet. Create one to share a unique link.
          </p>
        ) : (
          <table className="w-full text-left font-serif">
            <thead className="bg-[#fff1f2] text-xs tracking-[0.16em] text-[#9d174d] uppercase">
              <tr>
                <th className="px-5 py-4">Couple / title</th>
                <th className="px-5 py-4">Link</th>
                <th className="px-5 py-4">Charged</th>
                <th className="px-5 py-4">Status</th>
                {session.role === "SUPERADMIN" ? <th className="px-5 py-4">Owner</th> : null}
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {invitations.map((item) => (
                <tr key={item.id} className="border-t border-[#fde4ea]">
                  <td className="px-5 py-4">
                    <p className="text-[#4a1530]">{item.title}</p>
                    <p className="text-sm text-[#9d174d]/70">{item.extraNotes || "No extra notes"}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/i/${item.slug}`} className="text-[#c81e4a]">
                      /i/{item.slug}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{money(item.chargedAmount)}</td>
                  <td className="px-5 py-4">
                    {item.published ? "Published" : "Draft"}
                  </td>
                  {session.role === "SUPERADMIN" ? (
                    <td className="px-5 py-4">{ownerName(item.ownerId)}</td>
                  ) : null}
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/invitations/${item.id}`}
                      className="mr-4 text-[#c81e4a]"
                    >
                      Edit
                    </Link>
                    <DeleteInvitationButton id={item.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
