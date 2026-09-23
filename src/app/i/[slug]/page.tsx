import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationExperience } from "@/components/invitation/InvitationExperience";
import { getSession } from "@/lib/auth";
import { getInvitationBySlug } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = await getInvitationBySlug(slug);
  if (!record) return { title: "Invitation" };
  return {
    title: `${record.content.groom.firstName} & ${record.content.bride.firstName} Wedding Invitation`,
    description: record.content.verse,
  };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await getInvitationBySlug(slug);
  if (!record) notFound();
  if (!record.published) {
    const session = await getSession();
    const allowed =
      session &&
      (session.role === "SUPERADMIN" || session.id === record.ownerId);
    if (!allowed) notFound();
  }
  return <InvitationExperience data={record.content} />;
}
