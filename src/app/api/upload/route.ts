import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const IMAGES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const VIDEOS = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const AUDIOS = new Set(["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/aac", "audio/mp4", "audio/webm"]);

function extensionFor(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "video/quicktime") return "mov";
  if (type === "audio/mpeg" || type === "audio/mp3") return "mp3";
  return type.split("/")[1] || "bin";
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please choose a file." }, { status: 400 });
  }

  const isImage = IMAGES.has(file.type);
  const isVideo = VIDEOS.has(file.type);
  const isAudio = AUDIOS.has(file.type);
  if (!isImage && !isVideo && !isAudio) {
    return NextResponse.json(
      { error: "Use an image, MP4 / WEBM / MOV video, or an MP3 / WAV / OGG audio file." },
      { status: 400 },
    );
  }

  const limit = isVideo ? 40 * 1024 * 1024 : isAudio ? 15 * 1024 * 1024 : 8 * 1024 * 1024;
  if (file.size > limit) {
    return NextResponse.json(
      {
        error: isVideo
          ? "Videos must be under 40MB."
          : isAudio
            ? "Audio must be under 15MB."
            : "Images must be under 8MB.",
      },
      { status: 400 },
    );
  }

  const name = `${randomUUID()}.${extensionFor(file.type)}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, name), buffer);

  return NextResponse.json({ url: `/uploads/${name}` });
}
