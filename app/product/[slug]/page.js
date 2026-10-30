import { notFound } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";
import ProductDetails from "@/components/product/ProductDetails";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

async function getProduct(slug) {
  let normalizedSlug = slug;
  try {
    normalizedSlug = decodeURIComponent(slug);
  } catch {
    // Keep the original value if the segment contains a malformed escape.
  }

  let product = await Product.findOne({ slug: normalizedSlug }).lean();
  if (!product) {
    const slugified = normalizedSlug.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    product = await Product.findOne({ slug: slugified }).lean();
  }
  if (!product) return null;

  // Older catalog rows store their gallery under `featureImages` rather than
  // `images`; ProductDetails and its metadata use `images` as the gallery.
  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : Array.isArray(product.featureImages)
      ? product.featureImages
      : product.formulaimage
        ? [product.formulaimage]
        : [];

  return JSON.parse(JSON.stringify({ ...product, images }));
}

async function getRelated(currentSlug) {
  const products = await Product.find({ slug: { $ne: currentSlug }, isVisible: true }).limit(4).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: "Product Not Found | Floramade",
    };
  }

  return {
    title: `${product.name} | Floramade`,
    description: `${product.description} - Natural Ayurvedic product by Floramade. ${product.benefits?.join(', ')}. 100% natural, lab-tested formulation.`,
    keywords: [
      product.name,
      "Floramade",
      "Ayurvedic products",
      "herbal supplements",
      "natural wellness",
      product.category || "Ayurvedic medicine",
      "Ayurvedic wellness Delhi",
      "Suresh Gaur",
      ...product.ingredients || [],
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `https://floramade.in/product/${slug}`,
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
      canonical: `https://floramade.in/product/${slug}`,
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
