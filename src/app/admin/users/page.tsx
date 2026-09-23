import { redirect } from "next/navigation";
import { CreateAdminForm } from "@/components/admin/CreateAdminForm";
import { getSession } from "@/lib/auth";
import { listUsers } from "@/lib/store";

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "SUPERADMIN") redirect("/admin");
  const users = await listUsers();

  return (
    <div>
      <p className="font-serif text-xs tracking-[0.3em] text-[#c81e4a] uppercase">
        Access
      </p>
      <h1 className="hero-names mt-1 text-5xl">Admins</h1>
      <p className="mt-2 max-w-xl font-serif text-[#6b2040]">
        Superadmins can create more studio accounts. Admins only see the
        invitation pages assigned to them.
      </p>

      <div className="mt-8 overflow-hidden rounded-[28px] border border-[#f9a8d4] bg-white">
        <table className="w-full text-left font-serif">
          <thead className="bg-[#fff1f2] text-xs tracking-[0.16em] text-[#9d174d] uppercase">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-[#fde4ea]">
                <td className="px-5 py-4">{user.name}</td>
                <td className="px-5 py-4">{user.email}</td>
                <td className="px-5 py-4">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateAdminForm />
    </div>
  );
}
