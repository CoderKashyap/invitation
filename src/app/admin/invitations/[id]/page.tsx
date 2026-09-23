import { notFound, redirect } from "next/navigation";
import { InvitationEditor } from "@/components/admin/InvitationEditor";
import { getSession } from "@/lib/auth";
import { getInvitationById } from "@/lib/store";

export default async function EditInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const record = await getInvitationById(id);
  if (!record) notFound();
  if (session.role !== "SUPERADMIN" && record.ownerId !== session.id) {
    notFound();
  }
  return <InvitationEditor record={record} />;
}
