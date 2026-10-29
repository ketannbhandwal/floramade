import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const key_id = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)?.trim();
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!key_id || !key_secret) {
      throw new Error("Razorpay API keys are missing in environment variables. Please restart your server if you just added them.");
    }
    
    const { amount } = await req.json();
    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
    return NextResponse.json({ order, key: key_id });
  } catch (error) {
    console.error("Error in create-order route:", error);
    
    let errorMessage = "Failed to create order";
    if (error && typeof error === "object") {
      if (error.error && error.error.description) {
        errorMessage = error.error.description;
        if (errorMessage.toLowerCase().includes("authentication failed")) {
          errorMessage = "Razorpay Authentication failed. Please verify your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local.";
        }
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.description) {
        errorMessage = error.description;
      }
    }
    
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
