import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import Order from "@/models/Order";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ orders });
}

export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { orderId, action } = await req.json();
    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
    }

    if (action === "cancel") {
      const order = await Order.findById(orderId);
      if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

      // Verify user owns this order
      const orderUserId = order.user?.id || order.user?._id || order.user;
      if (String(orderUserId) !== String(user.id)) {
        return NextResponse.json({ message: "Unauthorized to cancel this order" }, { status: 403 });
      }

      if (order.status !== "placed") {
        return NextResponse.json({
          message: "Order cannot be cancelled as it is already being processed or shipped. Please contact support."
        }, { status: 400 });
      }

      const updated = await Order.findByIdAndUpdate(
        orderId,
        { status: "cancelled" },
        { returnDocument: "after" }
      );

      return NextResponse.json({ message: "Order cancelled successfully", order: updated });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Order cancel error:", error);
    return NextResponse.json({ message: error.message || "Failed to update order" }, { status: 500 });
  }
}
