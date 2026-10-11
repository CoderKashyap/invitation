import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  readUploadKind,
  uploadContentTypes,
  uploadLimit,
  uploadRejection,
} from "@/lib/uploads";

export const runtime = "nodejs";
export const maxDuration = 60;

function extensionFor(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "video/quicktime") return "mov";
  if (type === "audio/mpeg" || type === "audio/mp3") return "mp3";
  return type.split("/")[1] || "bin";
}

async function handleBlobUpload(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const session = await getSession();
        if (!session) throw new Error("Unauthorized");
        const kind = readUploadKind(clientPayload);
        return {
          allowedContentTypes: uploadContentTypes(kind),
          maximumSizeInBytes: uploadLimit(kind),
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

async function handleLocalUpload(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "This live site cannot store files on its own disk. In Vercel, open Storage, create a Blob store for this project, then redeploy.",
      },
      { status: 500 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please choose a file." }, { status: 400 });
  }

  const kind = file.type.startsWith("video/")
    ? "video"
    : file.type.startsWith("audio/")
      ? "audio"
      : "image";
  const rejection = uploadRejection(file, kind);
  if (rejection) {
    return NextResponse.json({ error: rejection }, { status: 400 });
  }

  const name = `${randomUUID()}.${extensionFor(file.type)}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  } catch {
    return NextResponse.json(
      { error: "The server could not save this file." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: `/uploads/${name}` });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return handleBlobUpload(request);
  return handleLocalUpload(request);
}
