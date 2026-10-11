import type { UploadKind } from "@/lib/uploads";

const PART_SIZE = 8 * 1024 * 1024;
const MULTIPART_AFTER = 5 * 1024 * 1024;

type BlobJson = {
  url?: string;
  key?: string;
  uploadId?: string;
  etag?: string;
  error?: string | { message?: string };
};

function storeIdFromToken(clientToken: string) {
  const storeId = clientToken.split("_")[3] ?? "";
  if (!storeId) throw new Error("Upload could not start.");
  return storeId;
}

function errorFromBody(data: BlobJson, status: number) {
  if (typeof data.error === "string" && data.error) return data.error;
  if (data.error && typeof data.error === "object" && data.error.message) return data.error.message;
  if (status === 413) return "This file is too large to upload.";
  return `Upload failed (${status}).`;
}

async function blobRequest(
  apiPath: string,
  clientToken: string,
  fileType: string,
  init: RequestInit,
) {
  const storeId = storeIdFromToken(clientToken);
  let response: Response;
  try {
    response = await fetch(`https://vercel.com/api/blob${apiPath}`, {
      ...init,
      headers: {
        authorization: `Bearer ${clientToken}`,
        "x-api-version": "12",
        "x-api-blob-request-attempt": "0",
        "x-api-blob-request-id": `${storeId}:${Date.now()}:${Math.random().toString(16).slice(2)}`,
        "x-vercel-blob-store-id": storeId,
        "x-vercel-blob-access": "public",
        "x-content-type": fileType,
        ...(init.headers as Record<string, string> | undefined),
      },
    });
  } catch {
    throw new Error("Upload failed. Check your connection and try again.");
  }

  const text = await response.text();
  let data: BlobJson = {};
  try {
    data = text ? (JSON.parse(text) as BlobJson) : {};
  } catch {
    if (!response.ok) throw new Error(errorFromBody({}, response.status));
    throw new Error("Upload finished with an unexpected response.");
  }
  if (!response.ok) throw new Error(errorFromBody(data, response.status));
  return data;
}

async function putWholeFile(file: File, pathname: string, clientToken: string, onProgress: (percent: number) => void) {
  onProgress(1);
  const query = new URLSearchParams({ pathname });
  const data = await blobRequest(`/?${query.toString()}`, clientToken, file.type, {
    method: "PUT",
    body: file,
  });
  if (!data.url) throw new Error("Upload finished without a file address.");
  onProgress(100);
  return data.url;
}

async function putInParts(file: File, pathname: string, clientToken: string, onProgress: (percent: number) => void) {
  const query = new URLSearchParams({ pathname });
  const created = await blobRequest(`/mpu?${query.toString()}`, clientToken, file.type, {
    method: "POST",
    headers: { "x-mpu-action": "create" },
  });
  if (!created.uploadId || !created.key) throw new Error("Upload could not start.");

  const parts: { partNumber: number; etag: string }[] = [];
  let sent = 0;
  let partNumber = 1;
  while (sent < file.size) {
    const chunk = file.slice(sent, Math.min(sent + PART_SIZE, file.size));
    const uploaded = await blobRequest(`/mpu?${query.toString()}`, clientToken, file.type, {
      method: "POST",
      headers: {
        "x-mpu-action": "upload",
        "x-mpu-key": encodeURIComponent(created.key),
        "x-mpu-upload-id": created.uploadId,
        "x-mpu-part-number": String(partNumber),
      },
      body: chunk,
    });
    if (!uploaded.etag) throw new Error("Upload failed while sending the file.");
    parts.push({ partNumber, etag: uploaded.etag });
    sent += chunk.size;
    partNumber += 1;
    onProgress(Math.max(1, Math.min(99, Math.round((sent / file.size) * 100))));
  }

  const done = await blobRequest(`/mpu?${query.toString()}`, clientToken, file.type, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-mpu-action": "complete",
      "x-mpu-upload-id": created.uploadId,
      "x-mpu-key": encodeURIComponent(created.key),
    },
    body: JSON.stringify(parts),
  });
  if (!done.url) throw new Error("Upload finished without a file address.");
  onProgress(100);
  return done.url;
}

export async function uploadFileToBlob(file: File, kind: UploadKind, onProgress: (percent: number) => void) {
  const safeName = file.name.replace(/[^\w.-]+/g, "-").replace(/^-+/, "").slice(-80) || "file";
  const pathname = `uploads/${safeName}`;
  const multipart = file.size > MULTIPART_AFTER;
  onProgress(0);

  let response: Response;
  try {
    response = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "blob.generate-client-token",
        payload: {
          pathname,
          clientPayload: JSON.stringify({ kind }),
          multipart,
        },
      }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new Error("Upload could not start. Refresh the page and try again.");
  }

  const text = await response.text();
  let payload: { clientToken?: string; error?: string } = {};
  try {
    payload = text ? (JSON.parse(text) as { clientToken?: string; error?: string }) : {};
  } catch {
    throw new Error("Upload could not start. Refresh the page and try again.");
  }
  if (!response.ok || !payload.clientToken) {
    throw new Error(payload.error || "Upload could not start. Refresh the page and try again.");
  }

  if (multipart) return putInParts(file, pathname, payload.clientToken, onProgress);
  return putWholeFile(file, pathname, payload.clientToken, onProgress);
}
