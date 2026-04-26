import HomeSections from "@/components/home/HomeSections";
import PageTransition from "@/components/ui/PageTransition";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { seedProductsIfEmpty } from "@/lib/seed";

export const metadata = {
  title: "Fiveetatv | Premium Ayurvedic Wellness Products in Delhi, India",
  description: "Fiveetatv - Premium Ayurvedic wellness brand founded by Rahul Gour & Suraj Gaur in Delhi, India. Shop natural Ayurvedic products for sugar balance, digestive health, and overall wellness. 100% natural, lab-tested formulations.",
  keywords: [
    "Fiveetatv",
    "Ayurvedic products",
    "Ayurveda India",
    "herbal supplements",
    "natural wellness",
    "Ayurvedic medicine",
    "sugar balance",
    "digestive health",
    "Ayurvedic wellness Delhi",
    "Rahul Gour",
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
    url: "https://fiveetatv.com",
    title: "Fiveetatv | Premium Ayurvedic Wellness Products",
    description: "Premium Ayurvedic wellness brand founded by Rahul Gour & Suraj Gaur. Natural products for sugar balance, digestive health, and overall wellness.",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Fiveetatv - Premium Ayurvedic Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiveetatv | Premium Ayurvedic Wellness Products",
    description: "Premium Ayurvedic wellness brand founded by Rahul Gour & Suraj Gaur. Natural products for sugar balance, digestive health, and overall wellness.",
    images: ["/assets/logo.png"],
  },
};

async function getProducts() {
  await connectDB();
  await seedProductsIfEmpty();
  const products = await Product.find({ isVisible: true }).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function Home() {
  const products = await getProducts();
  return (
    <PageTransition>
      <HomeSections products={products} />
    </PageTransition>
  );
}
