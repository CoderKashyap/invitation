import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  uploadContentTypes,
  uploadLimit,
  uploadRejection,
  type UploadKind,
} from "@/lib/uploads";

export const runtime = "nodejs";
export const maxDuration = 60;

const CHUNK_LIMIT = 4 * 1024 * 1024;

function extensionFor(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "video/quicktime") return "mov";
  if (type === "audio/mpeg" || type === "audio/mp3") return "mp3";
  return type.split("/")[1] || "bin";
}

function safeName(filename: string) {
  return filename.replace(/[^\w.-]+/g, "-").replace(/^-+/, "").slice(-80) || "file";
}

function isUploadKind(value: string): value is UploadKind {
  return value === "image" || value === "video" || value === "audio";
}

function isTempPart(url: string, uploadId: string) {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".public.blob.vercel-storage.com") &&
      parsed.pathname.startsWith(`/tmp/${uploadId}/`)
    );
  } catch {
    return false;
  }
}

async function saveLocalFile(file: File) {
  const kind = file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : "image";
  const rejection = uploadRejection(file, kind);
  if (rejection) return NextResponse.json({ error: rejection }, { status: 400 });

  const name = `${randomUUID()}.${extensionFor(file.type)}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  } catch {
    return NextResponse.json({ error: "The server could not save this file." }, { status: 500 });
  }
  return NextResponse.json({ url: `/uploads/${name}` });
}

async function saveBlobChunk(form: FormData, file: File) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage is not connected to this deployment." },
      { status: 500 },
    );
  }

  const uploadId = String(form.get("uploadId") ?? "");
  const kindValue = String(form.get("kind") ?? "");
  const contentType = String(form.get("contentType") ?? "");
  const index = Number(form.get("index"));
  const total = Number(form.get("total"));
  if (!/^[0-9a-f-]{36}$/i.test(uploadId) || !isUploadKind(kindValue)) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  if (!uploadContentTypes(kindValue).includes(contentType)) {
    return NextResponse.json({ error: "This file type cannot be uploaded." }, { status: 400 });
  }
  if (!Number.isInteger(index) || !Number.isInteger(total) || index < 0 || total < 1 || index >= total || total > 20) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  if (file.size === 0 || file.size > CHUNK_LIMIT) {
    return NextResponse.json({ error: "This file is too large to upload." }, { status: 400 });
  }

  const filename = safeName(String(form.get("filename") ?? "file"));
  let partUrls: string[] = [];
  try {
    partUrls = JSON.parse(String(form.get("partUrls") ?? "[]")) as string[];
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  if (!Array.isArray(partUrls) || partUrls.length !== index || partUrls.some((url) => !isTempPart(url, uploadId))) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  try {
    const chunk = Buffer.from(await file.arrayBuffer());
    if (index < total - 1) {
      const stored = await put(`tmp/${uploadId}/${index}`, chunk, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/octet-stream",
      });
      return NextResponse.json({ partUrl: stored.url });
    }

    const pieces = await Promise.all(
      partUrls.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Upload failed while saving the file.");
        return Buffer.from(await response.arrayBuffer());
      }),
    );
    const combined = Buffer.concat([...pieces, chunk]);
    if (combined.length > uploadLimit(kindValue)) {
      return NextResponse.json({ error: "This file is too large to upload." }, { status: 400 });
    }

    const stored = await put(`uploads/${filename}`, combined, {
      access: "public",
      addRandomSuffix: true,
      contentType,
    });
    if (partUrls.length) {
      await del(partUrls).catch(() => undefined);
    }
    return NextResponse.json({ url: stored.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Upload failed before the server could read the file." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please choose a file." }, { status: 400 });
  }

  if (form.get("uploadId")) return saveBlobChunk(form, file);

  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: "Refresh the page and try the upload again." },
      { status: 400 },
    );
  }
  return saveLocalFile(file);
}
