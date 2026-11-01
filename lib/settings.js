import { getSupabaseAdmin } from "@/lib/supabase";
import { 
  SETTINGS_ROW_ID, 
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
  DEFAULT_SHOW_OFFERS_SECTION,
  DEFAULT_COUPONS,
} from "./settings-constants";

export { 
  SETTINGS_ROW_ID, 
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
  DEFAULT_SHOW_OFFERS_SECTION,
  DEFAULT_COUPONS,
};

export async function getSiteSettings() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("inquiries")
      .select("data")
      .eq("id", SETTINGS_ROW_ID)
      .single();

    if (!error && data?.data) {
      return {
        announcement: data.data.announcement || DEFAULT_ANNOUNCEMENT,
        banners: Array.isArray(data.data.banners) && data.data.banners.length > 0
          ? data.data.banners
          : DEFAULT_BANNERS,
        concerns: Array.isArray(data.data.concerns) && data.data.concerns.length > 0
          ? data.data.concerns
          : DEFAULT_CONCERNS,
        productHeading: data.data.productHeading || DEFAULT_PRODUCT_HEADING,
        productSubheading: data.data.productSubheading || DEFAULT_PRODUCT_SUBHEADING,
        benefitsHeading: data.data.benefitsHeading || DEFAULT_BENEFITS_HEADING,
        benefits: Array.isArray(data.data.benefits) && data.data.benefits.length > 0
          ? data.data.benefits
          : DEFAULT_BENEFITS,
        navLinks: Array.isArray(data.data.navLinks) && data.data.navLinks.length > 0
          ? data.data.navLinks
          : DEFAULT_NAV_LINKS,
        testimonialsPretitle: data.data.testimonialsPretitle || DEFAULT_TESTIMONIALS_PRETITLE,
        testimonialsTitle: data.data.testimonialsTitle || DEFAULT_TESTIMONIALS_TITLE,
        testimonialsSubtitle: data.data.testimonialsSubtitle || DEFAULT_TESTIMONIALS_SUBTITLE,
        testimonials: Array.isArray(data.data.testimonials) && data.data.testimonials.length > 0
          ? data.data.testimonials
          : DEFAULT_TESTIMONIALS,
        showOffersSection: typeof data.data.showOffersSection === "boolean" ? data.data.showOffersSection : DEFAULT_SHOW_OFFERS_SECTION,
        coupons: Array.isArray(data.data.coupons) ? data.data.coupons : DEFAULT_COUPONS,
        spotlightProductId: data.data.spotlightProductId || "",
      };
    }
  } catch (err) {
    console.error("Error fetching site settings from Supabase:", err);
  }

  return {
    announcement: DEFAULT_ANNOUNCEMENT,
    banners: DEFAULT_BANNERS,
    concerns: DEFAULT_CONCERNS,
    productHeading: DEFAULT_PRODUCT_HEADING,
    productSubheading: DEFAULT_PRODUCT_SUBHEADING,
    benefitsHeading: DEFAULT_BENEFITS_HEADING,
    benefits: DEFAULT_BENEFITS,
    navLinks: DEFAULT_NAV_LINKS,
    testimonialsPretitle: DEFAULT_TESTIMONIALS_PRETITLE,
    testimonialsTitle: DEFAULT_TESTIMONIALS_TITLE,
    testimonialsSubtitle: DEFAULT_TESTIMONIALS_SUBTITLE,
    testimonials: DEFAULT_TESTIMONIALS,
    showOffersSection: DEFAULT_SHOW_OFFERS_SECTION,
    coupons: DEFAULT_COUPONS,
    spotlightProductId: "",
  };
}

export async function saveSiteSettings({ 
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
  spotlightProductId,
  showOffersSection,
  coupons,
}) {
  const payload = {
    announcement: announcement || DEFAULT_ANNOUNCEMENT,
    banners: banners || DEFAULT_BANNERS,
    concerns: concerns || DEFAULT_CONCERNS,
    productHeading: productHeading || DEFAULT_PRODUCT_HEADING,
    productSubheading: productSubheading || DEFAULT_PRODUCT_SUBHEADING,
    benefitsHeading: benefitsHeading || DEFAULT_BENEFITS_HEADING,
    benefits: benefits || DEFAULT_BENEFITS,
    navLinks: navLinks || DEFAULT_NAV_LINKS,
    testimonialsPretitle: testimonialsPretitle || DEFAULT_TESTIMONIALS_PRETITLE,
    testimonialsTitle: testimonialsTitle || DEFAULT_TESTIMONIALS_TITLE,
    testimonialsSubtitle: testimonialsSubtitle || DEFAULT_TESTIMONIALS_SUBTITLE,
    testimonials: testimonials || DEFAULT_TESTIMONIALS,
    showOffersSection: typeof showOffersSection === "boolean" ? showOffersSection : true,
    coupons: Array.isArray(coupons) ? coupons : [],
    spotlightProductId: spotlightProductId || "",
  };

  const row = {
    id: SETTINGS_ROW_ID,
    status: "resolved",
    data: payload,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await getSupabaseAdmin()
    .from("inquiries")
    .upsert(row)
    .select("data")
    .single();

  if (error) {
    throw error;
  }

  return data.data;
}
