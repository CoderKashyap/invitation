"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { clearSessionCookie, getSession, setSessionCookie, signSession } from "@/lib/auth";
import {
  createInvitation,
  createUser,
  deleteInvitation,
  findUserByEmail,
  getInvitationById,
  updateInvitation,
} from "@/lib/store";
import type { Invitation } from "@/lib/invitation";
import type { Role } from "@/lib/types";

function fail(message: string) {
  return { ok: false as const, error: message };
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return fail("Invalid email or password.");
  }
  const token = await signSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await setSessionCookie(token);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

async function requireOwnedInvitation(id: string) {
  const session = await requireUser();
  const record = await getInvitationById(id);
  if (!record) throw new Error("Invitation not found.");
  if (session.role !== "SUPERADMIN" && record.ownerId !== session.id) {
    throw new Error("You do not have access to this invitation.");
  }
  return { session, record };
}

export async function createInvitationAction(_prev: unknown, formData: FormData) {
  const session = await requireUser();
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const chargedAmount = Number(formData.get("chargedAmount") ?? 0);
  const extraNotes = String(formData.get("extraNotes") ?? "");
  const ownerId =
    session.role === "SUPERADMIN"
      ? String(formData.get("ownerId") ?? session.id)
      : session.id;
  let id = "";
  try {
    const record = await createInvitation({
      title,
      slug,
      chargedAmount,
      extraNotes,
      ownerId,
    });
    id = record.id;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not create invitation.");
  }
  redirect(`/admin/invitations/${id}`);
}

export async function saveInvitationAction(input: {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  chargedAmount: number;
  extraNotes: string;
  content: Invitation;
}) {
  await requireOwnedInvitation(input.id);
  try {
    await updateInvitation(input.id, {
      title: input.title,
      slug: input.slug,
      published: input.published,
      chargedAmount: input.chargedAmount,
      extraNotes: input.extraNotes,
      content: input.content,
    });
    revalidatePath("/admin");
    revalidatePath(`/admin/invitations/${input.id}`);
    revalidatePath(`/i/${input.slug}`);
    revalidatePath("/");
    return { ok: true as const };
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not save invitation.");
  }
}

export async function deleteInvitationAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await requireOwnedInvitation(id);
  await deleteInvitation(id);
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function createAdminAction(_prev: unknown, formData: FormData) {
  const session = await requireUser();
  if (session.role !== "SUPERADMIN") {
    return fail("Only a superadmin can create admin accounts.");
  }
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const role = (String(formData.get("role") ?? "ADMIN") as Role) || "ADMIN";
  if (!name || !email || password.length < 8) {
    return fail("Name, email, and an 8+ character password are required.");
  }
  try {
    await createUser({ name, email, password, role });
    revalidatePath("/admin/users");
    return { ok: true as const };
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not create user.");
  }
}
