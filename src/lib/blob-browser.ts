import type { UploadKind } from "@/lib/uploads";

const CHUNK_SIZE = 3 * 1024 * 1024;

async function readJson(response: Response) {
  const text = await response.text();
  if (!text) {
    throw new Error(
      response.status === 413
        ? "This file is too large to upload."
        : "Upload failed before the server could respond.",
    );
  }
  try {
    return JSON.parse(text) as { url?: string; partUrl?: string; error?: string };
  } catch {
    throw new Error("Upload failed. The server returned an unexpected response.");
  }
}

export async function uploadFileToBlob(file: File, kind: UploadKind, onProgress: (percent: number) => void) {
  const total = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
  const uploadId = crypto.randomUUID();
  const partUrls: string[] = [];
  onProgress(0);

  for (let index = 0; index < total; index += 1) {
    const chunk = file.slice(index * CHUNK_SIZE, Math.min(file.size, (index + 1) * CHUNK_SIZE));
    const body = new FormData();
    body.set("uploadId", uploadId);
    body.set("index", String(index));
    body.set("total", String(total));
    body.set("filename", file.name);
    body.set("contentType", file.type);
    body.set("kind", kind);
    body.set("partUrls", JSON.stringify(partUrls));
    body.set("file", chunk, file.name);

    const response = await fetch("/api/upload", { method: "POST", body });
    const json = await readJson(response);
    if (!response.ok) throw new Error(json.error || "Upload failed");

    if (json.url) {
      onProgress(100);
      return json.url;
    }
    if (!json.partUrl) throw new Error("Upload failed while sending the file.");
    partUrls.push(json.partUrl);
    onProgress(Math.min(99, Math.round(((index + 1) / total) * 100)));
  }

  throw new Error("Upload finished without a file address.");
}
