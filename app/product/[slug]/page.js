import { notFound } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";
import ProductDetails from "@/components/product/ProductDetails";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { unstable_cache } from 'next/cache';

const getProductCached = unstable_cache(
  async (slug) => {
    await connectDB();
    return await Product.findOne({ slug, isVisible: true }).lean();
  },
  ['product-detail-v2'],
  { revalidate: 3600, tags: ['products'] }
);

async function getProduct(slug) {
  const product = await getProductCached(slug);
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

const getRelatedCached = unstable_cache(
  async (currentSlug) => {
    return await Product.find({ slug: { $ne: currentSlug }, isVisible: true }).limit(2).lean();
  },
  ['related-products'],
  { revalidate: 3600, tags: ['products'] }
);

async function getRelated(currentSlug) {
  const products = await getRelatedCached(currentSlug);
  return JSON.parse(JSON.stringify(products));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: "Product Not Found | Fiveetatva",
    };
  }

  return {
    title: `${product.name} | Fiveetatva`,
    description: `${product.description} - Natural Ayurvedic product by Fiveetatva. ${product.benefits?.join(', ')}. 100% natural, lab-tested formulation.`,
    keywords: [
      product.name,
      "Fiveetatva",
      "Ayurvedic products",
      "herbal supplements",
      "natural wellness",
      product.category || "Ayurvedic medicine",
      "Ayurvedic wellness Delhi",
      "Rahul Gour",
      "Suraj Gaur",
      ...product.ingredients || [],
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `https://fiveetatva.com/product/${slug}`,
      title: product.name,
      description: product.description,
      images: product.images?.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: product.name,
      })) || [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images || [],
    },
    alternates: {
      canonical: `https://fiveetatva.com/product/${slug}`,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelated(product.slug);

  return (
    <PageTransition>
      <ProductDetails product={product} relatedProducts={related} />
    </PageTransition>
  );
}
