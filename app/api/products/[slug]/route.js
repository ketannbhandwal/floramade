import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_, { params }) {
  await connectDB();
  const { slug } = await params;
  const product = await Product.findOne({ slug });
  if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { slug } = await params;
  const update = await req.json();
  
  const product = await Product.findOneAndUpdate({ slug }, update, { returnDocument: "after" });
  
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
  
  return NextResponse.json({ product });
}

export async function DELETE(_, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { slug } = await params;
  await Product.findOneAndDelete({ slug });
  return NextResponse.json({ message: "Deleted" });
}
