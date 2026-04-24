import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, phone, email, message, type, productSlug } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and Phone are required" }, { status: 400 });
    }

    const inquiry = await Inquiry.create({
      name,
      phone,
      email,
      message,
      type: type || "consultation",
      productSlug,
    });

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error("Inquiry Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    // This should ideally be protected by admin middleware
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
