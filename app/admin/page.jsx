"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { LayoutDashboard, Package, ReceiptText, Users, ArrowUpRight, TrendingUp, DollarSign, Activity, BarChart3, Settings, LogOut, MessageSquare, Trash2, Check, X, Phone, Plus, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Star, Sparkles, Upload, Copy, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import BannerConcernManager from "@/components/admin/BannerConcernManager";
import { slugify } from "@/lib/utils";

const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const Bar = dynamic(() => import("recharts").then(mod => mod.Bar), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });

export const FEATURE_ICONS = [
  { id: "gut", name: "Gut & Digestion", icon: "/feature/1.svg", defaultText: "Promotes Healthy Digestion" },
  { id: "fast", name: "Fast Acting Relief", icon: "/feature/2.svg", defaultText: "Fast-Acting Relief" },
  { id: "discomfort", name: "Discomfort Relief", icon: "/feature/3.svg", defaultText: "Relief from Discomfort" },
  { id: "shield", name: "Gut Shield & Healing", icon: "/feature/4.svg", defaultText: "Protects & Heals Gut" },
  { id: "balance", name: "Balance & Metabolism", icon: "/feature/5svg.svg", defaultText: "Balances Metabolism & Sugar" },
  { id: "insulin", name: "Insulin & Detox", icon: "/feature/6.svg", defaultText: "Enhances Insulin Sensitivity" },
  { id: "immunity", name: "Cellular Immunity", icon: "/feature/7.svg", defaultText: "Boosts Natural Immunity" },
  { id: "heart", name: "Heart & Vitality", icon: "/feature/8.svg", defaultText: "Improves Heart & Vitality" },
];

const defaultKeyBenefits = [
  { text: "Relief from Discomfort", image: "/feature/3.svg" },
  { text: "Better Results", image: "/feature/4.svg" },
  { text: "Fast-Acting Relief", image: "/feature/2.svg" },
  { text: "Promotes Healthy Digestion", image: "/feature/1.svg" },
];

const defaultTrustBadges = [
  { label: "Lab Tested", image: "/certificate/3.svg" },
  { label: "100% Natural", image: "/certificate/2.svg" },
  { label: "Expert Formula", image: "/certificate/1.svg" },
  { label: "Certified", image: "/certificate/4.svg" },
];

const empty = {
  name: "", slug: "", category: "Ayurvedic", price: 0, discountPrice: 0, stock: 0,
  isVisible: true, description: "", benefits: "", ingredients: "",
  usage: "", images: [], ingredientImages: {}, usageImages: [], packs: [], formulaimage: "", trustQuality: {},
  trustBadges: defaultTrustBadges,
  keyBenefits: defaultKeyBenefits,
  benefitImages: defaultKeyBenefits.map(b => b.image),
  rating: 4.5, reviewsCount: 0, deliveryDays: 5, sortOrder: 0,
};

