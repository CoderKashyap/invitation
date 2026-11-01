import type { UploadKind } from "@/lib/uploads";

type SignResponse = {
  signature?: string;
  timestamp?: number;
  folder?: string;
  cloudName?: string;
  apiKey?: string;
  error?: string;
};

function cloudinaryError(payload: unknown) {
  if (!payload || typeof payload !== "object") return "Upload failed.";
  const error = (payload as { error?: { message?: string } }).error;
  return error?.message || "Upload failed.";
}

export async function uploadFileToCloudinary(
  file: File,
  kind: UploadKind,
  onProgress: (percent: number) => void,
) {
  onProgress(0);
  const signRes = await fetch("/api/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind }),
  });
  const sign = (await signRes.json()) as SignResponse;
  if (!signRes.ok || !sign.signature || !sign.timestamp || !sign.folder || !sign.cloudName || !sign.apiKey) {
    throw new Error(sign.error || "Could not start the Cloudinary upload.");
  }

  const body = new FormData();
  body.set("file", file);
  body.set("api_key", sign.apiKey);
  body.set("timestamp", String(sign.timestamp));
  body.set("signature", sign.signature);
  body.set("folder", sign.folder);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.max(1, Math.min(99, Math.round((event.loaded / event.total) * 100))));
    };
    xhr.onload = () => {
      let json: { secure_url?: string; error?: { message?: string } };
      try {
        json = JSON.parse(xhr.responseText) as { secure_url?: string; error?: { message?: string } };
      } catch {
        reject(new Error("Upload failed. Cloudinary returned an unexpected response."));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300 && json.secure_url) {
        onProgress(100);
        resolve(json.secure_url);
        return;
      }
      reject(new Error(cloudinaryError(json)));
    };
    xhr.onerror = () => reject(new Error("Upload failed before Cloudinary could respond."));
    xhr.send(body);
  });
}
