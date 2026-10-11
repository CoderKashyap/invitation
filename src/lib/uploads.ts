export type UploadKind = "image" | "video" | "audio";
export type UploadMode = "blob" | "local" | "unavailable";

const LIMITS: Record<UploadKind, number> = {
  image: 8 * 1024 * 1024,
  video: 40 * 1024 * 1024,
  audio: 15 * 1024 * 1024,
};

const TYPES: Record<UploadKind, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  audio: [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/aac",
    "audio/mp4",
    "audio/webm",
  ],
};

export function resolveUploadMode(): UploadMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.VERCEL) return "unavailable";
  return "local";
}

export function uploadLimit(kind: UploadKind) {
  return LIMITS[kind];
}

export function uploadContentTypes(kind: UploadKind) {
  return TYPES[kind];
}

export function readUploadKind(clientPayload: string | null): UploadKind {
  let kind: unknown;
  try {
    kind = JSON.parse(clientPayload || "{}").kind;
  } catch {
    kind = null;
  }
  if (kind === "image" || kind === "video" || kind === "audio") return kind;
  throw new Error("Invalid upload.");
}

export function uploadRejection(file: File, kind: UploadKind) {
  if (!file.size) return "Please choose a file.";
  if (!TYPES[kind].includes(file.type)) {
    if (kind === "video") return "Use an MP4, WEBM, or MOV video.";
    if (kind === "audio") return "Use an MP3, WAV, OGG, or AAC audio file.";
    return "Use a JPG, PNG, WEBP, or GIF image.";
  }
  if (file.size > LIMITS[kind]) {
    if (kind === "video") return "Videos must be under 40MB.";
    if (kind === "audio") return "Audio must be under 15MB.";
    return "Images must be under 8MB.";
  }
  return null;
}
