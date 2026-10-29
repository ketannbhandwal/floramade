import { revalidateTag } from 'next/cache';
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const includeAll = searchParams.get("includeAll") === "true";
  if (includeAll) {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  if (slug) {
    const product = await Product.findOne({ slug });
    return NextResponse.json({ product });
  }
  
  const query = includeAll ? {} : { isVisible: true };
  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  
  // No cache for admin
  return NextResponse.json({ products });
}

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  if (!payload.name) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }
  const cleanSlug = (text) => (text || "").toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  payload.slug = payload.slug ? cleanSlug(payload.slug) : cleanSlug(payload.name);
  const product = await Product.create(payload);
  revalidateTag('products');
  return NextResponse.json({ product }, { status: 201 });
}
