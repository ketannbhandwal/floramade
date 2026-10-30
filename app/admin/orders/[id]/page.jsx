import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Order from "@/models/Order";
import Link from "next/link";
import Image from "next/image";
import OrderTimeline from "@/components/ui/OrderTimeline";
import { ArrowLeft, MapPin, Phone, CreditCard, Banknote, Calendar } from "lucide-react";

async function getOrder(id) {
  try {
    const order = await Order.findById(id).populate("user", "name email phone").lean();
    return order ? JSON.parse(JSON.stringify(order)) : null;
  } catch {
    return null;
  }
}

export default async function AdminOrderDetailsPage({ params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") notFound();

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = orderDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="space-y-6 max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="h-9 w-9 rounded-full bg-white border border-[#E0D9C8] flex items-center justify-center text-[#171717] hover:bg-[#123D2B] hover:text-white hover:border-[#123D2B] transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
            Order #{order.orderId || order._id}
          </h1>
          <p className="text-xs text-[#171717]/50 tracking-tight flex items-center gap-1.5 mt-0.5">
            <Calendar size={12} /> Placed on {formattedDate}
          </p>
        </div>
      </div>

      {/* Order Status & Stepper */}
      <div className="rounded-2xl border border-[#E0D9C8] bg-white p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.08em] font-bold text-[#171717]/50">
            Order Lifecycle
          </h2>
          <span className="capitalize px-3 py-1 rounded-full text-xs font-bold tracking-tight bg-[#123D2B]/10 text-[#123D2B] border border-[#123D2B]/20">
            {order.status || "placed"}
          </span>
        </div>
        <OrderTimeline status={order.status || "placed"} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Customer & Delivery */}
        <div className="rounded-2xl border border-[#E0D9C8] bg-white p-5 sm:p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-[0.08em] font-bold text-[#171717]/50 flex items-center gap-1.5">
            <MapPin size={13} className="text-[#123D2B]" /> Customer & Delivery Details
          </h2>
          <div className="space-y-1.5 text-sm text-[#171717] tracking-tight">
            <p className="font-bold">{order.address?.fullName || order.user?.name || "Customer"}</p>
            <p className="text-xs text-[#171717]/70">{order.user?.email}</p>
            <p className="text-xs text-[#171717]/70 flex items-center gap-1">
              <Phone size={12} className="text-[#123D2B]" /> {order.address?.phone || order.user?.phone || "N/A"}
            </p>
            <div className="pt-2 text-xs text-[#171717]/80 leading-relaxed border-t border-[#E0D9C8]/60 mt-2">
              <span className="font-semibold block text-[#171717]">Shipping Address:</span>
              {order.address?.addressLine}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="rounded-2xl border border-[#E0D9C8] bg-white p-5 sm:p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-[0.08em] font-bold text-[#171717]/50 flex items-center gap-1.5">
            <CreditCard size={13} className="text-[#123D2B]" /> Payment Summary
          </h2>
          <div className="space-y-2 text-sm text-[#171717] tracking-tight">
            <div className="flex justify-between items-center text-xs text-[#171717]/70">
              <span>Payment Mode</span>
              <span className="font-bold uppercase tracking-tight text-[#171717]">
                {order.paymentMethod || "razorpay"}
              </span>
            </div>
            {order.paymentId && (
              <div className="flex justify-between items-center text-xs text-[#171717]/70">
                <span>Payment Reference</span>
                <span className="font-mono text-[11px] text-[#123D2B]">{order.paymentId}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs text-[#171717]/70">
              <span>Delivery Cost</span>
              <span className="font-bold text-emerald-700">FREE</span>
            </div>
            <div className="flex justify-between items-center text-base font-bold text-[#171717] border-t border-[#E0D9C8]/60 pt-2">
              <span>Total Amount</span>
              <span className="text-[#123D2B]">₹{order.amount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="rounded-2xl border border-[#E0D9C8] bg-white p-5 sm:p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-[0.08em] font-bold text-[#171717]/50">
          Order Items ({(order.items || []).length})
        </h2>
        <div className="divide-y divide-[#E8D9C5]/60">
          {(order.items || []).map((item, idx) => (
            <div key={`${item.productId || idx}-${item.name}`} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-xl border border-[#E0D9C8] bg-white/50 overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight text-[#171717]">{item.name}</p>
                  <p className="text-xs text-[#171717]/50 tracking-tight">
                    Quantity: <span className="font-bold text-[#171717]">{item.quantity}</span>
                    {item.price && <span className="ml-2">@ ₹{item.price.toLocaleString()}</span>}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#171717] tracking-tight">
                ₹{((item.price || 0) * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
