import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "product-media";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
const FILE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "You must be an admin to upload product media." },
        { status: 401 }
      );
    }

    let bytes;
    let contentType;

    const contentTypeHeader = req.headers.get("content-type") || "";

    // 1. Support multipart/form-data (FormData)
    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || typeof file === "string") {
        return NextResponse.json(
          { error: "Choose an image or video file first." },
          { status: 400 }
        );
      }

      contentType = file.type || "application/octet-stream";
      const arrayBuffer = await file.arrayBuffer();
      bytes = Buffer.from(arrayBuffer);
    } else {
      // 2. Support JSON base64 payloads
      const body = await req.json();
      const dataUrl = body?.image || body?.file;

      if (typeof dataUrl !== "string") {
        return NextResponse.json(
          { error: "Choose an image or video file first." },
          { status: 400 }
        );
      }

      const match = dataUrl.match(/^data:([^;,]+);base64,([A-Za-z0-9+/]+={0,2})$/);
      if (!match) {
        return NextResponse.json(
          { error: "The selected file could not be read. Choose a JPG, PNG, WebP, AVIF, GIF, SVG, or MP4 file." },
          { status: 400 }
        );
      }

      contentType = match[1];
      bytes = Buffer.from(match[2], "base64");
    }

    const extension = FILE_TYPES[contentType];
    if (!extension) {
      return NextResponse.json(
        { error: `This file type (${contentType}) is not supported. Please upload JPG, PNG, WebP, AVIF, GIF, SVG, or MP4.` },
        { status: 415 }
      );
    }

    const isVideo = contentType.startsWith("video/");
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (bytes.byteLength > maxBytes) {
      return NextResponse.json(
        { error: isVideo ? "Videos must be 25 MB or smaller." : "Images must be 10 MB or smaller." },
        { status: 413 }
      );
    }

    const path = `products/${randomUUID()}.${extension}`;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType,
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) {
      console.error("Supabase Storage upload failed:", error.message);
      return NextResponse.json(
        { error: `Supabase Storage upload failed: ${error.message}` },
        { status: 502 }
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
  } catch (error) {
    console.error("Product media upload failed:", error.message);
    return NextResponse.json(
      { error: error.message || "Product media upload failed." },
      { status: 500 }
    );
  }
}
