"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import Sidebar from "@/components/ui/Sidebar";
import OrderCard from "@/components/order/OrderCard";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound, Settings, ShoppingBag, LogOut, ArrowRight, MapPin, Plus, Trash2 } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, refreshUser, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EB]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#39160D]/10" />
          <p className="text-xs text-[#39160D]/40 tracking-tight font-semibold">Loading...</p>
        </div>
      </div>
    );
  }
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    fetch("/api/orders/mine")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []));

    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      const res = await fetch("/api/addresses");
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
    }
  }

  async function deleteAddress(addressId) {
    if (!confirm("Are you sure you want to delete this address?")) return;

    const res = await fetch(`/api/addresses/${addressId}`, {
      method: "DELETE",
    });

    if (!res.ok) return toast.error("Failed to delete address");

    toast.success("Address deleted successfully");
    loadAddresses();
  }

  async function setDefaultAddress(addressId) {
    const res = await fetch(`/api/addresses/${addressId}/default`, {
      method: "PATCH",
    });

    if (!res.ok) return toast.error("Failed to set default address");

    toast.success("Default address updated");
    loadAddresses();
  }

  async function saveProfile(e) {
    e.preventDefault();
    const payload = {
      name: profile.name || user?.name || "",
      phone: profile.phone || user?.phone || "",
    };
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message || "Failed to update profile");
    await refreshUser();
    toast.success("Profile updated");
  }

  async function updatePassword(e) {
    e.preventDefault();
    const res = await fetch("/api/account/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message || "Failed to update password");
    setPasswordForm({ currentPassword: "", newPassword: "" });
    toast.success("Password updated");
  }

  const fadeAnim = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  };

  const navItems = [
    { id: "profile", icon: UserRound, label: "Profile" },
    { id: "orders", icon: ShoppingBag, label: "Orders" },
    { id: "addresses", icon: MapPin, label: "Addresses" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-[80vh] bg-[#FFF7EB] w-full pt-28 md:pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[1px] w-8 bg-[#872B10]" />
            <span className="text-[10px] uppercase tracking-[0.08em] text-[#39160D]/50 font-semibold">Your Space</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#39160D]">
            My Account
          </h1>
        </motion.div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            {/* User Card */}
            <div className="bg-white rounded-2xl border border-[#E8D9C5] p-5 flex flex-col items-center text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-[#872B10]/8 text-[#872B10] flex items-center justify-center text-2xl font-bold tracking-tight">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight text-[#39160D]">{user?.name || "User"}</p>
                <p className="text-xs text-[#39160D]/40 tracking-tight">{user?.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl border border-[#E8D9C5] p-2 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-[#39160D] text-[#FFF7EB]"
                      : "hover:bg-[#39160D]/5 text-[#39160D]/60"
                  }`}
                >
                  <item.icon size={16} strokeWidth={2} />
                  <span className="text-xs uppercase tracking-[0.06em] font-bold">{item.label}</span>
                </button>
              ))}
              <div className="border-t border-[#E8D9C5] mt-1 pt-1">
                <button
                  onClick={async () => {
                    await logout();
                    router.replace("/");
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:bg-red-500/5 hover:text-red-500 transition-all duration-200 w-full"
                >
                  <LogOut size={16} strokeWidth={2} />
                  <span className="text-xs uppercase tracking-[0.06em] font-bold">Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Content */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeSection === "profile" && (
                <motion.div key="profile" {...fadeAnim} className="space-y-5 max-w-2xl">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#39160D]">Personal Details</h2>
                    <p className="text-xs text-[#39160D]/45 tracking-tight mt-1">Manage your personal information and preferences.</p>
                  </div>

                  <form onSubmit={saveProfile} className="space-y-5 bg-white rounded-2xl border border-[#E8D9C5] p-5 sm:p-7">
                    <div className="space-y-4">
                      <Input label="Full Name" value={profile.name || user?.name || ""} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
                      <Input label="Email Address" value={user?.email || ""} disabled />
                      <Input label="Phone Number" placeholder="e.g. 9220251059" value={profile.phone || user?.phone || ""} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <button type="submit" className="h-11 px-7 rounded-full bg-[#39160D] text-[#FFF7EB] flex items-center justify-center gap-2 hover:bg-[#872B10] transition-colors duration-300 text-xs font-bold uppercase tracking-[0.06em] w-full sm:w-auto">
                      Save Changes
                    </button>
                  </form>
                </motion.div>
              )}

              {activeSection === "settings" && (
                <motion.div key="settings" {...fadeAnim} className="space-y-5 max-w-2xl">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#39160D]">Security</h2>
                    <p className="text-xs text-[#39160D]/45 tracking-tight mt-1">Ensure your account stays secure.</p>
                  </div>

                  <form onSubmit={updatePassword} className="space-y-5 bg-white rounded-2xl border border-[#E8D9C5] p-5 sm:p-7">
                    <div className="space-y-4">
                      <Input
                        label="Current Password"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      />
                      <Input
                        label="New Password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      />
                    </div>
                    <button type="submit" className="h-11 px-7 rounded-full bg-[#872B10] text-[#FFF7EB] flex items-center justify-center gap-2 hover:bg-[#872B10]/90 transition-colors duration-300 text-xs font-bold uppercase tracking-[0.06em] w-full sm:w-auto">
                      Update Password
                    </button>
                  </form>
                </motion.div>
              )}

              {activeSection === "orders" && (
                <motion.div key="orders" {...fadeAnim} className="space-y-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#39160D]">Order History</h2>
                    <p className="text-xs text-[#39160D]/45 tracking-tight mt-1">Track your past purchases.</p>
                  </div>

                  <div className="space-y-4">
                    {!orders.length ? (
                      <div className="py-16 border border-[#E8D9C5] rounded-2xl bg-white flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-14 h-14 rounded-full bg-[#39160D]/5 flex items-center justify-center">
                          <ShoppingBag size={24} className="text-[#39160D]/25" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-[#39160D]/70 tracking-tight">No orders yet</p>
                          <p className="text-xs text-[#39160D]/40 tracking-tight">Start your wellness journey today</p>
                        </div>
                        <Link
                          href="/"
                          className="h-10 px-6 rounded-full bg-[#39160D] text-[#FFF7EB] flex items-center justify-center gap-2 hover:bg-[#872B10] transition-colors duration-300 text-xs font-bold uppercase tracking-[0.06em]"
                        >
                          Shop Now <ArrowRight size={13} strokeWidth={2} />
                        </Link>
                      </div>
                    ) : (
                      orders.map((o) => (
                        <OrderCard
                          key={o._id}
                          order={o}
                          onStatusUpdate={(id, newStatus) =>
                            setOrders((prev) =>
                              prev.map((ord) =>
                                ord._id === id ? { ...ord, status: newStatus } : ord
                              )
                            )
                          }
                        />
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeSection === "addresses" && (
                <motion.div key="addresses" {...fadeAnim} className="space-y-5">
                  <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#39160D]">Saved Addresses</h2>
                      <p className="text-xs text-[#39160D]/45 tracking-tight mt-1">Manage your delivery addresses.</p>
                    </div>
                    <Link
                      href="/account/add-address"
                      className="h-9 px-5 rounded-full bg-[#39160D] text-[#FFF7EB] flex items-center justify-center gap-1.5 hover:bg-[#872B10] transition-colors duration-300 text-[11px] font-bold uppercase tracking-[0.06em] flex-shrink-0"
                    >
                      <Plus size={13} strokeWidth={2.5} /> Add Address
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {!addresses.length ? (
                      <div className="py-16 border border-[#E8D9C5] rounded-2xl bg-white flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-14 h-14 rounded-full bg-[#39160D]/5 flex items-center justify-center">
                          <MapPin size={24} className="text-[#39160D]/25" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-[#39160D]/70 tracking-tight">No saved addresses</p>
                          <p className="text-xs text-[#39160D]/40 tracking-tight">Add an address for faster checkout</p>
                        </div>
                        <Link href="/account/add-address">
                          <Button className="text-xs">Add Your First Address</Button>
                        </Link>
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <div
                          key={addr._id}
                          className={`relative p-4 sm:p-5 rounded-xl border transition-all ${
                            addr.isDefault
                              ? "bg-[#872B10]/5 border-[#872B10]/30"
                              : "bg-white border-[#E8D9C5]"
                          }`}
                        >
                          {addr.isDefault && (
                            <span className="absolute top-3 right-3 text-[10px] font-bold text-[#872B10] uppercase tracking-[0.06em]">Default</span>
                          )}
                          <div className="space-y-1">
                            <p className="text-sm font-bold tracking-tight text-[#39160D]">{addr.fullName}</p>
                            <p className="text-xs text-[#39160D]/50 tracking-tight">{addr.phone}</p>
                            <p className="text-xs text-[#39160D]/50 tracking-tight">{addr.addressLine}</p>
                            <p className="text-xs text-[#39160D]/50 tracking-tight">{addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                          <div className="flex gap-3 mt-3">
                            {!addr.isDefault && (
                              <button
                                onClick={() => setDefaultAddress(addr._id)}
                                className="text-[10px] uppercase tracking-[0.06em] font-bold text-[#872B10] hover:text-[#39160D] transition-colors"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => deleteAddress(addr._id)}
                              className="text-[10px] uppercase tracking-[0.06em] font-bold text-red-400 hover:text-red-500 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
