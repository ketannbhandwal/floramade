import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidateTag } from 'next/cache';
import { validateFormData, sanitizeInput, detectSpam } from "@/lib/validation";

const reviewSession = new Map();

export async function POST(request) {
  try {
    const { productId, rating, comment, name, image, title } = await request.json();

    const validation = validateFormData(
      { productId, rating, comment, name },
      {
        productId: { required: true },
        rating: { required: true },
        comment: { required: true, minLength: 3, maxLength: 2000, spamCheck: true },
        name: { required: true, minLength: 2, maxLength: 60 },
      }
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { error: Object.values(validation.errors)[0] },
        { status: 400 }
      );
    }

    if (detectSpam(comment) || detectSpam(name)) {
      return NextResponse.json(
        { error: "Invalid submission detected" },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Rate limit per IP: at most 1 review per 5 seconds
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const lastReview = reviewSession.get(clientIp);
    if (lastReview && Date.now() - lastReview < 5000) {
      return NextResponse.json(
        { error: "Please wait a moment before submitting another review" },
        { status: 429 }
      );
    }
    reviewSession.set(clientIp, Date.now());

    // Optional token: support both logged-in users and guest reviews
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let userId = "guest";
    if (token) {
      const user = verifyToken(token);
      if (user?.id) userId = user.id;
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Ensure reviews is initialized as an array
    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }

    // Create review object
    const newReview = {
      _id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
      userId,
      name: sanitizeInput(name),
      title: title ? sanitizeInput(title) : "",
      image: image || "",
      rating: numRating,
      comment: sanitizeInput(comment),
      approved: true, // Auto-approve reviews
      createdAt: new Date().toISOString(),
    };

    product.reviews.push(newReview);

    // Update product rating and reviewsCount
    const validRatings = product.reviews
      .filter((r) => r && typeof r.rating === "number" && !isNaN(r.rating))
      .map((r) => Number(r.rating));

    if (validRatings.length > 0) {
      const avg = validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length;
      product.rating = Number(avg.toFixed(1));
      product.reviewsCount = validRatings.length;
    } else {
      product.rating = numRating;
      product.reviewsCount = 1;
    }

    await product.save();

    revalidateTag('products');

    return NextResponse.json(
      { message: "Review submitted successfully!", review: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
