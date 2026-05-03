import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const { Video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(request) {
  try {
    const { assetId } = await request.json();

    if (!assetId) {
      return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
    }

    const asset = await Video.assets.retrieve(assetId);
    
    const playbackId = asset.playback_ids?.[0]?.id;

    if (!playbackId) {
      return NextResponse.json({ error: "No playback ID found" }, { status: 404 });
    }

    return NextResponse.json({ playbackId });
  } catch (error) {
    console.error("Mux error:", error);
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
  }
}