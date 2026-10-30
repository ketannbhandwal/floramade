"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OrderTimeline from "@/components/ui/OrderTimeline";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { openProfessionalInvoice } from "@/lib/invoice-generator";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  MessageCircle,
  RotateCcw,
  Printer,
  Calendar,
  AlertTriangle,
  Package,
  CreditCard,
  Banknote,
  ExternalLink
} from "lucide-react";

const STATUS_DETAILS = {
  placed: {
    label: "Order Placed",
    color: "bg-[#101D17]/10 text-[#101D17] border-[#101D17]/25",
    description: "Your order has been confirmed. Our team is preparing your Ayurvedic remedies.",
  },
  processing: {
    label: "Preparing in Pharmacy",
    color: "bg-amber-50 text-amber-900 border-amber-300",
    description: "Your herbs are being carefully blended and quality-checked at the Floramade facility.",
  },
  shipped: {
    label: "Dispatched & In Transit",
    color: "bg-blue-50 text-blue-900 border-blue-300",
    description: "Your package is on its way with our trusted courier partner. Delivery is imminent.",
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-900 border-emerald-300",
    description: "Package successfully delivered! Enjoy your ritual of holistic Ayurvedic health.",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-800 border-red-300",
    description: "This order was cancelled. Any prepaid amount will be refunded to your original source within 3-5 business days.",
  },
};

