"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { 
  Sparkles, 
  Upload, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  RotateCcw, 
  Save, 
  Check, 
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Palette,
  Heart,
  MessageSquare,
  Navigation,
  Star,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Flower2
} from "lucide-react";
import { 
  DEFAULT_ANNOUNCEMENT,
  DEFAULT_BANNERS, 
  DEFAULT_CONCERNS,
  DEFAULT_PRODUCT_HEADING,
  DEFAULT_PRODUCT_SUBHEADING,
  DEFAULT_BENEFITS_HEADING,
  DEFAULT_BENEFITS,
  DEFAULT_NAV_LINKS,
  DEFAULT_TESTIMONIALS_PRETITLE,
  DEFAULT_TESTIMONIALS_TITLE,
  DEFAULT_TESTIMONIALS_SUBTITLE,
  DEFAULT_TESTIMONIALS,
} from "@/lib/settings-constants";

const PRESET_COLORS = [
  { name: "Floramade Brown", hex: "#39160D" },
  { name: "Terracotta Sand", hex: "#DBC7B5" },
  { name: "Muted Ocean", hex: "#B8CDD8" },
  { name: "Sage Teal", hex: "#A6C7C4" },
  { name: "Denim Slate", hex: "#9FB5C9" },
  { name: "Herbal Green", hex: "#B4CEB2" },
  { name: "Golden Straw", hex: "#D8D4A8" },
  { name: "Rose Blush", hex: "#E4C5B9" },
  { name: "Warm Olive", hex: "#CCD5AE" },
];

const PRESET_AVATARS = [
  "/review/1.jpeg",
  "/review/2.jpeg",
  "/review/3.jpeg",
  "/review/4.jpeg",
  "/review/5.jpeg",
  "/review/6.jpeg",
  "/review/7.jpeg",
  "/review/8.jpeg",
  "/review/9.jpeg",
  "/review/10.jpeg",
  "/review/11.jpeg",
  "/review/12.jpeg",
  "/review/13.jpeg",
  "/review/14.jpeg",
  "/review/15.jpeg",
  "/review/16.jpeg",
  "/review/17.jpeg",
];

const BENEFIT_ICON_OPTIONS = [
  { value: "natural", label: "Natural Leaf", icon: Leaf },
  { value: "solutions", label: "Custom Solution (Bulb & Cog)", icon: Lightbulb },
  { value: "wellness", label: "Long-Lasting Wellness (Shield)", icon: ShieldCheck },
  { value: "holistic", label: "Holistic Health (Lotus & Hands)", icon: Flower2 },
];

