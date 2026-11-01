import HomeSections from "@/components/home/HomeSections";
import PageTransition from "@/components/ui/PageTransition";
import Product from "@/models/Product";
import { getSiteSettings } from "@/lib/settings";
import { sortProducts } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Floramade | Premium Ayurvedic Wellness Products in Delhi, India",
  description: "Floramade - Premium Ayurvedic wellness brand founded by Suraj Gaur in Delhi, India. Shop natural Ayurvedic products for sugar balance, digestive health, and overall wellness. 100% natural, lab-tested formulations.",
  keywords: [
    "Floramade",
    "Ayurvedic products",
    "Ayurveda India",
    "herbal supplements",
    "natural wellness",
    "Ayurvedic medicine",
    "sugar balance",
    "digestive health",
    "Ayurvedic wellness Delhi",
    "Suraj Gaur",
    "traditional Ayurveda",
    "herbal remedies",
    "Ayurvedic formulations",
    "natural health products",
    "Ayurvedic store",
    "herbal medicine India",
    "Ayurvedic supplements",
    "wellness products"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://floramade.in",
    title: "Floramade | Premium Ayurvedic Wellness Products",
    description: "Premium Ayurvedic wellness brand founded by Suraj Gaur. Natural products for sugar balance, digestive health, and overall wellness.",
    images: [
      {
        url: "/floramade-logo.png",
        width: 1200,
        height: 630,
        alt: "Floramade - Premium Ayurvedic Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Floramade | Premium Ayurvedic Wellness Products",
    description: "Premium Ayurvedic wellness brand founded by Suraj Gaur. Natural products for sugar balance, digestive health, and overall wellness.",
    images: ["/floramade-logo.png"],
  },
};

async function getProducts() {
  const products = await Product.find({ isVisible: true }).lean();
  const sortedProducts = sortProducts(products);
  return JSON.parse(JSON.stringify(sortedProducts));
}

export default async function Home() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSiteSettings(),
  ]);

  return (
    <PageTransition>
      <HomeSections 
        products={products}
        banners={settings?.banners}
        concerns={settings?.concerns}
        productHeading={settings?.productHeading}
        productSubheading={settings?.productSubheading}
        benefitsHeading={settings?.benefitsHeading}
        benefits={settings?.benefits}
        testimonialsPretitle={settings?.testimonialsPretitle}
        testimonialsTitle={settings?.testimonialsTitle}
        testimonialsSubtitle={settings?.testimonialsSubtitle}
        testimonials={settings?.testimonials}
        spotlightProductId={settings?.spotlightProductId}
      />
    </PageTransition>
  );
}
