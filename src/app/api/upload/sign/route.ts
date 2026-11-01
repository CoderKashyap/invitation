import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { cloudinaryConfig, signCloudinaryParams } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = cloudinaryConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET, then redeploy." },
      { status: 500 },
    );
  }

  let kind = "";
  try {
    const body = (await request.json()) as { kind?: string };
    kind = String(body.kind ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  if (kind !== "image" && kind !== "video" && kind !== "audio") {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `invitation/${kind}`;
  const signature = signCloudinaryParams({ folder, timestamp }, config.apiSecret);

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    cloudName: config.cloudName,
    apiKey: config.apiKey,
  });
}