export default function BannerConcernManager() {
  const [subTab, setSubTab] = useState("banners"); // "banners" | "benefits" | "navLinks" | "announcement" | "testimonials"
  
  // Data states
  const [announcement, setAnnouncement] = useState(DEFAULT_ANNOUNCEMENT);
  const [banners, setBanners] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [productHeading, setProductHeading] = useState(DEFAULT_PRODUCT_HEADING);
  const [productSubheading, setProductSubheading] = useState(DEFAULT_PRODUCT_SUBHEADING);
  
  const [benefitsHeading, setBenefitsHeading] = useState(DEFAULT_BENEFITS_HEADING);
  const [benefits, setBenefits] = useState([]);

  const [navLinks, setNavLinks] = useState([]);

  const [testimonialsPretitle, setTestimonialsPretitle] = useState(DEFAULT_TESTIMONIALS_PRETITLE);
  const [testimonialsTitle, setTestimonialsTitle] = useState(DEFAULT_TESTIMONIALS_TITLE);
  const [testimonialsSubtitle, setTestimonialsSubtitle] = useState(DEFAULT_TESTIMONIALS_SUBTITLE);
  const [testimonials, setTestimonials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState(null);

  // Fetch current settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setAnnouncement(data.announcement || DEFAULT_ANNOUNCEMENT);
          setBanners(Array.isArray(data.banners) && data.banners.length > 0 ? data.banners : DEFAULT_BANNERS);
          setConcerns(Array.isArray(data.concerns) && data.concerns.length > 0 ? data.concerns : DEFAULT_CONCERNS);
          if (data.productHeading) setProductHeading(data.productHeading);
          if (data.productSubheading) setProductSubheading(data.productSubheading);
          
          setBenefitsHeading(data.benefitsHeading || DEFAULT_BENEFITS_HEADING);
          setBenefits(Array.isArray(data.benefits) && data.benefits.length > 0 ? data.benefits : DEFAULT_BENEFITS);

          setNavLinks(Array.isArray(data.navLinks) && data.navLinks.length > 0 ? data.navLinks : DEFAULT_NAV_LINKS);

          setTestimonialsPretitle(data.testimonialsPretitle || DEFAULT_TESTIMONIALS_PRETITLE);
          setTestimonialsTitle(data.testimonialsTitle || DEFAULT_TESTIMONIALS_TITLE);
          setTestimonialsSubtitle(data.testimonialsSubtitle || DEFAULT_TESTIMONIALS_SUBTITLE);
          setTestimonials(Array.isArray(data.testimonials) && data.testimonials.length > 0 ? data.testimonials : DEFAULT_TESTIMONIALS);
        } else {
          setAnnouncement(DEFAULT_ANNOUNCEMENT);
          setBanners(DEFAULT_BANNERS);
          setConcerns(DEFAULT_CONCERNS);
          setBenefits(DEFAULT_BENEFITS);
          setNavLinks(DEFAULT_NAV_LINKS);
          setTestimonials(DEFAULT_TESTIMONIALS);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        setAnnouncement(DEFAULT_ANNOUNCEMENT);
        setBanners(DEFAULT_BANNERS);
        setConcerns(DEFAULT_CONCERNS);
        setBenefits(DEFAULT_BENEFITS);
        setNavLinks(DEFAULT_NAV_LINKS);
        setTestimonials(DEFAULT_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Upload helper
  async function handleFileUpload(file, targetKey) {
    if (!file) return;
    try {
      setUploadingTarget(targetKey);
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64, type: "image" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      return data.url;
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload image");
      return null;
    } finally {
      setUploadingTarget(null);
    }
  }

  function updateAnnouncement(field, value) {
    setAnnouncement(prev => ({ ...prev, [field]: value }));
  }

  // Save all settings to database
  async function handleSave() {
    try {
      setSaving(true);
      const payload = {
        announcement,
        banners,
        concerns,
        productHeading,
        productSubheading,
        benefitsHeading,
        benefits,
        navLinks,
        testimonialsPretitle,
        testimonialsTitle,
        testimonialsSubtitle,
        testimonials,
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Settings saved successfully! Website updated live.");
      } else {
        throw new Error(data.error || "Failed to save settings");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    if (confirm("Reset current sections to default settings?")) {
      if (subTab === "announcement") setAnnouncement(DEFAULT_ANNOUNCEMENT);
      if (subTab === "concerns") setConcerns(DEFAULT_CONCERNS);
      if (subTab === "banners") setBanners(DEFAULT_BANNERS);
      if (subTab === "benefits") {
        setBenefitsHeading(DEFAULT_BENEFITS_HEADING);
        setBenefits(DEFAULT_BENEFITS);
      }
      if (subTab === "navLinks") setNavLinks(DEFAULT_NAV_LINKS);
      if (subTab === "testimonials") {
        setTestimonialsPretitle(DEFAULT_TESTIMONIALS_PRETITLE);
        setTestimonialsTitle(DEFAULT_TESTIMONIALS_TITLE);
        setTestimonialsSubtitle(DEFAULT_TESTIMONIALS_SUBTITLE);
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
      toast.success("Reset to defaults. Remember to click 'Save Changes' to persist.");
    }
  }

  // Banner Actions
  function updateBanner(index, field, value) {
    setBanners(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function moveBanner(index, dir) {
    setBanners(prev => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  }

  function deleteBanner(index) {
    if (banners.length <= 1) {
      toast.error("You must keep at least 1 hero banner slide.");
      return;
    }
    setBanners(prev => prev.filter((_, i) => i !== index));
  }

  function addBanner() {
    const newSlide = {
      id: `banner-${Date.now()}`,
      desktop: "/posters/1.jpg",
      mobile: "/posters/mobile1.jpg",
      alt: "Floramade Ayurvedic wellness",
      href: "/collection",
    };
    setBanners(prev => [...prev, newSlide]);
  }

  // Concern actions
  function updateConcern(index, field, value) {
    setConcerns(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function moveConcern(index, dir) {
    setConcerns(prev => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  }

  function deleteConcern(index) {
    if (concerns.length <= 1) {
      toast.error("You must keep at least 1 concern card.");
      return;
    }
    setConcerns(prev => prev.filter((_, i) => i !== index));
  }

  function addConcern() {
    const newConcern = {
      id: `concern-${Date.now()}`,
      title: "NEW CARE",
      image: "https://gcxfqnqewpfypocphmml.supabase.co/storage/v1/object/public/product-media/products/ad217c00-7725-4b8a-bc22-2b861a30e86f.png",
      bgColor: "#39160D",
      href: "/collection",
    };
    setConcerns(prev => [...prev, newConcern]);
  }

  // Benefits Actions
  function updateBenefit(index, field, value) {
    setBenefits(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addBenefit() {
    const newBenefit = {
      id: Date.now(),
      title: "Holistic Health",
      description: "Supports natural wellness and balanced vitality.",
      icon: "holistic",
    };
    setBenefits(prev => [...prev, newBenefit]);
  }

  function deleteBenefit(index) {
    if (benefits.length <= 1) {
      toast.error("You must keep at least 1 benefit card.");
      return;
    }
    setBenefits(prev => prev.filter((_, i) => i !== index));
  }

  // Nav Links Actions
  function updateNavLink(index, field, value) {
    setNavLinks(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addNavLink() {
    const newLink = {
      id: `nav-${Date.now()}`,
      label: "NEW LINK",
      href: "/collection",
      type: "link",
    };
    setNavLinks(prev => [...prev, newLink]);
  }

  function deleteNavLink(index) {
    if (navLinks.length <= 1) {
      toast.error("You must keep at least 1 navbar link.");
      return;
    }
    setNavLinks(prev => prev.filter((_, i) => i !== index));
  }

  function moveNavLink(index, dir) {
    setNavLinks(prev => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  }

  function cleanNavUrl(val) {
    if (!val) return "";
    let s = val.trim();
    try {
      if (s.startsWith("http://") || s.startsWith("https://")) {
        const u = new URL(s);
        s = u.pathname + u.search;
      }
    } catch (e) {}
    return s;
  }

  function addSubLink(parentIndex) {
    setNavLinks(prev => {
      const next = [...prev];
      const parent = { ...next[parentIndex] };
      const subLinks = Array.isArray(parent.subLinks) ? [...parent.subLinks] : [];
      subLinks.push({
        id: `sub-${Date.now()}`,
        label: "Madhu Diabetes Pro",
        badge: "Diabetes PRO",
        description: "Advanced Ayurvedic formulation for blood sugar & vitality",
        href: "/product/madhu-diabetes-pro",
      });
      parent.subLinks = subLinks;
      next[parentIndex] = parent;
      return next;
    });
  }

  function updateSubLink(parentIndex, subIndex, field, value) {
    setNavLinks(prev => {
      const next = [...prev];
      const parent = { ...next[parentIndex] };
      const subLinks = [...parent.subLinks];
      const finalVal = field === "href" ? cleanNavUrl(value) : value;
      subLinks[subIndex] = { ...subLinks[subIndex], [field]: finalVal };
      parent.subLinks = subLinks;
      next[parentIndex] = parent;
      return next;
    });
  }

  function moveSubLink(parentIndex, subIndex, dir) {
    setNavLinks(prev => {
      const next = [...prev];
      const parent = { ...next[parentIndex] };
      const subLinks = [...parent.subLinks];
      const target = subIndex + dir;
      if (target < 0 || target >= subLinks.length) return prev;
      const temp = subLinks[subIndex];
      subLinks[subIndex] = subLinks[target];
      subLinks[target] = temp;
      parent.subLinks = subLinks;
      next[parentIndex] = parent;
      return next;
    });
  }

  function deleteSubLink(parentIndex, subIndex) {
    setNavLinks(prev => {
      const next = [...prev];
      const parent = { ...next[parentIndex] };
      parent.subLinks = parent.subLinks.filter((_, i) => i !== subIndex);
      next[parentIndex] = parent;
      return next;
    });
  }

  // Testimonial Actions
  function updateTestimonial(index, field, value) {
    setTestimonials(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function moveTestimonial(index, dir) {
    setTestimonials(prev => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  }

  function deleteTestimonial(index) {
    if (testimonials.length <= 1) {
      toast.error("You must keep at least 1 testimonial.");
      return;
    }
    setTestimonials(prev => prev.filter((_, i) => i !== index));
  }

  function addTestimonial() {
    const newT = {
      id: `t-${Date.now()}`,
      name: "New Customer",
      role: "Verified Customer",
      location: "India",
      rating: 5,
      tag: "OVERALL HEALTH",
      text: "Floramade products have given me wonderful results. Highly recommended for daily wellness!",
      img: "/review/1.jpeg",
      initials: "NC",
    };
    setTestimonials(prev => [...prev, newT]);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-[#39160D]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#39160D] border-t-transparent mb-3" />
        <p className="text-sm font-semibold tracking-tight">Loading Store Customizer...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[2rem] border border-[#211b13]/10 bg-white/80 p-6 md:p-8 backdrop-blur-md shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#872B10]/10 text-[#872B10] text-[11px] font-bold tracking-tight mb-2">
            <Sparkles size={13} />
            <span>WEBSITE SECTIONS CUSTOMIZER</span>
          </div>
          <h2 className="text-2xl md:text-3xl text-[#39160D] font-bold tracking-tight">
            Store Content & Navigation
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 tracking-tight mt-1">
            Manage Hero Banners, Benefits Section, Bottom Navbar links, Announcement Bar, and Testimonials.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-black/10 text-[#39160D] hover:bg-black/5 text-xs font-semibold tracking-tight transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#39160D] text-[#FFF7EB] hover:bg-[#872B10] disabled:opacity-50 text-xs font-semibold tracking-tight transition-all shadow-md active:scale-95"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFF7EB] border-t-transparent" />
            ) : (
              <Save size={15} />
            )}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#211b13]/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { key: "banners", label: "Hero Banners", icon: ImageIcon, count: banners.length },
          { key: "benefits", label: "Benefits Section", icon: ShieldCheck, count: benefits.length },
          { key: "navLinks", label: "Navbar Links", icon: Navigation, count: navLinks.length },
          { key: "announcement", label: "Announcement Bar", icon: Sparkles, count: announcement?.enabled !== false ? "Active" : "Off" },
          { key: "testimonials", label: "Testimonials", icon: MessageSquare, count: testimonials.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSubTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-tight transition-all whitespace-nowrap ${
              subTab === tab.key
                ? "bg-[#39160D] text-[#FFF7EB] shadow-sm"
                : "text-foreground/60 hover:text-foreground hover:bg-white/60"
            }`}
          >
            <tab.icon size={15} />
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              subTab === tab.key ? "bg-[#FFF7EB]/20 text-[#FFF7EB]" : "bg-black/5 text-foreground/50"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>



      {/* =====================================================================
          TAB 2: HERO BANNERS
          ===================================================================== */}
      {subTab === "banners" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#39160D] tracking-tight">
                Hero Banner Slides ({banners.length})
              </h3>
              <p className="text-xs text-foreground/60 tracking-tight">
                Customize desktop and mobile hero carousel images.
              </p>
            </div>
            <button
              type="button"
              onClick={addBanner}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#872B10] text-[#FFF7EB] hover:bg-[#39160D] text-xs font-bold uppercase tracking-tight transition-all shadow-sm"
            >
              <Plus size={14} /> Add Hero Slide
            </button>
          </div>

          <div className="space-y-5">
            {banners.map((banner, idx) => (
              <div
                key={banner.id || idx}
                className="bg-white rounded-2xl border border-[#211b13]/10 p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-black/5">
                  <span className="text-xs font-bold text-[#872B10] uppercase tracking-tight">
                    Slide #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveBanner(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-black/5 text-[#39160D] disabled:opacity-30"
                      title="Move Up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBanner(idx, 1)}
                      disabled={idx === banners.length - 1}
                      className="p-1 rounded hover:bg-black/5 text-[#39160D] disabled:opacity-30"
                      title="Move Down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBanner(idx)}
                      className="p-1 rounded hover:bg-red-50 text-red-600 ml-1"
                      title="Delete Slide"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Desktop Image */}
                  <div>
                    <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                      Desktop Poster Image
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={banner.desktop || ""}
                        onChange={e => updateBanner(idx, "desktop", e.target.value)}
                        placeholder="/posters/1.jpg"
                        className="flex-1 rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-xs text-[#39160D] tracking-tight focus:border-[#DFC77F] focus:outline-none"
                      />
                      <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#39160D] text-[#FFF7EB] hover:bg-[#872B10] text-xs font-bold tracking-tight transition-colors">
                        <Upload size={13} />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file, `banner-desktop-${idx}`);
                              if (url) updateBanner(idx, "desktop", url);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {banner.desktop && (
                      <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-black/10 bg-slate-100">
                        <Image src={banner.desktop} alt={banner.alt || "Desktop preview"} fill unoptimized className="object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Mobile Image */}
                  <div>
                    <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                      Mobile Poster Image
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={banner.mobile || ""}
                        onChange={e => updateBanner(idx, "mobile", e.target.value)}
                        placeholder="/posters/mobile1.jpg"
                        className="flex-1 rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-xs text-[#39160D] tracking-tight focus:border-[#DFC77F] focus:outline-none"
                      />
                      <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#39160D] text-[#FFF7EB] hover:bg-[#872B10] text-xs font-bold tracking-tight transition-colors">
                        <Upload size={13} />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file, `banner-mobile-${idx}`);
                              if (url) updateBanner(idx, "mobile", url);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {banner.mobile && (
                      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-black/10 bg-slate-100">
                        <Image src={banner.mobile} alt={banner.alt || "Mobile preview"} fill unoptimized className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                      Alt Description (SEO)
                    </label>
                    <input
                      type="text"
                      value={banner.alt || ""}
                      onChange={e => updateBanner(idx, "alt", e.target.value)}
                      placeholder="Floramade Ayurvedic Product"
                      className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-xs text-[#39160D] tracking-tight focus:border-[#DFC77F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                      Click Destination (Link URL)
                    </label>
                    <input
                      type="text"
                      value={banner.href || "/collection"}
                      onChange={e => updateBanner(idx, "href", e.target.value)}
                      placeholder="/collection"
                      className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-xs text-[#39160D] tracking-tight focus:border-[#DFC77F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: BENEFITS SECTION
          ===================================================================== */}
      {subTab === "benefits" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#39160D] tracking-tight">
                Benefits Section Cards ({benefits.length})
              </h3>
              <p className="text-xs text-foreground/60 tracking-tight">
                Customize the Benefits heading and the cards describing your brand values.
              </p>
            </div>
            <button
              type="button"
              onClick={addBenefit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#872B10] text-[#FFF7EB] hover:bg-[#39160D] text-xs font-bold uppercase tracking-tight transition-all shadow-sm"
            >
              <Plus size={14} /> Add Benefit Card
            </button>
          </div>

          {/* Section Heading Input */}
          <div className="bg-white rounded-2xl border border-[#211b13]/10 p-5 shadow-sm">
            <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
              Section Heading
            </label>
            <input
              type="text"
              value={benefitsHeading}
              onChange={e => setBenefitsHeading(e.target.value)}
              placeholder="Benefits"
              className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3.5 py-2.5 text-base font-bold text-[#39160D] tracking-tight focus:border-[#DFC77F] focus:outline-none"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {benefits.map((benefit, idx) => (
              <div
                key={benefit.id || idx}
                className="bg-white rounded-2xl border border-[#211b13]/10 p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-black/5">
                  <span className="text-xs font-bold text-[#872B10] uppercase tracking-tight">
                    Benefit #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteBenefit(idx)}
                    className="p-1 rounded hover:bg-red-50 text-red-600"
                    title="Delete Card"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={benefit.title || ""}
                    onChange={e => updateBenefit(idx, "title", e.target.value)}
                    placeholder="e.g. Natural Healing"
                    className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-sm font-bold text-[#39160D] tracking-tight focus:border-[#DFC77F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                    Description Text
                  </label>
                  <textarea
                    rows={3}
                    value={benefit.description || ""}
                    onChange={e => updateBenefit(idx, "description", e.target.value)}
                    placeholder="Describe this benefit..."
                    className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-xs text-[#39160D] tracking-tight focus:border-[#DFC77F] focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                    Icon Style
                  </label>
                  <select
                    value={benefit.icon || "natural"}
                    onChange={e => updateBenefit(idx, "icon", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-xs font-semibold text-[#39160D] tracking-tight focus:border-[#DFC77F] focus:outline-none"
                  >
                    {BENEFIT_ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: HEADER NAVBAR LINKS
          ===================================================================== */}
      {subTab === "navLinks" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#39160D] tracking-tight">
                Header Navbar Links ({navLinks.length})
              </h3>
              <p className="text-xs text-foreground/60 tracking-tight">
                Configure the main header navigation menu links and dropdown items shown across the entire site.
              </p>
            </div>
            <button
              type="button"
              onClick={addNavLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#872B10] text-[#FFF7EB] hover:bg-[#39160D] text-xs font-bold uppercase tracking-tight transition-all shadow-sm"
            >
              <Plus size={14} /> Add Navbar Link
            </button>
          </div>

          <div className="space-y-5">
            {navLinks.map((link, idx) => (
              <div
                key={link.id || idx}
                className="bg-white rounded-2xl border border-[#211b13]/10 p-5 sm:p-6 shadow-sm space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#872B10] uppercase tracking-tight">
                      Navbar Link #{idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      link.type === "dropdown" ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                    }`}>
                      {link.type === "dropdown" ? "Dropdown Menu (On Hover)" : "Standard Direct Link"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveNavLink(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg hover:bg-black/5 text-[#39160D] disabled:opacity-25 transition-colors"
                      title="Move Up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveNavLink(idx, 1)}
                      disabled={idx === navLinks.length - 1}
                      className="p-1.5 rounded-lg hover:bg-black/5 text-[#39160D] disabled:opacity-25 transition-colors"
                      title="Move Down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNavLink(idx)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 ml-1 transition-colors"
                      title="Delete Link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#39160D]/80 uppercase tracking-tight mb-1.5">
                      Navbar Display Label
                    </label>
                    <input
                      type="text"
                      value={link.label || ""}
                      onChange={e => updateNavLink(idx, "label", e.target.value)}
                      placeholder="e.g. MADHUCUREX"
                      className="w-full rounded-xl border border-[#39160D]/20 bg-white px-3.5 py-2.5 text-xs font-bold uppercase text-[#39160D] tracking-tight placeholder:text-[#39160D]/30 focus:border-[#872B10] focus:ring-1 focus:ring-[#872B10] focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#39160D]/80 uppercase tracking-tight mb-1.5">
                      Direct Click URL (Fallback)
                    </label>
                    <input
                      type="text"
                      value={link.href || ""}
                      onChange={e => updateNavLink(idx, "href", cleanNavUrl(e.target.value))}
                      placeholder="/product/madhu-diabetes-pro"
                      className="w-full rounded-xl border border-[#39160D]/20 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#39160D] tracking-tight placeholder:text-[#39160D]/30 focus:border-[#872B10] focus:ring-1 focus:ring-[#872B10] focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#39160D]/80 uppercase tracking-tight mb-1.5">
                      Link Behavior
                    </label>
                    <select
                      value={link.type || "link"}
                      onChange={e => {
                        const newType = e.target.value;
                        updateNavLink(idx, "type", newType);
                        if (newType === "dropdown" && (!link.subLinks || link.subLinks.length === 0)) {
                          addSubLink(idx);
                        }
                      }}
                      className="w-full rounded-xl border border-[#39160D]/20 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#39160D] tracking-tight focus:border-[#872B10] focus:ring-1 focus:ring-[#872B10] focus:outline-none shadow-sm"
                    >
                      <option value="link">Direct Click Link</option>
                      <option value="dropdown">Dropdown Menu (Opens On Hover)</option>
                    </select>
                  </div>
                </div>

                {/* Dropdown items editor */}
                {link.type === "dropdown" && (
                  <div className="mt-4 pt-4 border-t border-[#39160D]/10 bg-[#FFF7EB]/50 rounded-2xl p-4 sm:p-5 space-y-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-[#872B10] uppercase tracking-tight">
                          Dropdown Menu Products ({link.subLinks?.length || 0})
                        </span>
                        <p className="text-[11px] text-[#39160D]/70 tracking-tight">
                          These items appear in the floating card when visitors hover over <span className="font-bold">{link.label || "this link"}</span>.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addSubLink(idx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#872B10] text-[#FFF7EB] hover:bg-[#39160D] text-[11px] font-bold uppercase tracking-tight transition-all shadow-sm active:scale-95"
                      >
                        <Plus size={13} /> Add Product / Item
                      </button>
                    </div>

                    {/* Tagline */}
                    <div>
                      <label className="block text-[10px] font-bold text-[#39160D]/80 uppercase tracking-tight mb-1">
                        Dropdown Header Tagline
                      </label>
                      <input
                        type="text"
                        value={link.subHeading || ""}
                        onChange={e => updateNavLink(idx, "subHeading", e.target.value)}
                        placeholder="e.g. Ayurvedic Sugar Support"
                        className="w-full rounded-xl border border-[#39160D]/20 bg-white px-3.5 py-2 text-xs font-semibold text-[#39160D] placeholder:text-[#39160D]/30 focus:border-[#872B10] focus:outline-none shadow-sm"
                      />
                    </div>

                    {/* Sublinks cards */}
                    <div className="space-y-3.5">
                      {(link.subLinks || []).map((sub, sIdx) => {
                        const isMadhuPro = sub.href?.includes("madhu-diabetes-pro");
                        return (
                          <div 
                            key={sub.id || sIdx} 
                            className={`bg-white rounded-xl p-4 border transition-all shadow-sm space-y-3 ${
                              isMadhuPro 
                                ? "border-[#872B10]/40 ring-1 ring-[#872B10]/20" 
                                : "border-[#39160D]/15 hover:border-[#39160D]/30"
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#39160D]/10">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#39160D]">
                                  Item #{sIdx + 1}
                                </span>
                                {isMadhuPro && (
                                  <span className="text-[10px] font-bold bg-[#872B10] text-[#FFF7EB] px-2 py-0.5 rounded-full shadow-xs">
                                    ✓ Active Madhu Diabetes Pro
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateSubLink(idx, sIdx, "label", "Madhu Diabetes Pro");
                                    updateSubLink(idx, sIdx, "badge", "Diabetes PRO");
                                    updateSubLink(idx, sIdx, "href", "/product/madhu-diabetes-pro");
                                    updateSubLink(idx, sIdx, "description", "Advanced Ayurvedic formulation for blood sugar & vitality");
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#872B10]/10 hover:bg-[#872B10] text-[#872B10] hover:text-white text-[10px] font-bold tracking-tight transition-colors shadow-xs"
                                  title="Quick Fill Madhu Diabetes Pro"
                                >
                                  ⚡ Quick Fill: Madhu Diabetes Pro
                                </button>

                                <button
                                  type="button"
                                  onClick={() => moveSubLink(idx, sIdx, -1)}
                                  disabled={sIdx === 0}
                                  className="p-1 rounded hover:bg-black/5 text-[#39160D] disabled:opacity-20 transition-colors"
                                  title="Move Up"
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveSubLink(idx, sIdx, 1)}
                                  disabled={sIdx === (link.subLinks?.length || 1) - 1}
                                  className="p-1 rounded hover:bg-black/5 text-[#39160D] disabled:opacity-20 transition-colors"
                                  title="Move Down"
                                >
                                  <ChevronDown size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteSubLink(idx, sIdx)}
                                  className="p-1 rounded hover:bg-red-50 text-red-600 transition-colors ml-1"
                                  title="Delete item"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-[#39160D]/80 uppercase tracking-tight mb-1">
                                  Product Title
                                </label>
                                <input
                                  type="text"
                                  value={sub.label || ""}
                                  onChange={e => updateSubLink(idx, sIdx, "label", e.target.value)}
                                  placeholder="e.g. Madhu Diabetes Pro"
                                  className="w-full rounded-xl border border-[#39160D]/20 bg-white px-3 py-2 text-xs font-bold text-[#39160D] placeholder:text-[#39160D]/30 focus:border-[#872B10] focus:ring-1 focus:ring-[#872B10] focus:outline-none shadow-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-[#39160D]/80 uppercase tracking-tight mb-1">
                                  Badge / Pill (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={sub.badge || ""}
                                  onChange={e => updateSubLink(idx, sIdx, "badge", e.target.value)}
                                  placeholder="e.g. Diabetes PRO"
                                  className="w-full rounded-xl border border-[#39160D]/20 bg-white px-3 py-2 text-xs font-semibold text-[#39160D] placeholder:text-[#39160D]/30 focus:border-[#872B10] focus:ring-1 focus:ring-[#872B10] focus:outline-none shadow-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-[#39160D]/80 uppercase tracking-tight mb-1">
                                  Target Product URL
                                </label>
                                <input
                                  type="text"
                                  value={sub.href || ""}
                                  onChange={e => updateSubLink(idx, sIdx, "href", e.target.value)}
                                  placeholder="/product/madhu-diabetes-pro"
                                  className="w-full rounded-xl border border-[#39160D]/20 bg-white px-3 py-2 text-xs font-semibold text-[#39160D] placeholder:text-[#39160D]/30 focus:border-[#872B10] focus:ring-1 focus:ring-[#872B10] focus:outline-none shadow-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-[#39160D]/80 uppercase tracking-tight mb-1">
                                Short Description
                              </label>
                              <input
                                type="text"
                                value={sub.description || ""}
                                onChange={e => updateSubLink(idx, sIdx, "description", e.target.value)}
                                placeholder="e.g. Advanced Ayurvedic formulation for blood sugar & vitality"
                                className="w-full rounded-xl border border-[#39160D]/20 bg-white px-3 py-2 text-xs font-normal text-[#39160D] placeholder:text-[#39160D]/30 focus:border-[#872B10] focus:ring-1 focus:ring-[#872B10] focus:outline-none shadow-sm"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Live Preview Card */}
                    <div className="pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#872B10] mb-2">
                        👁 Live Dropdown Preview (How customers see it on hover):
                      </p>
                      <div className="bg-[#FFF7EB] border border-[#E8D9C5] rounded-2xl shadow-lg p-3 max-w-sm">
                        {link.subHeading && (
                          <div className="px-2.5 py-1.5 border-b border-[#39160D]/10 mb-2">
                            <span className="text-[10px] uppercase font-bold text-[#872B10] flex items-center gap-1">
                              <Sparkles size={11} /> {link.subHeading}
                            </span>
                          </div>
                        )}
                        <div className="space-y-1.5">
                          {(link.subLinks || []).map((sub, sIdx) => {
                            const isMadhuPro = sub.href?.includes("madhu-diabetes-pro");
                            return (
                              <div
                                key={sIdx}
                                className={`p-2.5 rounded-xl flex items-start justify-between gap-2 ${
                                  isMadhuPro ? "bg-[#872B10]/10 border border-[#872B10]/30" : "bg-white/70 border border-[#39160D]/10"
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-[#39160D]">{sub.label || "Product"}</span>
                                    {sub.badge && (
                                      <span className="text-[9px] font-bold bg-[#872B10] text-[#FFF7EB] px-1.5 py-0.2 rounded-full">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  {sub.description && (
                                    <p className="text-[10px] text-[#39160D]/70 mt-0.5 leading-snug">{sub.description}</p>
                                  )}
                                  <span className="text-[9px] text-[#872B10] font-mono mt-1 block font-semibold">{sub.href || "#"}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: TESTIMONIALS & CUSTOMER USER PHOTOS
          ===================================================================== */}
      {subTab === "testimonials" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#39160D] tracking-tight">
                Customer Testimonials ({testimonials.length})
              </h3>
              <p className="text-xs text-foreground/60 tracking-tight">
                Edit review quotes, verified customer tags, ratings, names, cities, and upload customer avatar photos.
              </p>
            </div>
            <button
              type="button"
              onClick={addTestimonial}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#872B10] text-[#FFF7EB] hover:bg-[#39160D] text-xs font-bold uppercase tracking-tight transition-all shadow-sm"
            >
              <Plus size={14} /> Add New Review
            </button>
          </div>

          {/* Section Headers Inputs */}
          <div className="bg-white rounded-2xl border border-[#211b13]/10 p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                Top Small Tagline (Pretitle)
              </label>
              <input
                type="text"
                value={testimonialsPretitle}
                onChange={e => setTestimonialsPretitle(e.target.value)}
                placeholder="KIND WORDS FROM OUR COMMUNITY"
                className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-xs font-bold text-[#872B10] uppercase tracking-tight"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                Main Heading Title
              </label>
              <input
                type="text"
                value={testimonialsTitle}
                onChange={e => setTestimonialsTitle(e.target.value)}
                placeholder="Wellness stories, shared."
                className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-xs font-bold text-[#39160D] tracking-tight"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                Subtitle Description
              </label>
              <input
                type="text"
                value={testimonialsSubtitle}
                onChange={e => setTestimonialsSubtitle(e.target.value)}
                placeholder="Real experiences from people who made Floramade a part of their daily wellness journey."
                className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-xs text-[#39160D] tracking-tight"
              />
            </div>
          </div>

          {/* Testimonials List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.id || idx}
                className="bg-white rounded-2xl border border-[#211b13]/10 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-3">
                    <span className="text-xs font-bold text-[#872B10] uppercase tracking-tight">
                      Review #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveTestimonial(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-black/5 text-[#39160D] disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTestimonial(idx, 1)}
                        disabled={idx === testimonials.length - 1}
                        className="p-1 rounded hover:bg-black/5 text-[#39160D] disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTestimonial(idx)}
                        className="p-1 rounded hover:bg-red-50 text-red-600 ml-1"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Customer Avatar & Photo Upload */}
                  <div className="flex items-center gap-4 p-3 bg-[#FAF6F0] rounded-xl mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-[#39160D]/10">
                      {t.img ? (
                        <Image
                          src={t.img}
                          alt={t.name || "Customer avatar"}
                          fill
                          unoptimized
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#39160D]">
                          {t.initials || t.name?.[0] || "U"}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <p className="text-xs font-bold text-[#39160D] tracking-tight">Customer Avatar Photo</p>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#39160D] text-[#FFF7EB] hover:bg-[#872B10] text-[11px] font-bold tracking-tight transition-colors">
                          <Upload size={12} />
                          <span>{uploadingTarget === `testimonial-${idx}` ? "Uploading..." : "Upload New Photo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await handleFileUpload(file, `testimonial-${idx}`);
                                if (url) updateTestimonial(idx, "img", url);
                              }
                            }}
                          />
                        </label>

                        {/* Preset avatar picker */}
                        <select
                          value={t.img || ""}
                          onChange={e => updateTestimonial(idx, "img", e.target.value)}
                          className="rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] text-[#39160D]"
                        >
                          <option value="">Or choose preset avatar</option>
                          {PRESET_AVATARS.map((av, avIdx) => (
                            <option key={av} value={av}>
                              Sample Customer #{avIdx + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                        Testimonial Quote
                      </label>
                      <textarea
                        rows={3}
                        value={t.text || ""}
                        onChange={e => updateTestimonial(idx, "text", e.target.value)}
                        placeholder="Write customer review..."
                        className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-2 text-xs text-[#39160D] tracking-tight focus:border-[#DFC77F] focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={t.name || ""}
                          onChange={e => updateTestimonial(idx, "name", e.target.value)}
                          placeholder="e.g. Mr. Amit Patel"
                          className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-1.5 text-xs font-bold text-[#39160D] tracking-tight"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                          Location / City
                        </label>
                        <input
                          type="text"
                          value={t.location || ""}
                          onChange={e => updateTestimonial(idx, "location", e.target.value)}
                          placeholder="e.g. Ahmedabad"
                          className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-3 py-1.5 text-xs text-[#39160D] tracking-tight"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                          Badge Tag
                        </label>
                        <input
                          type="text"
                          value={t.tag || "OVERALL HEALTH"}
                          onChange={e => updateTestimonial(idx, "tag", e.target.value)}
                          placeholder="PILES RELIEF"
                          className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-2.5 py-1.5 text-xs font-bold uppercase text-[#872B10] tracking-tight"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                          Role Tag
                        </label>
                        <input
                          type="text"
                          value={t.role || "Verified Customer"}
                          onChange={e => updateTestimonial(idx, "role", e.target.value)}
                          placeholder="Verified Customer"
                          className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-2.5 py-1.5 text-xs text-[#39160D] tracking-tight"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-foreground/70 uppercase tracking-tight mb-1">
                          Rating (Stars)
                        </label>
                        <select
                          value={t.rating || 5}
                          onChange={e => updateTestimonial(idx, "rating", Number(e.target.value))}
                          className="w-full rounded-xl border border-black/10 bg-[#FFF7EB]/40 px-2.5 py-1.5 text-xs font-bold text-[#39160D]"
                        >
                          <option value={5}>★★★★★ (5 Stars)</option>
                          <option value={4}>★★★★☆ (4 Stars)</option>
                          <option value={3}>★★★☆☆ (3 Stars)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: TOP ANNOUNCEMENT BAR SETTINGS
          ===================================================================== */}
      {subTab === "announcement" && (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#39160D] tracking-tight">
                Top Announcement Bar Settings
              </h3>
              <p className="text-xs text-foreground/60 tracking-tight">
                Customize top header offer banner text, festive discounts, emoji icon, gold highlight badge, or toggle visibility.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#39160D] text-[#FFF7EB] hover:bg-[#872B10] text-xs font-bold uppercase tracking-tight transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#39160D]/70">
              Live Preview (Header Top Banner)
            </span>
            <div className="bg-[#39160D] text-[#FFF7EB] py-2.5 px-4 rounded-xl border border-[#4A1E13] shadow-md flex items-center justify-between text-xs font-medium">
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#FFF7EB]/80">
                <span className="h-5 w-5 rounded-full bg-[#FFF7EB]/10 flex items-center justify-center text-[10px]">f</span>
                <span className="h-5 w-5 rounded-full bg-[#FFF7EB]/10 flex items-center justify-center text-[10px]">📷</span>
                <span className="text-[11px]">Follow us!</span>
              </div>
              <div className="flex-1 text-center truncate px-2">
                <span className="inline-flex items-center gap-1.5 text-[#FFF7EB] font-semibold text-xs">
                  {announcement.emoji && <span>{announcement.emoji}</span>}
                  {announcement.highlight && (
                    <span className="text-[#DFC77F]">{announcement.highlight}</span>
                  )}
                  <span>{announcement.text || "Save Up to 20% + Extra Combo OFF!"}</span>
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#FFF7EB]/80">
                <span className="text-[11px]">Get in touch with us</span>
                <span className="h-5 w-5 rounded-full bg-[#FFF7EB]/10 flex items-center justify-center text-[10px]">📞</span>
                <span className="h-5 w-5 rounded-full bg-[#FFF7EB]/10 flex items-center justify-center text-[10px]">✉️</span>
              </div>
            </div>
            {announcement.enabled === false && (
              <p className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                ⚠️ Announcement bar is currently turned OFF. It will not appear on the website.
              </p>
            )}
          </div>

          {/* Configuration Form Card */}
          <div className="bg-white/80 backdrop-blur-md border border-[#211b13]/10 rounded-2xl p-6 shadow-xs space-y-5">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-[#211b13]/10">
              <div>
                <p className="text-sm font-bold text-[#39160D]">Show Announcement Bar</p>
                <p className="text-xs text-foreground/60">Display this top announcement bar on all website pages.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcement.enabled !== false}
                  onChange={(e) => updateAnnouncement("enabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#872B10]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Emoji */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#39160D] mb-1.5">
                  Icon / Emoji
                </label>
                <input
                  type="text"
                  value={announcement.emoji || ""}
                  onChange={(e) => updateAnnouncement("emoji", e.target.value)}
                  placeholder="🎉"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#211b13]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#872B10]/20 focus:border-[#872B10]"
                />
              </div>

              {/* Highlight Prefix */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#39160D] mb-1.5">
                  Golden Highlight Prefix (e.g. "Festive Offer:")
                </label>
                <input
                  type="text"
                  value={announcement.highlight || ""}
                  onChange={(e) => updateAnnouncement("highlight", e.target.value)}
                  placeholder="Festive Offer:"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#211b13]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#872B10]/20 focus:border-[#872B10]"
                />
              </div>
            </div>

            {/* Main Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#39160D] mb-1.5">
                Main Announcement Offer Text
              </label>
              <input
                type="text"
                value={announcement.text || ""}
                onChange={(e) => updateAnnouncement("text", e.target.value)}
                placeholder="Save Up to 20% + Extra Combo OFF!"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#211b13]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#872B10]/20 focus:border-[#872B10]"
              />
              <p className="text-[11px] text-foreground/50 mt-1">
                Yeh text announcement bar ke beech mein golden prefix ke sath dikhega.
              </p>
            </div>

            {/* Optional Link */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#39160D] mb-1.5">
                Clickable Destination URL (Optional)
              </label>
              <input
                type="text"
                value={announcement.link || ""}
                onChange={(e) => updateAnnouncement("link", e.target.value)}
                placeholder="/collection"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#211b13]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#872B10]/20 focus:border-[#872B10]"
              />
              <p className="text-[11px] text-foreground/50 mt-1">
                Agar user announcement bar par click karega toh ye page open hoga (jaise /collection ya /product/...).
              </p>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#39160D] text-[#FFF7EB] hover:bg-[#872B10] text-xs font-bold uppercase tracking-tight transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                <span>{saving ? "Saving..." : "Save Announcement"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
