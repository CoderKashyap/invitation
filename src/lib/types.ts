import type { Invitation } from "@/lib/invitation";

export type Role = "SUPERADMIN" | "ADMIN";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash">;

export type InvitationRecord = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  chargedAmount: number;
  extraNotes: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  content: Invitation;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};
