"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronRight,
  MapPin,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, total, clearCart } = useCart();
  const [buyNowItems] = useState(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("fiveetatv-buy-now-items");
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [address, setAddress] = useState(() => {
    if (typeof window === "undefined") {
      return {
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
      };
    }
    const saved = localStorage.getItem("fiveetatv-buy-now-address");
    if (!saved)
      return {
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
      };
    try {
      return {
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        ...JSON.parse(saved),
      };
    } catch {
      return {
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
      };
    }
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      const res = await fetch("/api/addresses");
      const data = await res.json();
      if (res.ok && data.addresses?.length > 0) {
        setSavedAddresses(data.addresses);
        const defaultAddr = data.addresses.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
          setAddress({
            fullName: defaultAddr.fullName,
            phone: defaultAddr.phone,
            addressLine: defaultAddr.addressLine,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
    }
  }

  function selectAddress(addr) {
    setSelectedAddressId(addr._id);
    setAddress({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setShowNewAddress(false);
  }

  const selectedItems = useMemo(
    () => (buyNowItems.length ? buyNowItems : cartItems),
    [buyNowItems, cartItems],
  );
  const subtotal = useMemo(
    () =>
      selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems],
  );
  const shippingCost = useMemo(() => (subtotal >= 600 ? 0 : 50), [subtotal]);
  const finalTotal = useMemo(
    () => subtotal + shippingCost,
    [subtotal, shippingCost],
  );

  async function placeCodOrder() {
    // Save address to profile if checkbox is checked
    if (
      saveToProfile &&
      address.fullName &&
      address.phone &&
      address.addressLine &&
      address.city &&
      address.state &&
      address.pincode
    ) {
      try {
        await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: address.fullName,
            phone: address.phone,
            addressLine: address.addressLine,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            isDefault: savedAddresses.length === 0,
          }),
        });
      } catch (error) {
        console.error("Failed to save address to profile:", error);
      }
    }

    const res = await fetch("/api/orders/cod", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems: selectedItems,
        amount: finalTotal,
        address,
        marketingConsent,
      }),
    });
    const data = await res.json();
    if (!res.ok)
      return toast.error(data.message || "Failed to place COD order");
    toast.success("COD order placed successfully");
    localStorage.removeItem("fiveetatv-buy-now-items");
    localStorage.removeItem("fiveetatv-buy-now-address");
    if (!buyNowItems.length) clearCart();
    router.push("/account");
  }

  async function handlePayment() {
    if (selectedItems.length === 0) return toast.error("Cart is empty");
    if (Object.values(address).some((value) => !String(value).trim())) {
      return toast.error("Please complete delivery address");
    }
    if (paymentMethod === "cod") return placeCodOrder();

    // 1. Safely load Razorpay script
    const isLoaded = await new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    if (!isLoaded) {
      return toast.error("Failed to load Razorpay SDK. Please check your connection.");
    }

    try {
      // 2. Create Order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order) {
        throw new Error(orderData.message || "Failed to create order. Please check server logs.");
      }

      const { order, key } = orderData;

      // 3. Razorpay Options with UPI priority override
      const options = {
        key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TtqcasTIbldvPe",
        amount: order.amount,
        currency: "INR",
        name: "Floramade",
        description: "Ayurvedic Wellness Products",
        order_id: order.id,
        prefill: {
          name: address.fullName || "",
          contact: address.phone || "",
        },
        config: {
          display: {
            blocks: {
              upi_block: {
                name: "Pay via UPI",
                instruments: [
                  {
                    method: "upi"
                  },
                ],
              },
              other_block: {
                name: "Other Payment Methods",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.upi_block", "block.other_block"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        theme: {
          color: "#39160D",
        },
        handler: async (response) => {
          // Save address to profile if checkbox is checked
          if (saveToProfile && address.fullName && address.phone && address.addressLine && address.city && address.state && address.pincode) {
            try {
              await fetch("/api/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  fullName: address.fullName,
                  phone: address.phone,
                  addressLine: address.addressLine,
                  city: address.city,
                  state: address.state,
                  pincode: address.pincode,
                  isDefault: savedAddresses.length === 0,
                }),
              });
            } catch (error) {
              console.error("Failed to save address to profile:", error);
            }
          }

          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, cartItems: selectedItems, amount: finalTotal, address, marketingConsent }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            toast.success("Order placed successfully");
            localStorage.removeItem("fiveetatv-buy-now-items");
            localStorage.removeItem("fiveetatv-buy-now-address");
            if (!buyNowItems.length) clearCart();
            router.push("/account");
          } else {
            toast.error(verifyData.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay modal dismissed by user.");
          },
        },
      };

      if (!options.key) {
        throw new Error("Razorpay Key is missing in frontend.");
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment setup failed:", error);
      toast.error(error.message || "Failed to initialize payment");
    }
  }

  if (selectedItems.length === 0) {
    return (
      <EmptyState
        title="No items to checkout"
        description="Add products to your cart before proceeding."
        action={
          <Link href="/">
            <Button>Explore Collection</Button>
          </Link>
        }
      />
    );
  }

  // Inline address form fields (NOT a component — avoids remount/focus-loss on every keystroke)
  const addressFormFields = (
    <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
      <Input
        label="Full Name"
        placeholder="e.g. John Doe"
        value={address.fullName}
        onChange={(e) =>
          setAddress((prev) => ({
            ...prev,
            fullName: e.target.value,
          }))
        }
      />
      <Input
        label="Phone Number"
        placeholder="e.g. 9220251059"
        value={address.phone}
        onChange={(e) =>
          setAddress((prev) => ({ ...prev, phone: e.target.value }))
        }
      />
      <Input
        label="City"
        placeholder="e.g. New Delhi"
        value={address.city}
        onChange={(e) =>
          setAddress((prev) => ({ ...prev, city: e.target.value }))
        }
      />
      <Input
        label="State"
        placeholder="e.g. Delhi"
        value={address.state}
        onChange={(e) =>
          setAddress((prev) => ({ ...prev, state: e.target.value }))
        }
      />
      <Input
        label="Pincode"
        placeholder="e.g. 110001"
        value={address.pincode}
        onChange={(e) =>
          setAddress((prev) => ({
            ...prev,
            pincode: e.target.value,
          }))
        }
      />
      <Input
        label="Complete Address"
        placeholder="House No, Building, Street, Area"
        value={address.addressLine}
        onChange={(e) =>
          setAddress((prev) => ({
            ...prev,
            addressLine: e.target.value,
          }))
        }
      />
      <div className="sm:col-span-2 flex items-center gap-2.5">
        <input
          type="checkbox"
          id="saveToProfile"
          checked={saveToProfile}
          onChange={(e) => setSaveToProfile(e.target.checked)}
          className="w-4 h-4 rounded border-[#E8D9C5] accent-[#872B10]"
        />
        <label
          htmlFor="saveToProfile"
          className="text-xs text-[#39160D]/60 tracking-tight"
        >
          Save this address to my profile for future orders
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF7EB]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 pt-28 md:pt-36 pb-12 md:pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[1px] w-8 bg-[#872B10]" />
            <span className="text-[10px] uppercase tracking-[0.08em] text-[#39160D]/50 font-semibold">Secure Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#39160D]">
            Checkout
          </h1>
          <p className="text-sm text-[#39160D]/50 tracking-tight mt-1.5">
            Fill in your delivery details to complete the order.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-start">
          <div className="space-y-6">

            {/* Delivery Address */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl border border-[#E8D9C5] p-5 sm:p-7 md:p-8 space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-[#E8D9C5] pb-4">
                <div className="h-9 w-9 rounded-full bg-[#872B10]/8 text-[#872B10] flex items-center justify-center">
                  <Truck size={17} />
                </div>
                <h2 className="text-base font-bold tracking-tight text-[#39160D]">
                  Delivery Address
                </h2>
              </div>

              {savedAddresses.length > 0 && !showNewAddress && (
                <div className="space-y-4">
                  <p className="text-xs text-[#39160D]/50 tracking-tight">
                    Select a saved address or add a new one
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => selectAddress(addr)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedAddressId === addr._id
                            ? "border-[#872B10] bg-[#872B10]/5"
                            : "border-[#E8D9C5] bg-white hover:border-[#872B10]/30"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`h-4 w-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr._id ? 'border-[#872B10]' : 'border-[#E8D9C5]'}`}>
                            {selectedAddressId === addr._id && (
                              <div className="h-2 w-2 rounded-full bg-[#872B10]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm tracking-tight text-[#39160D]">
                              {addr.fullName}
                            </p>
                            <p className="text-xs text-[#39160D]/50 tracking-tight">
                              {addr.phone}
                            </p>
                            <p className="text-xs text-[#39160D]/50 tracking-tight mt-1 truncate">
                              {addr.addressLine}
                            </p>
                            <p className="text-xs text-[#39160D]/50 tracking-tight">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            {addr.isDefault && (
                              <span className="inline-block mt-1.5 text-[10px] font-bold text-[#872B10] uppercase tracking-[0.06em]">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowNewAddress(true)}
                    className="flex items-center gap-1.5 text-[#872B10] text-xs font-bold hover:text-[#39160D] transition-colors tracking-tight"
                  >
                    <Plus size={14} strokeWidth={2.5} /> Add New Address
                  </button>
                </div>
              )}

              {showNewAddress && (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowNewAddress(false)}
                    className="flex items-center gap-1.5 text-[#39160D]/50 text-xs hover:text-[#39160D] transition-colors tracking-tight font-semibold"
                  >
                    ← Back to saved addresses
                  </button>
                  {addressFormFields}
                </div>
              )}

              {savedAddresses.length === 0 && addressFormFields}
            </motion.section>

            {/* Payment Method */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#E8D9C5] p-5 sm:p-7 md:p-8 space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-[#E8D9C5] pb-4">
                <div className="h-9 w-9 rounded-full bg-[#872B10]/8 text-[#872B10] flex items-center justify-center">
                  <CreditCard size={17} />
                </div>
                <h2 className="text-base font-bold tracking-tight text-[#39160D]">
                  Payment Method
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "razorpay",
                    label: "Online Payment",
                    desc: "Cards, UPI, NetBanking",
                  },
                  {
                    id: "cod",
                    label: "Cash on Delivery",
                    desc: "Pay when you receive",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`relative p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col gap-0.5 ${
                      paymentMethod === method.id
                        ? "border-[#872B10] bg-[#872B10]/5"
                        : "border-[#E8D9C5] bg-white hover:border-[#872B10]/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="absolute top-4 right-4 accent-[#872B10]"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <span className="text-sm font-bold tracking-tight text-[#39160D]">
                      {method.label}
                    </span>
                    <span className="text-[11px] text-[#39160D]/45 tracking-tight">
                      {method.desc}
                    </span>
                  </label>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Order Summary Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:sticky lg:top-32 space-y-5"
          >
            <div className="bg-[#39160D] text-[#FFF7EB] rounded-2xl p-6 sm:p-7 relative overflow-hidden">

              <h2 className="text-lg font-bold tracking-tight text-[#FFF7EB] mb-5">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-1">
                {selectedItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between gap-3 text-sm border-b border-[#FFF7EB]/15 pb-3"
                  >
                    <div>
                      <p className="font-semibold text-[#FFF7EB]/90 leading-tight tracking-tight text-[13px]">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#FFF7EB]/40 uppercase tracking-[0.04em] font-semibold mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[#872B10] text-sm whitespace-nowrap" style={{ color: '#DFC77F' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-[#FFF7EB]/15 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <p className="text-[#FFF7EB]/50 tracking-tight">Subtotal</p>
                  <p className="text-[#FFF7EB]/90 font-semibold tracking-tight">₹{subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#FFF7EB]/50 tracking-tight">Shipping</p>
                  <p className={shippingCost === 0 ? "font-bold text-[#872B10] text-xs uppercase tracking-[0.04em]" : "text-[#FFF7EB]/90 font-semibold tracking-tight"}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </p>
                </div>
                {shippingCost > 0 && subtotal < 600 && (
                  <p className="text-[10px] text-[#FFF7EB]/40 tracking-tight">
                    Add ₹{600 - subtotal} more for free shipping
                  </p>
                )}
                <div className="flex justify-between items-end pt-3 border-t border-[#FFF7EB]/15">
                  <p className="text-[#FFF7EB]/50 tracking-tight">Grand Total</p>
                  <p className="text-2xl font-bold tracking-tight" style={{ color: '#DFC77F' }}>
                    ₹{finalTotal.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-5">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-[#872B10] rounded border-[#FFF7EB]/20"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                  />
                  <span className="text-[11px] text-[#FFF7EB]/50 leading-relaxed tracking-tight group-hover:text-[#FFF7EB]/70 transition-colors">
                    I agree to receive marketing emails about new rituals and wellness tips.
                  </span>
                </label>

                <p className="text-[10px] text-[#FFF7EB]/40 leading-relaxed tracking-tight">
                  By placing this order, you agree to Floramade&apos;s{" "}
                  <Link href="/terms" className="underline hover:text-[#DFC77F] transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="underline hover:text-[#DFC77F] transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-[#872B10] text-[#FFF7EB] py-3.5 rounded-full font-bold uppercase tracking-[0.06em] text-xs hover:bg-[#872B10]/90 transition-all duration-300 mt-5"
              >
                {paymentMethod === "cod"
                  ? "Place COD Order"
                  : "Pay with Razorpay"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[#FFF7EB]/30 text-[10px] uppercase tracking-[0.06em] font-bold">
                <ShieldCheck size={13} /> 100% Secure Checkout
              </div>
            </div>

            <div className="bg-white border border-[#E8D9C5] p-5 sm:p-6 rounded-2xl space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-[0.06em] text-[#39160D]/35">
                Need Help?
              </h4>
              <p className="text-xs text-[#39160D]/55 leading-relaxed tracking-tight">
                Our practitioners are available for any questions regarding your ritual.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#872B10] hover:text-[#39160D] transition-colors tracking-tight"
              >
                Contact Support <ChevronRight size={13} />
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