const fadeAnim = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
};

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingSlug, setEditingSlug] = useState("");
  const [editingId, setEditingId] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [chartsReady] = useState(() => typeof window !== "undefined");
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [reordering, setReordering] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);

  async function moveProduct(index, direction) {
    if (reordering) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= products.length) return;

    const itemToMove = products[index];
    const newProducts = [...products];
    newProducts[index] = newProducts[newIndex];
    newProducts[newIndex] = itemToMove;

    setProducts(newProducts);
    setReordering(true);

    try {
      const orderedIds = newProducts.map((p) => p._id || p.id);
      const res = await fetch("/api/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) throw new Error("Failed to save reordered products");
      toast.success(`Position #${newIndex + 1}: "${itemToMove.name}" updated!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product order");
      await loadData();
    } finally {
      setReordering(false);
    }
  }

  function handleDragStart(e, idx) {
    setDraggedIdx(idx);
    e.dataTransfer.setData("text/plain", String(idx));
    e.dataTransfer.effectAllowed = "move";
  }

  async function handleDrop(e, targetIdx) {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      return;
    }

    const newProducts = [...products];
    const [movedItem] = newProducts.splice(draggedIdx, 1);
    newProducts.splice(targetIdx, 0, movedItem);

    setDraggedIdx(null);
    setProducts(newProducts);
    setReordering(true);

    try {
      const orderedIds = newProducts.map((p) => p._id || p.id);
      const res = await fetch("/api/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) throw new Error("Failed to save reordered products");
      toast.success(`Position #${targetIdx + 1}: "${movedItem.name}" updated!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product order");
      await loadData();
    } finally {
      setReordering(false);
    }
  }


  const totalSales = useMemo(() => orders.reduce((s, o) => s + o.amount, 0), [orders]);
  const averageOrderValue = useMemo(() => (orders.length ? Math.round(totalSales / orders.length) : 0), [orders, totalSales]);
  const conversionRate = useMemo(() => (users.length ? ((orders.length / users.length) * 100).toFixed(1) : "0.0"), [orders.length, users.length]);
  
  const chartData = useMemo(() => {
    return orders.slice().reverse().map((order, idx) => ({
      index: idx + 1, revenue: order.amount, orders: idx + 1,
    }));
  }, [orders]);
  
  const userGrowthData = useMemo(() => users.slice().reverse().map((u, idx) => ({ index: idx + 1, users: idx + 1 })), [users]);
  
  const topProductsData = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });
    return Object.entries(counts).map(([name, quantity]) => ({ name, quantity })).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  }, [orders]);
  
  const paymentSplit = useMemo(() => {
    const cod = orders.filter((o) => o.paymentMethod === "cod").length;
    const razorpay = orders.filter((o) => o.paymentMethod !== "cod").length;
    return [
      { name: "Razorpay", value: razorpay, color: "#3B5339" },
      { name: "COD", value: cod, color: "#E8DD95" },
    ];
  }, [orders]);

  async function loadData() {
    const [p, o, u, i] = await Promise.all([
      fetch("/api/products?includeAll=true"),
      fetch("/api/orders/all"),
      fetch("/api/users/all"),
      fetch("/api/inquiries"),
    ]);
    const pData = await p.json();
    const oData = await o.json();
    const uData = await u.json();
    const iData = await i.json();
    setProducts(pData.products || []);
    setOrders(oData.orders || []);
    setUsers(uData.users || []);
    setInquiries(iData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleFileUpload(file, type = 'image') {
    if (!file) return null;
    
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ 
          file: base64,
          type 
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || `Upload failed (${res.status})`);
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} upload failed: ${error.message}`);
      return null;
    }
  }

  async function handleImageUpload(file) {
    return handleFileUpload(file, 'image');
  }

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  async function saveProduct(e) {
    e.preventDefault();
    setUploading(true);
    
    const sanitizedKeyBenefits = (form.keyBenefits || [])
      .map(b => ({
        text: (b?.text || "").trim(),
        image: b?.image || "/feature/1.svg",
      }))
      .filter(b => b.text.length > 0);

    const benefitsArray = sanitizedKeyBenefits.length > 0
      ? sanitizedKeyBenefits.map(b => b.text)
      : (form.benefits ? form.benefits.split(",").map((x) => x.trim()).filter(Boolean) : []);

    const benefitImagesArray = sanitizedKeyBenefits.length > 0
      ? sanitizedKeyBenefits.map(b => b.image)
      : (form.benefitImages && form.benefitImages.length > 0 ? form.benefitImages : []);

    const payload = {
      name: form.name,
      slug: form.slug ? slugify(form.slug) : slugify(form.name),
      category: form.category || "Ayurvedic",
      price: Number(form.price) || 0,
      discountPrice: Number(form.discountPrice) || 0,
      stock: Number(form.stock) || 0,
      isVisible: form.isVisible,
      description: form.description || "",
      keyBenefits: sanitizedKeyBenefits,
      benefits: benefitsArray,
      benefitImages: benefitImagesArray,
      ingredients: form.ingredients ? form.ingredients.split(",").map((x) => x.trim()).filter(Boolean) : [],
      usage: form.usage ? form.usage.split(",").map((x) => x.trim()).filter(Boolean) : [],
      ingredientImages: form.ingredientImages || {},
      usageImages: form.usageImages || [],
      packs: (form.packs || []).map((pack) => ({
        label: pack.label || "",
        packCount: Number(pack.packCount) || 1,
        sachets: pack.sachets || "",
        price: Number(pack.price) || 0,
        mrp: Number(pack.mrp) || 0,
        image: pack.image || "",
        mostPopular: Boolean(pack.mostPopular),
      })),
      images: form.images || [],
      featureImages: form.images || [],
      formulaimage: form.formulaimage || "",
      trustQuality: form.trustQuality || {},
      trustBadges: (form.trustBadges || []).map((b) => ({
        label: b.label || "",
        image: b.image || "",
      })),
      rating: Number(form.rating) || 4.5,
      reviewsCount: Number(form.reviewsCount) || 0,
      deliveryDays: Number(form.deliveryDays) || 5,
      sortOrder: Number(form.sortOrder) || 0,
    };

    const url = editingSlug ? `/api/products/${encodeURIComponent(editingSlug)}` : "/api/products";
    if (editingSlug) payload.productId = editingId;

    try {
      const res = await fetch(url, {
        method: editingSlug ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      console.log("Save response:", data);
      
      if (!res.ok) {
        setUploading(false);
        return toast.error(data.message || `Save failed: ${res.status}`);
      }
      
      toast.success(editingSlug ? "Product updated" : "Product created");
      setForm(empty);
      setEditingSlug("");
      setEditingId("");
      setImageUrlInput("");
      setUploading(false);
      
      // Refresh data without full page reload
      await loadData();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product. Please try again.");
      setUploading(false);
    }
  }

  async function deleteProduct(slug) {
    await fetch(`/api/products/${slug}`, { method: "DELETE" });
    toast.success("Product deleted");
    await loadData();
  }

  async function approveReview(productId, reviewId, approved) {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, approved }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        return toast.error(errorData.error || "Failed to update review");
      }
      
      toast.success(approved ? "Review approved" : "Review unapproved");
      await loadData();
    } catch (error) {
      console.error("Approve review error:", error);
      toast.error("Failed to update review");
    }
  }

  async function deleteReview(productId, reviewId) {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        return toast.error(errorData.error || "Failed to delete review");
      }
      
      toast.success("Review deleted");
      await loadData();
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error("Failed to delete review");
    }
  }

  async function toggleVisibility(product) {
    const res = await fetch(`/api/products/${product.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, isVisible: !product.isVisible }),
    });
    if (!res.ok) return toast.error("Visibility update failed");
    toast.success(`Product ${product.isVisible ? "hidden" : "unhidden"}`);
    await loadData();
  }

  async function updateOrderStatus(orderId, status) {
    const res = await fetch("/api/orders/all", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (!res.ok) return toast.error("Status update failed");
    toast.success("Order status updated");
    await loadData();
  }

  function startEdit(product) {
    setActiveTab("products");
    setEditingSlug(product.slug);
    setEditingId(product._id);
    const images = product.featureImages || product.images || [];

    let keyBenefits = [];
    if (Array.isArray(product.keyBenefits) && product.keyBenefits.length > 0) {
      keyBenefits = product.keyBenefits.map((b, idx) => ({
        text: typeof b === "string" ? b : (b?.text || ""),
        image: b?.image || `/feature/${(idx % 8) + 1}.svg`,
      }));
    } else if (Array.isArray(product.benefits) && product.benefits.length > 0) {
      keyBenefits = product.benefits.map((text, idx) => {
        let img = (Array.isArray(product.benefitImages) && product.benefitImages[idx])
          ? product.benefitImages[idx]
          : null;
        if (!img || img.includes("pilecurex") || img.includes("floramade") || img.includes("/upload/v")) {
          const defaults = ["/feature/3.svg", "/feature/4.svg", "/feature/1.svg", "/feature/2.svg"];
          img = defaults[idx % defaults.length] || `/feature/${(idx % 8) + 1}.svg`;
        }
        return { text, image: img };
      });
    } else {
      keyBenefits = defaultKeyBenefits;
    }

    setForm({
      name: product.name || "",
      slug: product.slug || "",
      category: product.category || "Ayurvedic",
      price: product.price || 0,
      discountPrice: product.discountPrice || 0,
      stock: product.stock || 0,
      isVisible: product.isVisible ?? true,
      description: product.description || "",
      benefits: keyBenefits.map(b => b.text).join(", "),
      keyBenefits: keyBenefits,
      benefitImages: keyBenefits.map(b => b.image),
      ingredients: (product.ingredients || []).join(", "),
      usage: (product.usage || []).join(", "),
      ingredientImages: product.ingredientImages || {},
      usageImages: product.usageImages || [],
      packs: Array.isArray(product.packs) ? product.packs : [],
      images: images,
      formulaimage: product.formulaimage || "",
      trustQuality: product.trustQuality || {},
      trustBadges: Array.isArray(product.trustBadges) && product.trustBadges.length > 0
        ? product.trustBadges
        : defaultTrustBadges,
      rating: product.rating || 4.5,
      reviewsCount: product.reviewsCount || 0,
      deliveryDays: product.deliveryDays || 5,
      sortOrder: product.sortOrder ?? product.order ?? 0,
    });
    setImageUrlInput(images.join(", "));
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function duplicateProduct(product) {
    setActiveTab("products");
    // Ensure no existing IDs or editingSlug are set so this is treated as a clean NEW product
    setEditingSlug("");
    setEditingId("");

    const baseName = (product.name || "").replace(/\s*\(Copy.*?\)\s*/gi, "").trim();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newName = `${baseName} (Copy)`;
    const baseSlug = (product.slug || slugify(baseName) || "product").replace(/-copy(-\d+)?$/gi, "").trim();
    const newSlug = `${baseSlug}-copy-${randomSuffix}`;

    const images = Array.isArray(product.featureImages) && product.featureImages.length > 0 
      ? [...product.featureImages] 
      : Array.isArray(product.images) && product.images.length > 0 
        ? [...product.images] 
        : [];

    let keyBenefits = [];
    if (Array.isArray(product.keyBenefits) && product.keyBenefits.length > 0) {
      keyBenefits = product.keyBenefits.map((b, idx) => ({
        text: typeof b === "string" ? b : (b?.text || ""),
        image: b?.image || `/feature/${(idx % 8) + 1}.svg`,
      }));
    } else if (Array.isArray(product.benefits) && product.benefits.length > 0) {
      keyBenefits = product.benefits.map((text, idx) => {
        let img = (Array.isArray(product.benefitImages) && product.benefitImages[idx])
          ? product.benefitImages[idx]
          : null;
        if (!img || img.includes("pilecurex") || img.includes("floramade") || img.includes("/upload/v")) {
          const defaults = ["/feature/3.svg", "/feature/4.svg", "/feature/1.svg", "/feature/2.svg"];
          img = defaults[idx % defaults.length] || `/feature/${(idx % 8) + 1}.svg`;
        }
        return { text, image: img };
      });
    } else {
      keyBenefits = defaultKeyBenefits;
    }

    // Strip any IDs from sub-arrays to avoid subdoc ID collisions
    const cleanPacks = Array.isArray(product.packs) 
      ? product.packs.map(pk => {
          const { _id, id, ...rest } = pk || {};
          return rest;
        })
      : [];

    const cleanTrustBadges = Array.isArray(product.trustBadges) && product.trustBadges.length > 0
      ? product.trustBadges.map(tb => {
          const { _id, id, ...rest } = tb || {};
          return rest;
        })
      : defaultTrustBadges;

    setForm({
      name: newName,
      slug: newSlug,
      category: product.category || "Ayurvedic",
      price: product.price || 0,
      discountPrice: product.discountPrice || 0,
      stock: product.stock || 100,
      isVisible: true,
      description: product.description || "",
      benefits: keyBenefits.map(b => b.text).join(", "),
      keyBenefits: keyBenefits,
      benefitImages: keyBenefits.map(b => b.image),
      ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(", ") : (product.ingredients || ""),
      usage: Array.isArray(product.usage) ? product.usage.join(", ") : (product.usage || ""),
      ingredientImages: product.ingredientImages ? { ...product.ingredientImages } : {},
      usageImages: Array.isArray(product.usageImages) ? [...product.usageImages] : [],
      packs: cleanPacks,
      images: images,
      formulaimage: product.formulaimage || "",
      trustQuality: product.trustQuality ? { ...product.trustQuality } : {},
      trustBadges: cleanTrustBadges,
      rating: product.rating || 4.5,
      reviewsCount: 0,
      deliveryDays: product.deliveryDays || 5,
      sortOrder: (product.sortOrder ?? product.order ?? 0) + 1,
    });
    setImageUrlInput(images.join(", "));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success(`Duplicated "${baseName}" into formulation form without any old IDs! Review details and click "Create product".`);
  }

  const moveImage = (index, direction) => {
    const images = form.images || [];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, moved);
    setForm((f) => ({ ...f, images: newImages }));
    setImageUrlInput(newImages.join(", "));
  };

  const setAsMainImage = (index) => {
    const images = form.images || [];
    if (index === 0 || index >= images.length) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.unshift(moved);
    setForm((f) => ({ ...f, images: newImages }));
    setImageUrlInput(newImages.join(", "));
    toast.success("Set as front cover image");
  };

  const TABS = [
    { key: "dashboard", label: "Overview", icon: LayoutDashboard },
    { key: "products", label: "Inventory", icon: Package },
    { key: "customizer", label: "Store Customizer", icon: Sparkles },
    { key: "orders", label: "Transactions", icon: ReceiptText },
    { key: "reviews", label: "Reviews", icon: MessageSquare },
    { key: "inquiries", label: "Inquiries", icon: Phone },
    { key: "users", label: "Customers", icon: Users },
  ];

  return (
    <div className="min-h-screen w-full bg-background pb-12 pt-16 md:pb-16 md:pt-20 lg:pt-20">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-4 sm:px-6 md:gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        
        {/* SIDEBAR */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3 md:space-y-5"
        >
          <div className="pb-2 pt-1 lg:pb-4">
            <span className="text-[10px] font-semibold uppercase tracking-tight text-accent">Floramade Admin</span>
            <h1 className="mt-2 text-2xl font-display text-foreground md:text-3xl">Dashboard</h1>
            <p className="mt-1 text-xs text-foreground/50 md:text-sm">Manage your store</p>
          </div>
          
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {TABS.map((tab) => (
              <button 
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex min-w-[calc(50%-0.25rem)] flex-1 items-center gap-2 rounded-xl px-3 py-3 text-left transition-all duration-200 sm:min-w-0 sm:flex-initial sm:px-4 lg:w-full lg:flex-none lg:gap-3 lg:px-4 lg:py-3 ${activeTab === tab.key ? "bg-[#211b13] text-[#f8f3e8] shadow-md shadow-[#211b13]/10" : "border border-transparent text-foreground/65 hover:border-[#b18a3b]/20 hover:bg-white/70 hover:text-foreground"}`}
              >
                <tab.icon size={17} className={activeTab === tab.key ? "text-[#d8bb70]" : "text-accent"} />
                <span className="text-[10px] font-semibold uppercase tracking-tight lg:text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.aside>

        {/* CONTENT */}
        <div className="min-h-[70vh] min-w-0 pt-0">
          <AnimatePresence mode="wait">
            
            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <motion.div key="dashboard" {...fadeAnim} className="space-y-8">
                
                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Total Revenue", value: `₹${totalSales}`, icon: DollarSign },
                    { label: "Total Orders", value: orders.length, icon: Activity },
                    { label: "Avg Order Value", value: `₹${averageOrderValue}`, icon: TrendingUp },
                    { label: "Total Customers", value: users.length, icon: Users }
                  ].map((stat, i) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-2xl border border-[#e6dcc8] bg-[#fffdf8] p-5 shadow-[0_10px_30px_-24px_rgba(33,27,19,.35)] sm:p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b18a3b]/12 text-[#98742e]">
                          <stat.icon size={20} />
                        </div>
                      </div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-tight text-foreground/50">{stat.label}</p>
                      <p className="text-2xl font-medium tabular-nums text-foreground sm:text-3xl">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-[#e6dcc8] bg-[#fffdf8] p-5 shadow-sm sm:p-7">
                    <h3 className="mb-6 text-lg font-medium text-foreground sm:text-xl">Revenue trend</h3>
                    <div className={`${chartData.length ? "h-[300px]" : "min-h-[190px]"} w-full`}>
                      {!chartData.length ? (
                        <div className="flex h-full min-h-[190px] flex-col items-center justify-center rounded-xl border border-dashed border-[#e6dcc8] bg-[#f7f4ed] px-5 text-center">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b18a3b]/10 text-accent"><BarChart3 size={19} /></span>
                          <p className="mt-3 text-sm font-medium text-foreground/75">Your revenue chart is ready</p>
                          <p className="mt-1 text-xs text-foreground/50">It will fill in when your first order arrives.</p>
                        </div>
                      ) : chartsReady && (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a98235" stopOpacity={0.28}/>
                                <stop offset="95%" stopColor="#a98235" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6dcc8" />
                            <XAxis dataKey="index" axisLine={false} tickLine={false} tick={{fill: '#8a8171', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#8a8171', fontSize: 12}} tickFormatter={(v) => `₹${v}`} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#a98235" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e6dcc8] bg-[#fffdf8] p-5 shadow-sm sm:p-7">
                    <h3 className="mb-6 text-lg font-medium text-foreground sm:text-xl">Top products</h3>
                    <div className={`${topProductsData.length ? "h-[300px]" : "min-h-[190px]"} w-full`}>
                      {!topProductsData.length ? (
                        <div className="flex h-full min-h-[190px] flex-col items-center justify-center rounded-xl border border-dashed border-[#e6dcc8] bg-[#f7f4ed] px-5 text-center">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b18a3b]/10 text-accent"><Package size={19} /></span>
                          <p className="mt-3 text-sm font-medium text-foreground/75">No product activity yet</p>
                          <p className="mt-1 text-xs text-foreground/50">This chart will update when orders come in.</p>
                        </div>
                      ) : chartsReady && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={topProductsData} layout="vertical" margin={{ left: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#333', fontSize: 12}} width={100} />
                            <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="quantity" fill="#E8DD95" radius={[0, 4, 4, 0]} barSize={24} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
              <motion.div key="products" {...fadeAnim} className="space-y-8">
                <form onSubmit={saveProduct} className="space-y-7 rounded-3xl border border-[#e6dcc8] bg-[#fffdf8] p-5 shadow-[0_16px_45px_-35px_rgba(33,27,19,.45)] sm:p-7 lg:p-9">
                  <div className="flex flex-col gap-4 border-b border-[#e6dcc8] pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-tight text-accent">Inventory · Product details</span>
                      <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground md:text-3xl">{editingSlug ? "Edit formulation" : "Add a formulation"}</h2>
                      <p className="mt-1 text-sm text-foreground/55">Add the details customers need to discover and order this product.</p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${form.isVisible ? "bg-[#edf2e8] text-[#465d38]" : "bg-muted text-foreground/60"}`}>
                      {form.isVisible ? "Visible in store" : "Hidden from store"}
                    </span>
                  </div>
                  
                  <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <Input 
                      label="Name" 
                      value={form.name} 
                      onChange={(e) => {
                        const newName = e.target.value;
                        setForm((f) => {
                          const oldSlugFromName = slugify(f.name);
                          const isAuto = !f.slug || f.slug === oldSlugFromName;
                          return {
                            ...f,
                            name: newName,
                            slug: isAuto ? slugify(newName) : f.slug
                          };
                        });
                      }} 
                    />
                    <div>
                      <Input 
                        label="Slug (URL handle)" 
                        value={form.slug} 
                        onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} 
                      />
                      <p className="mt-1 text-[10px] text-foreground/50 tracking-tight font-mono">
                        URL: /product/{form.slug || slugify(form.name) || "..."}
                      </p>
                    </div>
                    <div className="space-y-2">
                        <label className="ml-0.5 block text-[11px] font-semibold uppercase tracking-tight text-foreground/60">Category</label>
                      <select
                        value={form.category || "Ayurvedic"}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      >
                        <option value="Ayurvedic">Ayurvedic</option>
                        <option value="Wellness">Wellness</option>
                        <option value="Supplements">Supplements</option>
                        <option value="Skin Care">Skin Care</option>
                        <option value="Hair Care">Hair Care</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Digestive">Digestive</option>
                        <option value="Immunity">Immunity</option>
                      </select>
                    </div>
                    <Input label="Stock Quantity" type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))} />
                    <Input label="Regular Price (₹)" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
                    <Input label="Sale Price (₹)" type="number" value={form.discountPrice} onChange={(e) => setForm((f) => ({ ...f, discountPrice: Number(e.target.value) }))} />
                    <Input label="Delivery Days" type="number" value={form.deliveryDays || 5} onChange={(e) => setForm((f) => ({ ...f, deliveryDays: Number(e.target.value) }))} placeholder="e.g., 5" />
                    <Input label="Display Order (Sequence)" type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} placeholder="0 = First" />
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="product-description" className="ml-0.5 block text-[11px] font-semibold uppercase tracking-tight text-foreground/60">Product description</label>
                      <textarea id="product-description" className="min-h-[130px] w-full resize-y rounded-xl border border-border bg-white p-4 text-sm leading-6 text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="Describe the formulation, its intended use, and what makes it special..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                    </div>
                    
                    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2">
                      <Input label="Ingredients (comma separated)" value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))} />
                      <Input label="How to use steps (comma separated)" value={form.usage} onChange={(e) => setForm((f) => ({ ...f, usage: e.target.value }))} />
                    </div>

                    {/* Pack Management Section */}
                    <section className="space-y-4 rounded-2xl border border-[#e6dcc8] bg-[#fffdf8] p-4 sm:p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">Product Packs</h3>
                          <p className="mt-1 text-xs text-foreground/50">Add pack variants (e.g., 1 Month, 2 Months, 3 Months) with pricing.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({
                            ...f,
                            packs: [...(f.packs || []), { label: "", packCount: 1, sachets: "", price: 0, mrp: 0, image: "", mostPopular: false }],
                          }))}
                          className="rounded-full bg-accent/10 px-4 py-2 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                        >
                          + Add Pack
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(form.packs || []).map((pack, idx) => (
                          <div key={idx} className="rounded-xl border border-foreground/10 bg-white p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-foreground/50 uppercase tracking-tight">Pack {idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => setForm((f) => ({ ...f, packs: f.packs.filter((_, i) => i !== idx) }))}
                                className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                              <Input
                                label="Label"
                                placeholder="e.g., 1 Month"
                                value={pack.label}
                                onChange={(e) => setForm((f) => {
                                  const packs = [...f.packs];
                                  packs[idx] = { ...packs[idx], label: e.target.value };
                                  return { ...f, packs };
                                })}
                              />
                              <Input
                                label="Pack Count"
                                type="number"
                                value={pack.packCount}
                                onChange={(e) => setForm((f) => {
                                  const packs = [...f.packs];
                                  packs[idx] = { ...packs[idx], packCount: Number(e.target.value) };
                                  return { ...f, packs };
                                })}
                              />
                              <Input
                                label="Sachets / Units"
                                placeholder="e.g., 60 Sachets"
                                value={pack.sachets || ""}
                                onChange={(e) => setForm((f) => {
                                  const packs = [...f.packs];
                                  packs[idx] = { ...packs[idx], sachets: e.target.value };
                                  return { ...f, packs };
                                })}
                              />
                              <Input
                                label="Sale Price (₹)"
                                type="number"
                                value={pack.price}
                                onChange={(e) => setForm((f) => {
                                  const packs = [...f.packs];
                                  packs[idx] = { ...packs[idx], price: Number(e.target.value) };
                                  return { ...f, packs };
                                })}
                              />
                              <Input
                                label="MRP (₹)"
                                type="number"
                                value={pack.mrp}
                                onChange={(e) => setForm((f) => {
                                  const packs = [...f.packs];
                                  packs[idx] = { ...packs[idx], mrp: Number(e.target.value) };
                                  return { ...f, packs };
                                })}
                              />
                              <Input
                                label="Pack Image URL"
                                placeholder="https://..."
                                value={pack.image || ""}
                                onChange={(e) => setForm((f) => {
                                  const packs = [...f.packs];
                                  packs[idx] = { ...packs[idx], image: e.target.value };
                                  return { ...f, packs };
                                })}
                              />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={pack.mostPopular || false}
                                onChange={(e) => setForm((f) => {
                                  const packs = f.packs.map((p, i) => ({
                                    ...p,
                                    mostPopular: i === idx ? e.target.checked : false,
                                  }));
                                  return { ...f, packs };
                                })}
                                className="rounded border-foreground/20"
                              />
                              <span className="text-xs font-medium text-foreground/70">Mark as Most Popular</span>
                            </label>
                          </div>
                        ))}
                        {(!form.packs || form.packs.length === 0) && (
                          <p className="rounded-xl bg-[#f7f4ed] p-3 text-xs text-foreground/50">
                            No packs added. Click &quot;+ Add Pack&quot; to create pack variants (e.g., 1 Month ₹900, 2 Months ₹1650).
                          </p>
                        )}
                      </div>
                    </section>

                    {/* KEY BENEFITS & FEATURE ICONS SECTION */}
                    <section className="space-y-5 rounded-2xl border border-[#e6dcc8] bg-[#fffdf8] p-4 sm:p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6dcc8]/70 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#a98235]" />
                            <h3 className="text-base font-bold text-foreground">
                              Key Benefits & Feature Icons
                            </h3>
                            <span className="rounded-full bg-[#a98235]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#8e6b28] uppercase tracking-tight">
                              Store Highlights
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-foreground/60 max-w-2xl leading-relaxed">
                            These benefits appear directly beneath the product title with gold circular badges. Admin can select from pre-defined feature icons (without needing to upload) or upload custom icons, and edit the benefit text.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setForm((f) => ({
                            ...f,
                            keyBenefits: [
                              ...(f.keyBenefits || []),
                              { text: "", image: FEATURE_ICONS[0].icon }
                            ]
                          }))}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#3d2e1a] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#2a1f10] transition-colors shrink-0"
                        >
                          <Plus size={14} />
                          <span>Add Key Benefit</span>
                        </button>
                      </div>

                      {/* Quick Add Presets Bar */}
                      <div className="rounded-xl bg-[#f7f4ed] p-3 border border-[#e6dcc8]/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-tight text-[#8e6b28] flex items-center gap-1.5">
                            <Sparkles size={13} className="text-[#a98235]" />
                            Quick-Add Pre-defined Feature:
                          </span>
                          <span className="text-[10px] text-foreground/50">Click any feature to add with 1 click</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {FEATURE_ICONS.map((feat) => (
                            <button
                              key={feat.id}
                              type="button"
                              onClick={() => setForm((f) => ({
                                ...f,
                                keyBenefits: [
                                  ...(f.keyBenefits || []),
                                  { text: feat.defaultText, image: feat.icon }
                                ]
                              }))}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#dfc77f]/70 bg-white hover:bg-[#fbf9f4] hover:border-[#a98235] text-[11px] font-medium text-[#3d2e1a] shadow-xs transition-all group"
                              title={`Click to add "${feat.name}"`}
                            >
                              <img src={feat.icon} alt={feat.name} className="h-4 w-4 object-contain group-hover:scale-110 transition-transform" />
                              <span>+ {feat.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Benefit Cards List */}
                      <div className="space-y-4">
                        {(form.keyBenefits || []).map((item, idx) => {
                          const activeIcon = FEATURE_ICONS.find(f => f.icon === item.image);

                          return (
                            <div 
                              key={idx}
                              className="rounded-xl border border-[#e6dcc8] bg-white p-4 shadow-xs space-y-4 transition-all hover:border-[#a98235]/60"
                            >
                              <div className="flex items-center justify-between border-b border-foreground/5 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f0ebe1] text-xs font-bold text-[#8e6b28]">
                                    {idx + 1}
                                  </span>
                                  <span className="text-xs font-bold uppercase tracking-tight text-foreground/70">
                                    Benefit #{idx + 1}
                                  </span>
                                  {activeIcon && (
                                    <span className="rounded-md bg-[#edf2e8] px-2 py-0.5 text-[10px] font-semibold text-[#465d38]">
                                      {activeIcon.name}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => setForm((f) => {
                                        const list = [...f.keyBenefits];
                                        const temp = list[idx - 1];
                                        list[idx - 1] = list[idx];
                                        list[idx] = temp;
                                        return { ...f, keyBenefits: list };
                                      })}
                                      className="rounded p-1 text-foreground/40 hover:bg-foreground/5 hover:text-foreground transition-colors"
                                      title="Move Up"
                                    >
                                      <ChevronUp size={15} />
                                    </button>
                                  )}
                                  {idx < (form.keyBenefits.length - 1) && (
                                    <button
                                      type="button"
                                      onClick={() => setForm((f) => {
                                        const list = [...f.keyBenefits];
                                        const temp = list[idx + 1];
                                        list[idx + 1] = list[idx];
                                        list[idx] = temp;
                                        return { ...f, keyBenefits: list };
                                      })}
                                      className="rounded p-1 text-foreground/40 hover:bg-foreground/5 hover:text-foreground transition-colors"
                                      title="Move Down"
                                    >
                                      <ChevronDown size={15} />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setForm((f) => ({
                                      ...f,
                                      keyBenefits: f.keyBenefits.filter((_, i) => i !== idx)
                                    }))}
                                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors ml-2"
                                  >
                                    <Trash2 size={13} />
                                    <span>Remove</span>
                                  </button>
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                                {/* Left: Text Input & Icon Selector */}
                                <div className="space-y-3">
                                  <Input
                                    label="Benefit Text (Headline in badge)"
                                    placeholder="e.g. Relief from Discomfort, Better Results, Promotes Digestion"
                                    value={item.text || ""}
                                    onChange={(e) => setForm((f) => {
                                      const list = [...f.keyBenefits];
                                      list[idx] = { ...list[idx], text: e.target.value };
                                      return { ...f, keyBenefits: list };
                                    })}
                                  />

                                  {/* Pre-defined Feature Icons selector with names */}
                                  <div className="space-y-1.5 pt-1">
                                    <div className="flex items-center justify-between">
                                      <label className="text-[11px] font-bold uppercase tracking-tight text-foreground/70">
                                        Select Feature Icon (Pre-defined from /feature/):
                                      </label>
                                      <span className="text-[10px] text-foreground/50">
                                        Click any icon to assign without upload
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                      {FEATURE_ICONS.map((feat) => {
                                        const isSelected = item.image === feat.icon;
                                        return (
                                          <button
                                            key={feat.id}
                                            type="button"
                                            onClick={() => setForm((f) => {
                                              const list = [...f.keyBenefits];
                                              list[idx] = {
                                                ...list[idx],
                                                image: feat.icon,
                                                text: list[idx].text ? list[idx].text : feat.defaultText,
                                              };
                                              return { ...f, keyBenefits: list };
                                            })}
                                            className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                                              isSelected
                                                ? "border-[#a98235] bg-[#faf6ef] shadow-sm ring-1 ring-[#a98235]"
                                                : "border-foreground/10 bg-white hover:border-[#a98235]/40 hover:bg-[#fbf9f4]"
                                            }`}
                                          >
                                            <div className="h-8 w-8 rounded-full bg-white border border-[#e6dcc8] p-1 flex items-center justify-center shrink-0">
                                              <img src={feat.icon} alt={feat.name} className="h-full w-full object-contain" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <p className={`text-xs font-semibold leading-tight truncate ${isSelected ? "text-[#3d2e1a]" : "text-foreground/80"}`}>
                                                {feat.name}
                                              </p>
                                              <span className="text-[9px] text-foreground/50 truncate block">
                                                {feat.id}
                                              </span>
                                            </div>
                                            {isSelected && (
                                              <div className="h-4 w-4 rounded-full bg-[#3d2e1a] text-white flex items-center justify-center shrink-0">
                                                <Check size={10} strokeWidth={3} />
                                              </div>
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Custom Image Upload / URL (Optional) */}
                                  <div className="pt-2 border-t border-foreground/5 flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="text-[11px] font-semibold text-foreground/60 shrink-0">Or Custom Image:</span>
                                    <input
                                      type="text"
                                      placeholder="Paste custom icon URL"
                                      value={item.image && !item.image.startsWith("/feature/") ? item.image : ""}
                                      onChange={(e) => setForm((f) => {
                                        const list = [...f.keyBenefits];
                                        list[idx] = { ...list[idx], image: e.target.value };
                                        return { ...f, keyBenefits: list };
                                      })}
                                      className="flex-1 rounded-lg border border-foreground/20 px-3 py-1.5 text-xs bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                                    />
                                    <label className="cursor-pointer rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors flex items-center justify-center shrink-0">
                                      <Upload size={12} className="mr-1.5" />
                                      Upload
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          setUploading(true);
                                          const url = await handleImageUpload(file);
                                          if (url) {
                                            setForm((f) => {
                                              const list = [...f.keyBenefits];
                                              list[idx] = { ...list[idx], image: url };
                                              return { ...f, keyBenefits: list };
                                            });
                                          }
                                          setUploading(false);
                                          e.target.value = "";
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>

                                {/* Right: Live Preview of this badge */}
                                <div className="flex flex-col items-center justify-center p-3.5 bg-[#faf6ef] rounded-xl border border-[#e3dac8] w-full md:w-48 text-center shrink-0">
                                  <span className="text-[9px] font-bold uppercase tracking-tight text-[#8e6b28] mb-2">Live Store Look</span>
                                  <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-[#dfc77f] via-[#c9a84c] to-[#8e6b28] p-[1.5px] shadow-sm flex items-center justify-center">
                                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                      <img src={item.image || "/feature/1.svg"} alt={item.text || "Benefit"} className="h-full w-full object-contain" />
                                    </div>
                                  </div>
                                  <p className="mt-2 text-xs font-bold text-[#3d2e1a] line-clamp-2 px-1">
                                    {item.text || <span className="italic text-foreground/40 font-normal">Enter text...</span>}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {(!form.keyBenefits || form.keyBenefits.length === 0) && (
                          <div className="rounded-xl bg-[#f7f4ed] p-6 text-center border border-dashed border-[#c9b989]">
                            <p className="text-sm font-semibold text-foreground/70">No Key Benefits added yet</p>
                            <p className="text-xs text-foreground/50 mt-1">Click &quot;Add Key Benefit&quot; or choose from the Quick-Add presets above to add benefits.</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                      <label className="block text-[11px] font-semibold uppercase tracking-tight text-foreground/60">Product images</label>
                      <div className="rounded-2xl border border-dashed border-[#c9b989] bg-[#f7f4ed]/70 p-6 text-center transition-colors hover:border-primary hover:bg-[#f3edde]">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files);
                            if (files.length === 0) return;
                            
                            setUploading(true);
                            const uploadPromises = files.map(file => handleImageUpload(file));
                            const urls = await Promise.all(uploadPromises);
                            const validUrls = urls.filter(url => url !== null);
                            
                            setForm((f) => {
                              const newImgs = [...(f.images || []), ...validUrls];
                              setImageUrlInput(newImgs.join(", "));
                              return {
                                ...f,
                                images: newImgs,
                              };
                            });
                            setUploading(false);
                            
                            if (validUrls.length > 0) {
                              toast.success(`${validUrls.length} image(s) uploaded`);
                            }
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">Click to upload images</p>
                            <p className="text-xs text-foreground/50">JPG, PNG, WebP, AVIF, or GIF · up to 5 MB · stored in Supabase</p>
                          </div>
                        </label>
                      </div>

                      {/* Image Previews with Reordering & Cover Selection */}
                      {form.images && form.images.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                            <div>
                              <span className="text-xs font-semibold text-foreground">
                                Product Images ({form.images.length})
                              </span>
                              <p className="text-[11px] text-foreground/60">
                                #1 is the front cover. Use arrows or &quot;Make Front&quot; to arrange order.
                              </p>
                            </div>
                            <span className="text-[11px] font-medium text-[#142B49] bg-[#142B49]/10 px-2.5 py-1 rounded-full">
                              Cover: Image #1
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {form.images.map((img, idx) => (
                              <div
                                key={idx}
                                className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all ${
                                  idx === 0
                                    ? "border-[#142B49] ring-2 ring-[#142B49]/20 shadow-md bg-white"
                                    : "border-foreground/15 bg-white hover:border-foreground/30 shadow-sm"
                                }`}
                              >
                                {/* Image display container - clean background for transparent PNGs */}
                                <div className="relative aspect-square w-full p-2.5 flex items-center justify-center bg-transparent">
                                  <img
                                    src={img}
                                    alt={`Product ${idx + 1}`}
                                    className="w-full h-full object-contain select-none transition-transform group-hover:scale-105"
                                  />

                                  {/* Top header badge & Delete button */}
                                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                                    {idx === 0 ? (
                                      <span className="pointer-events-auto inline-flex items-center gap-1 bg-[#142B49] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                                        <Star size={10} className="fill-amber-400 text-amber-400" /> FRONT COVER
                                      </span>
                                    ) : (
                                      <span className="pointer-events-auto bg-[#142B49]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                                        #{idx + 1}
                                      </span>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newImgs = form.images.filter((_, i) => i !== idx);
                                        setForm((f) => ({ ...f, images: newImgs }));
                                        setImageUrlInput(newImgs.join(", "));
                                      }}
                                      className="pointer-events-auto w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow transition-colors"
                                      title="Remove image"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>

                                {/* Reorder Controls Footer */}
                                <div className="border-t border-[#142B49]/10 bg-white/80 backdrop-blur-sm p-1.5 flex items-center justify-between gap-1">
                                  {/* Move Left / Earlier */}
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => moveImage(idx, -1)}
                                    className="p-1 rounded-lg text-[#1A2332] hover:bg-[#142B49]/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                    title="Move left (earlier)"
                                  >
                                    <ChevronLeft size={16} />
                                  </button>

                                  {/* Center action: Set as front or cover label */}
                                  {idx === 0 ? (
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-[#1A2332] px-1">
                                      Main Cover
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setAsMainImage(idx)}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-[#142B49] bg-[#142B49]/10 hover:bg-[#142B49]/20 transition-colors"
                                      title="Make this the front cover"
                                    >
                                      <Star size={11} className="fill-[#142B49]" /> Make Front
                                    </button>
                                  )}

                                  {/* Move Right / Later */}
                                  <button
                                    type="button"
                                    disabled={idx === form.images.length - 1}
                                    onClick={() => moveImage(idx, 1)}
                                    className="p-1 rounded-lg text-[#1A2332] hover:bg-[#142B49]/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                    title="Move right (later)"
                                  >
                                    <ChevronRight size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fallback: Image URLs input */}
                      <div>
                        <label className="block text-xs text-foreground/50 mb-2">Or paste image URLs (comma separated)</label>
                        <input
                          type="text"
                          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          onBlur={(e) => {
                            const urls = e.target.value.split(",").map((x) => x.trim()).filter(Boolean);
                            if (urls.length > 0) {
                              setForm((f) => ({ ...f, images: urls }));
                            }
                          }}
                          className="w-full rounded-2xl border border-foreground/10 p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white/50 transition-all"
                        />
                        <p className="text-xs text-foreground/40 mt-1">URLs will be applied when you click outside this field</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-[#e6dcc8] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${form.isVisible ? 'bg-[#a98235]' : 'bg-foreground/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${form.isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                      <input type="checkbox" className="hidden" checked={form.isVisible} onChange={(e) => setForm((f) => ({ ...f, isVisible: e.target.checked }))} />
                      <span className="text-sm font-medium text-foreground/75">Show this product in the store</span>
                    </label>

                    <div className="flex flex-wrap justify-end gap-3">
                      {editingSlug && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => duplicateProduct({ ...form, slug: editingSlug })} 
                            className="inline-flex items-center gap-1.5 rounded-full border border-amber-800/25 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-100"
                            title="Clone this formulation as a new formulation without existing IDs"
                          >
                            <Copy size={14} /> Duplicate as New
                          </button>
                          <button type="button" onClick={() => { setEditingSlug(""); setForm(empty); }} className="rounded-full px-5 py-3 text-sm font-medium text-foreground/60 transition-colors hover:bg-muted">
                            Cancel
                          </button>
                        </>
                      )}
                      <button type="submit" disabled={uploading} className="rounded-full bg-[#211b13] px-7 py-3 text-sm font-semibold text-[#f8f3e8] shadow-md shadow-[#211b13]/10 transition hover:bg-[#8e6b28] disabled:cursor-wait disabled:opacity-60">
                        {uploading ? "Saving..." : editingSlug ? "Save changes" : "Create product"}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="overflow-hidden rounded-2xl border border-[#e6dcc8] bg-[#fffdf8] shadow-sm">
                  <div className="p-6 border-b border-[#e6dcc8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Catalogue Inventory & Sequence</h2>
                      <p className="text-xs text-foreground/55 mt-0.5">
                        Products ko aage ya niche lagane ke liye Up/Down arrows use karein ya row ko drag & drop karein.
                      </p>
                    </div>
                    {reordering && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold animate-pulse self-start sm:self-auto">
                        Saving order...
                      </span>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-foreground/5 text-xs uppercase tracking-tight text-foreground/50">
                      <tr>
                        <th className="px-5 py-5 font-medium text-center w-28">Order</th>
                        <th className="px-6 py-5 font-medium">Product</th>
                        <th className="px-6 py-5 font-medium">Status</th>
                        <th className="px-6 py-5 font-medium">Price</th>
                        <th className="px-6 py-5 font-medium">MRP</th>
                        <th className="px-6 py-5 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5">
                      {products.map((p, idx) => (
                        <tr 
                          key={p._id || p.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, idx)}
                          className={`hover:bg-white/60 transition-colors ${
                            draggedIdx === idx ? "opacity-40 bg-amber-50" : ""
                          }`}
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center justify-center gap-1.5">
                              <span 
                                title="Drag to reorder" 
                                className="cursor-grab active:cursor-grabbing text-foreground/35 hover:text-foreground/80 p-0.5 select-none"
                              >
                                <GripVertical size={16} />
                              </span>
                              <span className="w-7 h-7 rounded-lg bg-foreground/5 text-foreground/85 text-xs font-bold flex items-center justify-center border border-foreground/10 select-none">
                                #{idx + 1}
                              </span>
                              <div className="flex flex-col gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => moveProduct(idx, -1)}
                                  disabled={idx === 0 || reordering}
                                  title={idx === 0 ? "First product" : "Aage lagao (Move Up)"}
                                  className="p-1 rounded hover:bg-foreground/10 text-foreground/70 hover:text-foreground disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all"
                                  aria-label={`Move ${p.name} Up`}
                                >
                                  <ChevronUp size={15} strokeWidth={2.4} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveProduct(idx, 1)}
                                  disabled={idx === products.length - 1 || reordering}
                                  title={idx === products.length - 1 ? "Last product" : "Niche lagao (Move Down)"}
                                  className="p-1 rounded hover:bg-foreground/10 text-foreground/70 hover:text-foreground disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all"
                                  aria-label={`Move ${p.name} Down`}
                                >
                                  <ChevronDown size={15} strokeWidth={2.4} />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              {p.featureImages?.[0] && (
                                <img src={p.featureImages[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                              )}
                              <div>
                                <p className="font-medium text-foreground">{p.name}</p>
                                <p className="text-xs text-foreground/50">{p.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-tight font-bold ${p.isVisible ? 'bg-amber-100 text-amber-800' : 'bg-orange-100 text-orange-700'}`}>
                              {p.isVisible ? "Active" : "Hidden"}
                            </span>
                          </td>
                          <td className="px-6 py-5 font-light">₹{p.discountPrice || p.price}</td>
                          <td className="px-6 py-5 font-light text-foreground/50 line-through">₹{p.price}</td>
                          <td className="px-6 py-5">
                            <div className="flex justify-end items-center gap-2.5 sm:gap-3 flex-wrap">
                              <button
                                type="button"
                                onClick={() => moveProduct(idx, -1)}
                                disabled={idx === 0 || reordering}
                                title="Aage lagao"
                                className="inline-flex items-center gap-0.5 text-xs uppercase tracking-tight font-semibold text-emerald-700 hover:text-emerald-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              >
                                <ArrowUp size={13} />
                                <span>Up</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => moveProduct(idx, 1)}
                                disabled={idx === products.length - 1 || reordering}
                                title="Niche lagao"
                                className="inline-flex items-center gap-0.5 text-xs uppercase tracking-tight font-semibold text-emerald-700 hover:text-emerald-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              >
                                <ArrowDown size={13} />
                                <span>Down</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => duplicateProduct(p)} 
                                className="inline-flex items-center gap-1 text-xs uppercase tracking-tight font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                                title="Duplicate formulation without existing IDs"
                              >
                                <Copy size={13} />
                                <span>Duplicate</span>
                              </button>
                              <button onClick={() => startEdit(p)} className="text-xs uppercase tracking-tight font-medium text-accent hover:text-secondary transition-colors">Edit</button>
                              <button onClick={() => toggleVisibility(p)} className="text-xs uppercase tracking-tight font-medium text-foreground/50 hover:text-foreground transition-colors">{p.isVisible ? "Hide" : "Show"}</button>
                              <button onClick={() => deleteProduct(p.slug)} className="text-xs uppercase tracking-tight font-medium text-red-400 hover:text-red-600 transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                  {products.length === 0 && (
                    <div className="border-t border-[#e6dcc8] px-6 py-10 text-center sm:py-12">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#b18a3b]/10 text-accent"><Package size={21} /></span>
                      <h3 className="mt-4 text-base font-semibold text-foreground">Your inventory is empty</h3>
                      <p className="mt-1 text-sm text-foreground/55">Add a formulation above to start building your catalogue.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

                        {/* BANNERS & CONCERNS TAB */}
            {activeTab === "customizer" && (
              <motion.div key="customizer" {...fadeAnim} className="space-y-8">
                <BannerConcernManager products={products} />
              </motion.div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <motion.div key="orders" {...fadeAnim} className="space-y-8">
                <div className="bg-white/60 backdrop-blur-md border border-foreground/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-foreground/5">
                    <h2 className="text-3xl font-display italic text-secondary">Recent Transactions</h2>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-foreground/5 text-xs uppercase tracking-tight text-foreground/50">
                      <tr>
                        <th className="px-8 py-6 font-medium">Customer</th>
                        <th className="px-8 py-6 font-medium">Method</th>
                        <th className="px-8 py-6 font-medium">Amount</th>
                        <th className="px-8 py-6 font-medium">Status</th>
                        <th className="px-8 py-6 font-medium text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5">
                      {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-white/40 transition-colors">
                          <td className="px-8 py-6">
                            <p className="font-medium text-foreground">{o.user?.name || "Guest"}</p>
                            <p className="text-xs text-foreground/50">{o.address?.phone || o.user?.phone || "-"}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-tight font-bold ${o.paymentMethod === 'cod' ? 'bg-yellow-100 text-yellow-700' : 'bg-amber-100 text-amber-800'}`}>
                              {o.paymentMethod || "Online"}
                            </span>
                          </td>
                          <td className="px-8 py-6 font-light">₹{o.amount}</td>
                          <td className="px-8 py-6">
                            <select
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                              className="bg-transparent border border-foreground/20 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-tight focus:outline-none focus:border-accent cursor-pointer hover:bg-white/50 transition-colors"
                            >
                              {["placed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <Link href={`/admin/orders/${o._id}`} className="inline-flex items-center gap-1 text-xs uppercase tracking-tight font-medium text-accent hover:text-secondary transition-colors">
                              View <ArrowUpRight size={14} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <motion.div key="reviews" {...fadeAnim} className="space-y-8">
                <div className="bg-white/60 backdrop-blur-md border border-foreground/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-foreground/5">
                    <h2 className="text-3xl font-display italic text-secondary tracking-tight">Manage Reviews</h2>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-foreground/5 text-xs uppercase tracking-tight text-foreground/50">
                      <tr>
                        <th className="px-8 py-6 font-medium">Product</th>
                        <th className="px-8 py-6 font-medium">Customer</th>
                        <th className="px-8 py-6 font-medium">Rating</th>
                        <th className="px-8 py-6 font-medium">Review</th>
                        <th className="px-8 py-6 font-medium">Status</th>
                        <th className="px-8 py-6 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5">
                      {products.flatMap(p => 
                        (p.reviews || []).map((review, idx) => (
                          <tr key={`${p._id}-${review._id || idx}`} className="hover:bg-white/40 transition-colors">
                            <td className="px-8 py-6">
                              <p className="font-medium text-foreground">{p.name}</p>
                            </td>
                            <td className="px-8 py-6">
                              <p className="font-medium text-foreground">{review.name}</p>
                              <p className="text-xs text-foreground/50">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</p>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < review.rating ? "text-amber-500" : "text-gray-300"}>★</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-8 py-6 max-w-xs">
                              <p className="text-sm text-foreground/70 line-clamp-2">{review.comment}</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-tight font-bold ${review.approved ? 'bg-amber-100 text-amber-800' : 'bg-yellow-100 text-yellow-700'}`}>
                                {review.approved ? 'Approved' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => approveReview(p._id, review._id || idx, !review.approved)}
                                  className="p-2 rounded-lg hover:bg-amber-100 text-amber-700 transition-colors"
                                  title={review.approved ? "Unapprove" : "Approve"}
                                >
                                  {review.approved ? <X size={16} /> : <Check size={16} />}
                                </button>
                                <button
                                  onClick={() => deleteReview(p._id, review._id || idx)}
                                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* INQUIRIES TAB */}
            {activeTab === "inquiries" && (
              <motion.div key="inquiries" {...fadeAnim} className="space-y-8">
                <div className="bg-white/60 backdrop-blur-md border border-foreground/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-foreground/5">
                    <h2 className="text-3xl font-display italic text-secondary tracking-tight">Inquiries & Consultations</h2>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-foreground/5 text-xs uppercase tracking-tight text-foreground/50">
                      <tr>
                        <th className="px-8 py-6 font-medium">Customer</th>
                        <th className="px-8 py-6 font-medium">Type</th>
                        <th className="px-8 py-6 font-medium">Product/Msg</th>
                        <th className="px-8 py-6 font-medium">Date</th>
                        <th className="px-8 py-6 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5">
                      {inquiries.map((inq) => (
                        <tr key={inq._id} className="hover:bg-white/40 transition-colors">
                          <td className="px-8 py-6">
                            <p className="font-medium text-foreground">{inq.name}</p>
                            <p className="text-sm text-accent font-bold">{inq.phone}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-tight font-bold ${inq.type === 'consultation' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                              {inq.type}
                            </span>
                          </td>
                          <td className="px-8 py-6 max-w-xs">
                            <p className="text-sm text-foreground/70 line-clamp-2">
                              {inq.productSlug ? `Product: ${inq.productSlug}` : inq.message || "Consultation Request"}
                            </p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs text-foreground/50">{new Date(inq.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <a href={`tel:${inq.phone}`} className="inline-flex items-center gap-1 text-xs uppercase tracking-tight font-medium text-accent hover:text-secondary transition-colors">
                              Call Now <Phone size={14} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <motion.div key="users" {...fadeAnim} className="space-y-8">
                <div className="bg-white/60 backdrop-blur-md border border-foreground/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-foreground/5">
                    <h2 className="text-3xl font-display italic text-secondary tracking-tight">Customer Directory</h2>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-foreground/5 text-xs uppercase tracking-tight text-foreground/50">
                      <tr>
                        <th className="px-8 py-6 font-medium">Customer</th>
                        <th className="px-8 py-6 font-medium">Contact</th>
                        <th className="px-8 py-6 font-medium">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-white/40 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center text-sm font-medium">
                                {u.name?.charAt(0) || "U"}
                              </div>
                              <p className="font-medium text-foreground">{u.name}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm">{u.email}</p>
                            <p className="text-xs text-foreground/50">{u.phone || "No phone"}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-tight font-bold ${u.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-foreground/5 text-foreground/60'}`}>
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <motion.div key="analytics" {...fadeAnim} className="space-y-8">
                <div className="bg-white/60 backdrop-blur-md border border-foreground/5 rounded-[2.5rem] p-8 shadow-sm">
                  <h2 className="text-3xl font-display italic text-secondary tracking-tight mb-8">Analytics Overview</h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="bg-muted/30 rounded-2xl p-6 space-y-4">
                      <h3 className="text-lg font-light tracking-tight">Sales Trend</h3>
                      {chartsReady && (
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#b18a3b" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#b18a3b" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6dfd3" />
                            <XAxis dataKey="index" stroke="#2b2b2b" fontSize={12} />
                            <YAxis stroke="#2b2b2b" fontSize={12} />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#b18a3b" fillOpacity={1} fill="url(#colorRevenue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-6 space-y-4">
                      <h3 className="text-lg font-light tracking-tight">Payment Methods</h3>
                      {chartsReady && (
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie data={paymentData} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                              {paymentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-6 space-y-4 lg:col-span-2">
                      <h3 className="text-lg font-light tracking-tight">Top Products</h3>
                      {chartsReady && (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={topProducts}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6dfd3" />
                            <XAxis dataKey="name" stroke="#2b2b2b" fontSize={12} />
                            <YAxis stroke="#2b2b2b" fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="quantity" fill="#b18a3b" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <motion.div key="settings" {...fadeAnim} className="space-y-8">
                <div className="bg-white/60 backdrop-blur-md border border-foreground/5 rounded-[2.5rem] p-8 shadow-sm">
                  <h2 className="text-3xl font-display italic text-secondary tracking-tight mb-8">Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl">
                      <div>
                        <h3 className="text-lg font-medium tracking-tight">Store Status</h3>
                        <p className="text-sm text-foreground/50">Enable or disable the store for maintenance</p>
                      </div>
                      <button className="px-6 py-3 rounded-full bg-accent text-background font-light uppercase tracking-tight text-xs hover:bg-accent/90 transition-colors">
                        Active
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl">
                      <div>
                        <h3 className="text-lg font-medium tracking-tight">Email Notifications</h3>
                        <p className="text-sm text-foreground/50">Receive order notifications</p>
                      </div>
                      <button className="px-6 py-3 rounded-full bg-foreground text-background font-light uppercase tracking-tight text-xs hover:bg-secondary transition-colors">
                        Enabled
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl">
                      <div>
                        <h3 className="text-lg font-medium tracking-tight">Low Stock Alert</h3>
                        <p className="text-sm text-foreground/50">Alert when products have low stock</p>
                      </div>
                      <button className="px-6 py-3 rounded-full bg-foreground text-background font-light uppercase tracking-tight text-xs hover:bg-secondary transition-colors">
                        Enabled
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
