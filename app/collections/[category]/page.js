import PageTransition from "@/components/ui/PageTransition";
import ProductCard from "@/components/product/ProductCard";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import CollectionContent from "./CollectionContent";
import { Metadata } from "next";
import { unstable_cache } from 'next/cache';

const getProductsCached = unstable_cache(
  async (category) => {
    await connectDB();
    return await Product.find({ category, isVisible: true }).lean();
  },
  ['collection-products'],
  { revalidate: 3600, tags: ['products'] }
);

async function getProducts(category) {
  const products = await getProductsCached(category);
  return JSON.parse(JSON.stringify(products));
}

export async function generateMetadata({ params }) {
  const { category } = params;
  const categoryTitle = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${categoryTitle} Collection | Fiveetatv`,
    description: `Explore our ${categoryTitle} collection of premium Ayurvedic products by Fiveetatv. Natural formulations for wellness and health. 100% natural, lab-tested.`,
    keywords: [
      categoryTitle,
      "Fiveetatv",
      "Ayurvedic products",
      "herbal supplements",
      "natural wellness",
      "Ayurvedic wellness Delhi",
      "Rahul Gour",
      "Suraj Gaur",
      "Ayurvedic collection"
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `https://fiveetatv.com/collections/${category}`,
      title: `${categoryTitle} Collection | Fiveetatv`,
      description: `Explore our ${categoryTitle} collection of premium Ayurvedic products by Fiveetatv.`,
      images: [
        {
          url: "/assets/logo.png",
          width: 1200,
          height: 630,
          alt: `Fiveetatv ${categoryTitle} Collection`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryTitle} Collection | Fiveetatv`,
      description: `Explore our ${categoryTitle} collection of premium Ayurvedic products by Fiveetatv.`,
      images: ["/assets/logo.png"],
    },
    alternates: {
      canonical: `https://fiveetatv.com/collections/${category}`,
    },
  };
}

export default async function CollectionPage({ params }) {
  const { category } = params;
  const products = await getProducts(category);

  return (
    <PageTransition>
      <CollectionContent products={products} category={category} />
    </PageTransition>
  );
}
