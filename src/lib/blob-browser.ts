import type { UploadKind } from "@/lib/uploads";

const BLOB_API = "https://vercel.com/api/blob/";
const STALL_MS = 90_000;

function blobErrorMessage(body: string, status: number) {
  try {
    const data = JSON.parse(body) as { error?: string | { message?: string } };
    if (typeof data.error === "string" && data.error) return data.error;
    if (data.error && typeof data.error === "object" && data.error.message) return data.error.message;
  } catch {
    // The body was not JSON.
  }
  if (status === 413) return "This file is too large to upload.";
  return "Upload failed.";
}

function putBlob(file: File, pathname: string, clientToken: string, onProgress: (percent: number) => void) {
  const storeId = clientToken.split("_")[3] ?? "";
  if (!storeId) throw new Error("Upload could not start.");

  const endpoint = new URL(BLOB_API);
  endpoint.searchParams.set("pathname", pathname);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let settled = false;
    let lastProgress = Date.now();

    const finish = (error?: Error, url?: string) => {
      if (settled) return;
      settled = true;
      window.clearInterval(watchdog);
      if (error) reject(error);
      else resolve(url || "");
    };

    const watchdog = window.setInterval(() => {
      if (Date.now() - lastProgress < STALL_MS) return;
      xhr.abort();
      finish(new Error("Upload stalled. Check your connection and try a smaller file."));
    }, 5000);

    xhr.open("PUT", endpoint.toString());
    xhr.setRequestHeader("authorization", `Bearer ${clientToken}`);
    xhr.setRequestHeader("x-api-version", "12");
    xhr.setRequestHeader("x-api-blob-request-attempt", "0");
    xhr.setRequestHeader("x-vercel-blob-store-id", storeId);
    xhr.setRequestHeader("x-vercel-blob-access", "public");
    xhr.setRequestHeader("x-content-type", file.type);
    xhr.setRequestHeader("x-content-length", String(file.size));
    xhr.upload.onprogress = (event) => {
      lastProgress = Date.now();
      if (!event.lengthComputable || event.total <= 0) return;
      onProgress(Math.max(1, Math.min(99, Math.round((event.loaded / event.total) * 100))));
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        finish(new Error(blobErrorMessage(xhr.responseText, xhr.status)));
        return;
      }
      try {
        const data = JSON.parse(xhr.responseText) as { url?: string };
        if (!data.url) {
          finish(new Error("Upload finished without a file address."));
          return;
        }
        onProgress(100);
        finish(undefined, data.url);
      } catch {
        finish(new Error("Upload finished with an unexpected response."));
      }
    };
    xhr.onerror = () => finish(new Error("Upload failed. Check your connection and try again."));
    xhr.onabort = () => {
      if (!settled) finish(new Error("Upload stalled. Check your connection and try a smaller file."));
    };
    xhr.send(file);
  });
}

export async function uploadFileToBlob(file: File, kind: UploadKind, onProgress: (percent: number) => void) {
  const safeName = file.name.replace(/[^\w.-]+/g, "-").replace(/^-+/, "").slice(-80) || "file";
  const pathname = `uploads/${safeName}`;
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
          multipart: false,
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

  return putBlob(file, pathname, payload.clientToken, onProgress);
}
