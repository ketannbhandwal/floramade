"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
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
  Tag,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cartItems, total, clearCart } = useCart();

  useEffect(() => {
    if (!authLoading && !user) {
      toast("Please sign in to proceed with checkout");
      router.push("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);
  const [buyNowItems] = useState(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("floramade-buy-now-items");
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
    const saved = localStorage.getItem("floramade-buy-now-address");
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

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Fetch available coupons and check localStorage for applied coupon
  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data?.coupons)) {
          setAvailableCoupons(data.coupons);
        }
      })
      .catch(() => {});

    try {
      const savedCoupon = localStorage.getItem("floramade-applied-coupon");
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        if (parsed?.code) {
          setAppliedCoupon(parsed);
          setCouponCodeInput(parsed.code);
        }
      }
    } catch {
      const rawCode = localStorage.getItem("floramade-applied-coupon");
      if (rawCode) {
        setCouponCodeInput(rawCode);
      }
    }
  }, []);

  // Calculate discount
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
      return 0;
    }
    if (appliedCoupon.discountType === "percentage") {
      return Math.round((subtotal * (Number(appliedCoupon.discountValue) || 0)) / 100);
    }
    return Math.min(subtotal, Number(appliedCoupon.discountValue) || 0);
  }, [appliedCoupon, subtotal]);

  const shippingCost = useMemo(() => (subtotal >= 600 ? 0 : 50), [subtotal]);
  const finalTotal = useMemo(
    () => Math.max(0, subtotal - couponDiscount + shippingCost),
    [subtotal, couponDiscount, shippingCost],
  );

  const applyCouponCode = async (codeToApply) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }
    setCouponError("");

    let match = availableCoupons.find(c => c.code?.toUpperCase() === code && c.isActive !== false);
    
    // If not found in memory, try fetching settings fresh
    if (!match) {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (Array.isArray(data?.coupons)) {
          match = data.coupons.find(c => c.code?.toUpperCase() === code && c.isActive !== false);
          setAvailableCoupons(data.coupons);
        }
      } catch (e) {}
    }

    // Default fallbacks if backend settings hasn't initialized
    if (!match) {
      if (code === "FLAT05") {
        match = { code: "FLAT05", discountType: "percentage", discountValue: 5, minOrderAmount: 0 };
      } else if (code === "FLAT10") {
        match = { code: "FLAT10", discountType: "percentage", discountValue: 10, minOrderAmount: 3000 };
      }
    }

    if (!match) {
      const err = "Invalid or expired coupon code";
      setCouponError(err);
      toast.error(err);
      return;
    }

    if (match.minOrderAmount && subtotal < match.minOrderAmount) {
      const msg = `Minimum order amount for ${match.code} is ₹${match.minOrderAmount}`;
      setCouponError(msg);
      toast.error(msg);
      return;
    }

    setAppliedCoupon(match);
    localStorage.setItem("floramade-applied-coupon", JSON.stringify(match));
    toast.success(`Coupon ${match.code} applied successfully!`);
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponError("");
    localStorage.removeItem("floramade-applied-coupon");
    toast.success("Coupon removed");
  };

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
    localStorage.removeItem("floramade-buy-now-items");
    localStorage.removeItem("floramade-buy-now-address");
    localStorage.removeItem("floramade-applied-coupon");
    if (!buyNowItems.length) clearCart();
    router.push("/account");
  }

  async function handlePayment() {
    if (!user) {
      toast("Please sign in to complete your purchase");
      router.push("/login?redirect=/checkout");
      return;
    }
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
          color: "#101D17",
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
            localStorage.removeItem("floramade-buy-now-items");
            localStorage.removeItem("floramade-buy-now-address");
            localStorage.removeItem("floramade-applied-coupon");
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
          className="w-4 h-4 rounded border-[#E0D9C8] accent-[#101D17]"
        />
        <label
          htmlFor="saveToProfile"
          className="text-xs text-[#171717]/60 tracking-tight"
        >
          Save this address to my profile for future orders
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F4E9]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 pt-4 md:pt-6 pb-12 md:pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[1px] w-8 bg-[#101D17]" />
            <span className="text-[10px] uppercase tracking-[0.08em] text-[#171717]/50 font-semibold">Secure Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#171717]">
            Checkout
          </h1>
          <p className="text-sm text-[#171717]/50 tracking-tight mt-1.5">
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
              className="bg-[#EFE8D8] rounded-2xl border border-[#DDD2BD] p-5 sm:p-7 md:p-8 space-y-6 shadow-xs"
            >
              <div className="flex items-center gap-3 border-b border-[#DDD2BD] pb-4">
                <div className="h-9 w-9 rounded-full bg-[#101D17]/8 text-[#101D17] flex items-center justify-center">
                  <Truck size={17} />
                </div>
                <h2 className="text-base font-bold tracking-tight text-[#171717]">
                  Delivery Address
                </h2>
              </div>

              {savedAddresses.length > 0 && !showNewAddress && (
                <div className="space-y-4">
                  <p className="text-xs text-[#171717]/50 tracking-tight">
                    Select a saved address or add a new one
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => selectAddress(addr)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedAddressId === addr._id
                            ? "border-[#101D17] bg-[#101D17]/5"
                            : "border-[#DDD2BD] bg-[#F8F4E9] hover:border-[#101D17]/30"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`h-4 w-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr._id ? 'border-[#101D17]' : 'border-[#DDD2BD]'}`}>
                            {selectedAddressId === addr._id && (
                              <div className="h-2 w-2 rounded-full bg-[#101D17]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm tracking-tight text-[#171717]">
                              {addr.fullName}
                            </p>
                            <p className="text-xs text-[#171717]/50 tracking-tight">
                              {addr.phone}
                            </p>
                            <p className="text-xs text-[#171717]/50 tracking-tight mt-1 truncate">
                              {addr.addressLine}
                            </p>
                            <p className="text-xs text-[#171717]/50 tracking-tight">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            {addr.isDefault && (
                              <span className="inline-block mt-1.5 text-[10px] font-bold text-[#101D17] uppercase tracking-[0.06em]">
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
                    className="flex items-center gap-1.5 text-[#101D17] text-xs font-bold hover:text-[#171717] transition-colors tracking-tight"
                  >
                    <Plus size={14} strokeWidth={2.5} /> Add New Address
                  </button>
                </div>
              )}

              {showNewAddress && (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowNewAddress(false)}
                    className="flex items-center gap-1.5 text-[#171717]/50 text-xs hover:text-[#171717] transition-colors tracking-tight font-semibold"
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
              className="bg-[#EFE8D8] rounded-2xl border border-[#DDD2BD] p-5 sm:p-7 md:p-8 space-y-5 shadow-xs"
            >
              <div className="flex items-center gap-3 border-b border-[#DDD2BD] pb-4">
                <div className="h-9 w-9 rounded-full bg-[#101D17]/8 text-[#101D17] flex items-center justify-center">
                  <CreditCard size={17} />
                </div>
                <h2 className="text-base font-bold tracking-tight text-[#171717]">
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
                        ? "border-[#101D17] bg-[#101D17]/5"
                        : "border-[#DDD2BD] bg-[#F8F4E9] hover:border-[#101D17]/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="absolute top-4 right-4 accent-[#101D17]"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <span className="text-sm font-bold tracking-tight text-[#171717]">
                      {method.label}
                    </span>
                    <span className="text-[11px] text-[#171717]/45 tracking-tight">
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
            <div className="bg-[#101D17] text-white rounded-2xl p-6 sm:p-7 relative overflow-hidden">

              <h2 className="text-lg font-bold tracking-tight text-white mb-5">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-1">
                {selectedItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between gap-3 text-sm border-b border-white/15 pb-3"
                  >
                    <div>
                      <p className="font-semibold text-white/90 leading-tight tracking-tight text-[13px]">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.04em] font-semibold mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[#101D17] text-sm whitespace-nowrap" style={{ color: '#D4AF55' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Redemption Section */}
              <div className="mt-5 pt-4 border-t border-white/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white/90 flex items-center gap-1.5 tracking-tight">
                    <Tag size={13} className="text-[#D4AF55]" /> Have a coupon code?
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={removeAppliedCoupon}
                      className="text-[11px] font-semibold text-[#D4AF55] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-[#D4AF55]/40 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF55]/20 text-[#D4AF55] flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </span>
                      <div>
                        <span className="font-bold text-[#D4AF55] tracking-wide uppercase">{appliedCoupon.code}</span>
                        <p className="text-[10px] text-white/60">
                          {appliedCoupon.discountType === "percentage"
                            ? `${appliedCoupon.discountValue}% OFF applied`
                            : `₹${appliedCoupon.discountValue} FLAT OFF applied`}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#D4AF55]">-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            applyCouponCode();
                          }
                        }}
                        placeholder="Enter coupon code"
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-[#F8F4E9]/40 focus:outline-none focus:border-[#D4AF55] uppercase tracking-wider font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => applyCouponCode()}
                        className="px-4 py-2 bg-[#D4AF55] hover:bg-[#D4AF55]/90 text-[#171717] text-xs font-bold rounded-xl transition-colors tracking-tight cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-300 tracking-tight">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-white/15 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <p className="text-white/50 tracking-tight">Subtotal</p>
                  <p className="text-white/90 font-semibold tracking-tight">₹{subtotal.toLocaleString()}</p>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-[#D4AF55]">
                    <p className="tracking-tight text-xs flex items-center gap-1">
                      Coupon Discount ({appliedCoupon?.code})
                    </p>
                    <p className="font-bold tracking-tight text-xs">-₹{couponDiscount.toLocaleString()}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-white/50 tracking-tight">Shipping</p>
                  <p className={shippingCost === 0 ? "font-bold text-[#D4AF55] text-xs uppercase tracking-[0.04em]" : "text-white/90 font-semibold tracking-tight"}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </p>
                </div>
                {shippingCost > 0 && subtotal < 600 && (
                  <p className="text-[10px] text-white/40 tracking-tight">
                    Add ₹{600 - subtotal} more for free shipping
                  </p>
                )}
                <div className="flex justify-between items-end pt-3 border-t border-white/15">
                  <p className="text-white/50 tracking-tight">Grand Total</p>
                  <p className="text-2xl font-bold tracking-tight" style={{ color: '#D4AF55' }}>
                    ₹{finalTotal.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-5">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-[#101D17] rounded border-white/20"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                  />
                  <span className="text-[11px] text-white/50 leading-relaxed tracking-tight group-hover:text-white/70 transition-colors">
                    I agree to receive marketing emails about new rituals and wellness tips.
                  </span>
                </label>

                <p className="text-[10px] text-white/40 leading-relaxed tracking-tight">
                  By placing this order, you agree to Floramade&apos;s{" "}
                  <Link href="/terms" className="underline hover:text-[#D4AF55] transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="underline hover:text-[#D4AF55] transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-[#D4AF55] text-[#101D17] hover:bg-[#C49B3D] py-4 rounded-xl font-extrabold uppercase tracking-[0.06em] text-xs sm:text-sm shadow-lg shadow-[#D4AF55]/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-5 cursor-pointer flex items-center justify-center gap-2"
              >
                {paymentMethod === "cod"
                  ? "Place COD Order"
                  : "Pay with Razorpay"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-white/30 text-[10px] uppercase tracking-[0.06em] font-bold">
                <ShieldCheck size={13} /> 100% Secure Checkout
              </div>
            </div>

            <div className="bg-[#EFE8D8] border border-[#DDD2BD] p-5 sm:p-6 rounded-2xl space-y-2.5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-[0.06em] text-[#171717]/35">
                Need Help?
              </h4>
              <p className="text-xs text-[#171717]/55 leading-relaxed tracking-tight">
                Our practitioners are available for any questions regarding your ritual.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#101D17] hover:text-[#171717] transition-colors tracking-tight"
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