export default function OrderCard({ order, onStatusUpdate }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { addToCart } = useCart();

  const paymentMethod = order.paymentMethod || "razorpay";
  const statusKey = (order.status || "placed").toLowerCase();
  const statusInfo = STATUS_DETAILS[statusKey] || STATUS_DETAILS.placed;

  // Format order date
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = orderDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = orderDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate estimated delivery: 4 days after order date
  const estDeliveryDate = new Date(orderDate);
  estDeliveryDate.setDate(estDeliveryDate.getDate() + 4);
  const formattedEstDelivery = estDeliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  // Copy Order ID
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId || "");
    setCopied(true);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick Buy Again
  const handleBuyAgain = (item) => {
    addToCart({
      id: item.productId,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug || "madhu-diabetes-pro",
    });
    toast.success(`${item.name} added to cart`);
  };

  // Cancel Order action
  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      const res = await fetch("/api/orders/mine", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id, action: "cancel" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel order");
      }
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      if (onStatusUpdate) {
        onStatusUpdate(order._id, "cancelled");
      } else {
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  // WhatsApp Support click
  const whatsappUrl = `https://wa.me/919220251059?text=${encodeURIComponent(
    `Hello Floramade Support, I need help with my Order #${order.orderId || order._id}`
  )}`;

  // Print professional invoice
  const handlePrintReceipt = () => {
    openProfessionalInvoice(order);
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-[#E0D9C8] bg-white shadow-[0_4px_20px_rgba(18,61,43,0.03)] hover:shadow-[0_8px_30px_rgba(18,61,43,0.06)] transition-all duration-300 overflow-hidden">
      {/* 1. Header Bar */}
      <div className="p-4 sm:p-6 border-b border-[#E0D9C8]/80 bg-white/40 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Order ID & Date */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-tight font-bold text-[#171717]/50">Order</span>
            <span className="font-bold text-sm sm:text-base tracking-tight text-[#171717]">
              #{order.orderId || order._id}
            </span>
            <button
              onClick={handleCopyOrderId}
              title="Copy Order ID"
              className="p-1 rounded-md text-[#171717]/40 hover:text-[#101D17] hover:bg-[#101D17]/10 transition-colors"
            >
              {copied ? <Check size={13} className="text-[#101D17]" /> : <Copy size={13} />}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#171717]/55 tracking-tight">
            <Calendar size={12} className="text-[#101D17]/70" />
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Right: Status & Payment Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-tight border uppercase text-[10px] sm:text-[11px] ${statusInfo.color}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusInfo.label}
          </span>

          {/* Payment Method Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-tight border border-[#E0D9C8] bg-white text-[#171717]">
            {paymentMethod === "cod" ? (
              <>
                <Banknote size={12} className="text-[#101D17]" />
                <span>Cash on Delivery</span>
              </>
            ) : (
              <>
                <CreditCard size={12} className="text-[#101D17]" />
                <span>Prepaid (Razorpay)</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* 2. Order Tracking Timeline Section */}
      <div className="p-4 sm:p-6 sm:pb-5 space-y-4 border-b border-[#E0D9C8]/60 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs uppercase tracking-[0.06em] font-bold text-[#171717]/50">
              Live Order Status
            </h4>
            <p className="text-xs sm:text-sm text-[#171717]/80 tracking-tight font-medium mt-0.5">
              {statusInfo.description}
            </p>
          </div>

          {statusKey !== "delivered" && statusKey !== "cancelled" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101D17]/5 border border-[#101D17]/20 text-[#101D17] text-xs font-bold tracking-tight self-start sm:self-auto">
              <span>Expected Delivery:</span>
              <span className="underline decoration-[#101D17]/40">{formattedEstDelivery}</span>
            </div>
          )}
        </div>

        {/* Visual Stepper */}
        <div className="pt-2">
          <OrderTimeline status={statusKey} />
        </div>
      </div>

      {/* 3. Items Summary */}
      <div className="p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-[0.06em] font-bold text-[#171717]/50">
            Items ({(order.items || []).length})
          </h4>
          <span className="text-xs font-bold text-[#171717] tracking-tight">
            Order Total: <span className="text-base sm:text-lg text-[#101D17]">₹{order.amount?.toLocaleString()}</span>
          </span>
        </div>

        <div className="divide-y divide-[#E8D9C5]/50">
          {(order.items || []).map((item, idx) => (
            <div
              key={`${order._id}-${item.productId || idx}`}
              className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-[#E0D9C8] bg-white/50 overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/product/${item.slug || "madhu-diabetes-pro"}`}
                    className="text-xs sm:text-sm font-bold tracking-tight text-[#171717] hover:text-[#101D17] transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-[11px] text-[#171717]/50 tracking-tight mt-0.5">
                    Qty: <span className="font-bold text-[#171717]">{item.quantity}</span>
                    {item.price && (
                      <span className="ml-2">@ ₹{item.price.toLocaleString()} each</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action: Buy Again Button */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.price && (
                  <span className="text-xs sm:text-sm font-bold text-[#171717] tracking-tight hidden sm:block">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                )}
                <button
                  onClick={() => handleBuyAgain(item)}
                  className="px-3 py-1.5 rounded-full border border-[#E0D9C8] bg-white hover:bg-[#101D17] hover:text-white hover:border-[#101D17] text-[#171717] text-[11px] font-bold tracking-tight transition-all duration-200 flex items-center gap-1"
                >
                  <RotateCcw size={11} />
                  <span>Buy Again</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Expandable Order Details & Delivery Address */}
      {expanded && (
        <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-[#E0D9C8]/60 bg-white/30 space-y-4 text-xs animate-in fade-in-50 duration-300">
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {/* Delivery Address Card */}
            <div className="p-4 rounded-xl border border-[#E0D9C8] bg-white space-y-2">
              <div className="flex items-center gap-2 text-[#101D17] font-bold uppercase tracking-tight text-[11px]">
                <MapPin size={13} />
                <span>Shipping Address</span>
              </div>
              <p className="font-bold text-sm text-[#171717] tracking-tight">
                {order.address?.fullName || "Recipient"}
              </p>
              <p className="text-xs text-[#171717]/70 tracking-tight leading-relaxed">
                {order.address?.addressLine}
                {order.address?.city ? `, ${order.address.city}` : ""}
                {order.address?.state ? `, ${order.address.state}` : ""}
                {order.address?.pincode ? ` - ${order.address.pincode}` : ""}
              </p>
              {order.address?.phone && (
                <div className="flex items-center gap-1.5 text-xs text-[#171717]/70 tracking-tight pt-1">
                  <Phone size={11} className="text-[#101D17]" />
                  <span>{order.address.phone}</span>
                </div>
              )}
            </div>

            {/* Price Breakdown Card */}
            <div className="p-4 rounded-xl border border-[#E0D9C8] bg-white space-y-2">
              <div className="flex items-center gap-2 text-[#101D17] font-bold uppercase tracking-tight text-[11px]">
                <Package size={13} />
                <span>Payment & Cost Summary</span>
              </div>
              <div className="space-y-1.5 pt-1 text-xs text-[#171717]/75">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="font-bold text-[#171717]">₹{order.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>
                <div className="flex justify-between border-t border-[#E0D9C8] pt-1.5 text-sm font-bold text-[#171717]">
                  <span>Grand Total</span>
                  <span className="text-[#101D17]">₹{order.amount?.toLocaleString()}</span>
                </div>
                {order.paymentId && (
                  <p className="text-[10px] text-[#171717]/40 tracking-tight pt-1">
                    Razorpay Ref: {order.paymentId}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Footer Controls Bar */}
      <div className="p-4 sm:px-6 border-t border-[#E0D9C8] bg-white flex flex-wrap items-center justify-between gap-3">
        {/* Toggle Details Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-bold text-[#101D17] hover:text-[#171717] transition-colors flex items-center gap-1.5 tracking-tight"
        >
          <span>{expanded ? "Hide Details" : "View Delivery Address & Receipt"}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Action Buttons: WhatsApp Support, Print Receipt, Cancel (if eligible) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Print Receipt */}
          <button
            onClick={handlePrintReceipt}
            className="px-3 py-1.5 rounded-full border border-[#E0D9C8] bg-white hover:bg-white text-[#171717] text-xs font-bold tracking-tight transition-colors flex items-center gap-1.5"
          >
            <Printer size={12} />
            <span className="hidden sm:inline">Print</span> Invoice
          </button>

          {/* WhatsApp Support with Pre-filled Order ID */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-tight transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <MessageCircle size={13} />
            <span>Support</span>
          </a>

          {/* Cancel Order Button (Available only if still 'placed') */}
          {statusKey === "placed" && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-3.5 py-1.5 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold tracking-tight transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#E0D9C8] shadow-2xl">
            <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171717] tracking-tight">Cancel this order?</h3>
              <p className="text-xs text-[#171717]/70 tracking-tight mt-1 leading-relaxed">
                Are you sure you want to cancel Order <strong>#{order.orderId || order._id}</strong>? If this was prepaid, a full refund will be initiated to your original payment method.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                disabled={isCancelling}
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#171717]/70 hover:bg-[#101D17]/5 transition-colors"
              >
                Keep Order
              </button>
              <button
                disabled={isCancelling}
                onClick={handleCancelOrder}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
