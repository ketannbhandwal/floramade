import Image from "next/image";
import OrderTimeline from "@/components/ui/OrderTimeline";
import { Badge } from "@/components/ui/Badge";

const paymentVariant = {
  cod: "warning",
  razorpay: "success",
};

export default function OrderCard({ order }) {
  const paymentMethod = order.paymentMethod || "razorpay";

  return (
    <div className="space-y-2 rounded-2xl border border-[#dbe8bf] bg-white p-4 shadow-[0_14px_28px_-24px_rgba(78,102,66,0.55)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-[#35512d]">Order: {order.orderId}</p>
        <p className="text-sm text-[#718768]">{new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      <p className="text-[#607759]">Amount: Rs. {order.amount}</p>
      <div>
        <Badge variant={paymentVariant[paymentMethod] || "neutral"} className="capitalize">
          Payment: {paymentMethod}
        </Badge>
      </div>
      <OrderTimeline status={order.status} />
      <div className="grid gap-2 pt-1 sm:grid-cols-2">
        {(order.items || []).slice(0, 2).map((item) => (
          <div key={`${order._id}-${item.productId}`} className="flex items-center gap-2 rounded-lg border border-[#e9f0d2] bg-[#fbfdf3] p-2 text-sm text-[#5f7756]">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
            </div>
            <p>{item.name} x {item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
