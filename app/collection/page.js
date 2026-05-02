import PageTransition from "@/components/ui/PageTransition";
import CollectionContent from "./CollectionContent";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { Metadata } from "next";
import { unstable_cache } from 'next/cache';

const getAllProductsCached = unstable_cache(
  async () => {
    await connectDB();
    return await Product.find({ isVisible: true }).lean();
  },
  ['all-products'],
  { revalidate: 3600, tags: ['products'] }
);

async function getAllProducts() {
  const products = await getAllProductsCached();
  return JSON.parse(JSON.stringify(products));
}

export async function generateMetadata() {
  return {
    title: "Our Collection | Fiveetatv",
    description: "Explore our complete collection of premium Ayurvedic products by Fiveetatv. Natural formulations for wellness and health. 100% natural, lab-tested.",
    keywords: [
      "Ayurvedic products",
      "herbal supplements",
      "natural wellness",
      "diabetes care",
      "digestive health",
      "Fiveetatv collection"
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://fiveetatv.com/collection",
      title: "Our Collection | Fiveetatv",
      description: "Explore our complete collection of premium Ayurvedic products by Fiveetatv.",
      images: [
        {
          url: "/assets/logo.png",
          width: 1200,
          height: 630,
          alt: "Fiveetatv Collection",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Our Collection | Fiveetatv",
      description: "Explore our complete collection of premium Ayurvedic products by Fiveetatv.",
      images: ["/assets/logo.png"],
    },
    alternates: {
      canonical: "https://fiveetatv.com/collection",
    },
  };
}

export default async function CollectionPage() {
  const products = await getAllProducts();

  return (
    <PageTransition>
      <CollectionContent products={products} />
    </PageTransition>
  );
}