import { revalidateTag } from 'next/cache';
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";
import { sortProducts } from "@/lib/utils";

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
  const rawProducts = await Product.find(query).lean();
  const products = sortProducts(rawProducts);
  
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

  // Ensure no existing IDs are passed to prevent duplicate key or collision errors
  delete payload._id;
  delete payload.id;
  delete payload.productId;
  delete payload.createdAt;
  delete payload.updatedAt;

  const cleanSlug = (text) => (text || "").toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  payload.slug = payload.slug ? cleanSlug(payload.slug) : cleanSlug(payload.name);

  // If slug already exists, make it uniquely appended to avoid duplicate slug error
  const existing = await Product.findOne({ slug: payload.slug });
  if (existing) {
    payload.slug = `${payload.slug}-${Date.now().toString().slice(-4)}`;
  }

  const product = await Product.create(payload);
  revalidateTag('products');
  return NextResponse.json({ product }, { status: 201 });
}
