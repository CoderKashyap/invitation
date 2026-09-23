import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { invitation as defaultInvitation, normalizeInvitation } from "@/lib/invitation";
import type { Invitation } from "@/lib/invitation";
import { InvitationModel, UserModel } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import type { InvitationRecord, Role, User } from "@/lib/types";

type JsonStore = {
  users?: User[];
  invitations?: InvitationRecord[];
};

function toUser(row: {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt: Date;
}): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    name: row.name,
    role: row.role as Role,
    createdAt: row.createdAt.toISOString(),
  };
}

function toRecord(row: {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  chargedAmount: number;
  extraNotes: string;
  ownerId: string;
  content: Invitation;
  createdAt: Date;
  updatedAt: Date;
}): InvitationRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    published: row.published,
    chargedAmount: row.chargedAmount,
    extraNotes: row.extraNotes,
    ownerId: row.ownerId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    content: normalizeInvitation(row.content),
  };
}

function publicUser(user: User) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

async function importJsonBackup() {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "store.json"), "utf8");
    return JSON.parse(raw) as JsonStore;
  } catch {
    return null;
  }
}

async function ready() {
  await connectDB();
  const existing = await UserModel.countDocuments();
  if (existing > 0) return;

  const backup = await importJsonBackup();
  if (backup?.users?.length) {
    await UserModel.insertMany(
      backup.users.map((user) => ({
        ...user,
        createdAt: new Date(user.createdAt),
      })),
    );
    if (backup.invitations?.length) {
      await InvitationModel.insertMany(
        backup.invitations.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })),
      );
    }
    return;
  }

  const now = new Date();
  const adminId = randomUUID();
  await UserModel.insertMany([
    {
      id: randomUUID(),
      email: "superadmin@invitation.local",
      passwordHash: await bcrypt.hash("SuperAdmin123!", 10),
      name: "Super Admin",
      role: "SUPERADMIN",
      createdAt: now,
    },
    {
      id: adminId,
      email: "admin@invitation.local",
      passwordHash: await bcrypt.hash("Admin123!", 10),
      name: "Studio Admin",
      role: "ADMIN",
      createdAt: now,
    },
  ]);
  await InvitationModel.create({
    id: randomUUID(),
    slug: defaultInvitation.slug,
    title: `${defaultInvitation.groom.firstName} & ${defaultInvitation.bride.firstName}`,
    published: true,
    chargedAmount: 15000,
    extraNotes: "Demo client. City Palace package.",
    ownerId: adminId,
    content: defaultInvitation,
  });
}

export function cloneTemplate(slug: string): Invitation {
  const content = structuredClone(defaultInvitation);
  content.slug = slug;
  return content;
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function listUsers() {
  await ready();
  const users = await UserModel.find().sort({ createdAt: 1 }).lean();
  return users.map((user) => publicUser(toUser(user)));
}

export async function findUserByEmail(email: string) {
  await ready();
  const user = await UserModel.findOne({ email: email.trim().toLowerCase() }).lean();
  return user ? toUser(user) : null;
}

export async function findUserById(id: string) {
  await ready();
  const user = await UserModel.findOne({ id }).lean();
  return user ? toUser(user) : null;
}

export async function createUser(input: {
  email: string;
  password: string;
  name: string;
  role: Role;
}) {
  await ready();
  const email = input.email.trim().toLowerCase();
  const exists = await UserModel.findOne({ email }).lean();
  if (exists) throw new Error("An account with that email already exists.");
  const user = await UserModel.create({
    id: randomUUID(),
    email,
    passwordHash: await bcrypt.hash(input.password, 10),
    name: input.name.trim(),
    role: input.role,
  });
  return publicUser(toUser(user.toObject()));
}

export async function listInvitations(ownerId?: string) {
  await ready();
  const rows = await InvitationModel.find(ownerId ? { ownerId } : {})
    .sort({ updatedAt: -1 })
    .lean();
  return rows.map(toRecord);
}

export async function listPublishedInvitations() {
  await ready();
  const rows = await InvitationModel.find({ published: true })
    .sort({ updatedAt: -1 })
    .lean();
  return rows.map(toRecord);
}

export async function getInvitationById(id: string) {
  await ready();
  const row = await InvitationModel.findOne({ id }).lean();
  return row ? toRecord(row) : null;
}

export async function getInvitationBySlug(slug: string) {
  await ready();
  const row = await InvitationModel.findOne({ slug }).lean();
  return row ? toRecord(row) : null;
}

export async function createInvitation(input: {
  title: string;
  slug: string;
  chargedAmount: number;
  extraNotes: string;
  ownerId: string;
}) {
  await ready();
  const slug = normalizeSlug(input.slug);
  if (!slug) throw new Error("Please enter a valid link slug.");
  const taken = await InvitationModel.findOne({ slug }).lean();
  if (taken) throw new Error("That invitation link is already in use.");
  const row = await InvitationModel.create({
    id: randomUUID(),
    slug,
    title: input.title.trim() || slug,
    published: false,
    chargedAmount: Number.isFinite(input.chargedAmount) ? input.chargedAmount : 0,
    extraNotes: input.extraNotes.trim(),
    ownerId: input.ownerId,
    content: cloneTemplate(slug),
  });
  return toRecord(row.toObject());
}

export async function updateInvitation(
  id: string,
  patch: Partial<Omit<InvitationRecord, "id" | "createdAt">>,
) {
  await ready();
  const current = await InvitationModel.findOne({ id });
  if (!current) throw new Error("Invitation not found.");
  const nextSlug = patch.slug ? normalizeSlug(patch.slug) : current.slug;
  if (nextSlug !== current.slug) {
    const taken = await InvitationModel.findOne({ slug: nextSlug, id: { $ne: id } }).lean();
    if (taken) throw new Error("That invitation link is already in use.");
  }
  const content = patch.content
    ? { ...patch.content, slug: nextSlug }
    : { ...normalizeInvitation(current.content), slug: nextSlug };
  current.title = patch.title ?? current.title;
  current.slug = nextSlug;
  current.published = patch.published ?? current.published;
  current.chargedAmount = patch.chargedAmount ?? current.chargedAmount;
  current.extraNotes = patch.extraNotes ?? current.extraNotes;
  current.content = content;
  current.updatedAt = new Date();
  await current.save();
  return toRecord(current.toObject());
}

export async function deleteInvitation(id: string) {
  await ready();
  await InvitationModel.deleteOne({ id });
}
