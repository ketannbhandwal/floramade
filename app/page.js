import HomeSections from "@/components/home/HomeSections";
import PageTransition from "@/components/ui/PageTransition";
import Product from "@/models/Product";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Floramade | Premium Ayurvedic Wellness Products in Delhi, India",
  description: "Floramade - Premium Ayurvedic wellness brand founded by Suresh Gaur in Delhi, India. Shop natural Ayurvedic products for sugar balance, digestive health, and overall wellness. 100% natural, lab-tested formulations.",
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
    "Suresh Gaur",
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
    description: "Premium Ayurvedic wellness brand founded by Suresh Gaur. Natural products for sugar balance, digestive health, and overall wellness.",
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
    description: "Premium Ayurvedic wellness brand founded by Suresh Gaur. Natural products for sugar balance, digestive health, and overall wellness.",
    images: ["/floramade-logo.png"],
  },
};

async function getProducts() {
  const products = await Product.find({ isVisible: true }).lean();
  
  // Reorder products to put MadhuCurex Capsules at the end
  const capsuleProduct = products.find(p => p.name.includes("MadhuCurex Capsules"));
  const otherProducts = products.filter(p => !p.name.includes("MadhuCurex Capsules"));
  const sortedProducts = capsuleProduct ? [...otherProducts, capsuleProduct] : products;
  
  const result = JSON.parse(JSON.stringify(sortedProducts));
  return result;
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
