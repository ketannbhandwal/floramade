import { revalidateTag } from 'next/cache';
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_, { params }) {
  const { slug } = await params;
  let decodedSlug = slug;
  try { decodedSlug = decodeURIComponent(slug); } catch {}
  let product = await Product.findOne({ slug: decodedSlug });
  if (!product && decodedSlug !== slug) {
    product = await Product.findOne({ slug });
  }
  if (!product) {
    const slugified = (decodedSlug || "").toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    product = await Product.findOne({ slug: slugified });
  }
  if (!product) {
    if (decodedSlug?.includes("madhucurex") || decodedSlug?.includes("diabetes-pro")) {
      product = (await Product.findOne({ slug: "madhucurex-diabetes-pro" }))
        || (await Product.findOne({ slug: "diabetes-pro-madhucurex-powder" }));
    }
  }
  if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ message: "Not authorized - admin only" }, { status: 403 });
    }
    
    const { slug } = await params;
    const update = await req.json();
    const cleanSlug = (text) => (text || "").toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    if (update.slug) {
      update.slug = cleanSlug(update.slug);
    } else if (update.name) {
      update.slug = cleanSlug(update.name);
    }
    
    console.log("Updating product param slug:", slug);
    
    let product = null;
    const productId = update.productId || update._id || update.id;
    
    // 1. Try finding by unique ID first
    if (productId) {
      product = await Product.findOneAndUpdate(
        { _id: productId }, 
        { $set: update }, 
        { returnDocument: "after", new: true }
      );
    }
    
    // 2. Try finding by decoded slug
    if (!product && slug) {
      let decodedSlug = slug;
      try { decodedSlug = decodeURIComponent(slug); } catch {}
      product = await Product.findOneAndUpdate(
        { slug: decodedSlug }, 
        { $set: update }, 
        { returnDocument: "after", new: true }
      );
    }

    // 3. Try finding by raw slug
    if (!product && slug) {
      product = await Product.findOneAndUpdate(
        { slug }, 
        { $set: update }, 
        { returnDocument: "after", new: true }
      );
    }
    
    if (!product) {
      return NextResponse.json({ message: "Product not found", slug }, { status: 404 });
    }
    
    console.log("Updated product:", product.name);
    
    revalidateTag('products');
    return NextResponse.json({ 
      message: "Product updated",
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        description: product.description,
        featureImages: product.featureImages,
      }
    });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  let decodedSlug = slug;
  try { decodedSlug = decodeURIComponent(slug); } catch {}
  let product = await Product.findOneAndDelete({ slug: decodedSlug });
  if (!product && decodedSlug !== slug) {
    product = await Product.findOneAndDelete({ slug });
  }
  revalidateTag('products');
  return NextResponse.json({ message: "Deleted" });
}
