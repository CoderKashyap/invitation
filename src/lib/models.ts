import { Schema, models, model } from "mongoose";
import type { Invitation } from "@/lib/invitation";

const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ["SUPERADMIN", "ADMIN"] },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" },
);

const InvitationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    published: { type: Boolean, default: false },
    chargedAmount: { type: Number, default: 0 },
    extraNotes: { type: String, default: "" },
    ownerId: { type: String, required: true, index: true },
    content: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "invitations" },
);

export type UserDoc = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "SUPERADMIN" | "ADMIN";
  createdAt: Date;
};

export type InvitationDoc = {
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
};

export const UserModel = models.User || model("User", UserSchema);
export const InvitationModel =
  models.Invitation || model("Invitation", InvitationSchema);
