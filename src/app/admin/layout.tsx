import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/lib/actions";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-dvh bg-[#fffafb]">
      <header className="sticky top-0 z-30 border-b border-[#f9a8d4] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link href="/admin" className="hero-names text-3xl">
            Invitation studio
          </Link>
          <nav className="flex flex-wrap items-center gap-4 font-serif text-sm text-[#6b2040]">
            <Link href="/admin" className="hover:text-[#c81e4a]">
              Invitations
            </Link>
            {session.role === "SUPERADMIN" ? (
              <Link href="/admin/users" className="hover:text-[#c81e4a]">
                Admins
              </Link>
            ) : null}
            <span className="rounded-full bg-[#fff1f2] px-3 py-1 text-xs tracking-[0.12em] uppercase">
              {session.role === "SUPERADMIN" ? "Superadmin" : "Admin"} · {session.name}
            </span>
            <form action={logoutAction}>
              <button type="submit" className="text-[#c81e4a]">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
    </div>
  );
}
