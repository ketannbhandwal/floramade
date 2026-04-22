import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidateTag } from 'next/cache';

export async function POST(request) {
  try {
    const { productId, rating, comment, name, image } = await request.json();

    if (!productId || !rating || !comment || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Add new review
    product.reviews.push({
      userId: user.userId,
      name,
      image: image || "", // Use provided image URL if any
      rating,
      comment,
      approved: true, // Auto-approve reviews
      createdAt: new Date(),
    });

    await product.save();

    revalidateTag('products');

    return NextResponse.json(
      { message: "Review submitted successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
