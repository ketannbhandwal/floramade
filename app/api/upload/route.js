import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "product-media";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 20 * 1024 * 1024;
const FILE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "You must be an admin to upload product media." }, { status: 401 });
    }

    const { image, file } = await req.json();
    const dataUrl = image || file;
    if (typeof dataUrl !== "string") {
      return NextResponse.json({ error: "Choose an image or video file first." }, { status: 400 });
    }

    const match = dataUrl.match(/^data:([^;,]+);base64,([A-Za-z0-9+/]+={0,2})$/);
    if (!match) {
      return NextResponse.json({ error: "The selected file could not be read. Choose a JPG, PNG, WebP, AVIF, GIF, MP4, MOV, or WebM file." }, { status: 400 });
    }

    const [, contentType, encoded] = match;
    const extension = FILE_TYPES[contentType];
    if (!extension) {
      return NextResponse.json({ error: "This file type is not supported." }, { status: 415 });
    }

    const bytes = Buffer.from(encoded, "base64");
    const isVideo = contentType.startsWith("video/");
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (bytes.byteLength > maxBytes) {
      return NextResponse.json({ error: isVideo ? "Videos must be 20 MB or smaller." : "Images must be 5 MB or smaller." }, { status: 413 });
    }

    const path = `products/${randomUUID()}.${extension}`;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Supabase Storage upload failed:", error.message);
      return NextResponse.json({ error: `Supabase Storage upload failed: ${error.message}` }, { status: 502 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
  } catch (error) {
    console.error("Product media upload failed:", error.message);
    return NextResponse.json({ error: error.message || "Product media upload failed." }, { status: 500 });
  }
}
