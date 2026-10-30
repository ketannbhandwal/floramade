import PageTransition from "@/components/ui/PageTransition";
import ProductCard from "@/components/product/ProductCard";
import Product from "@/models/Product";
import CollectionContent from "./CollectionContent";

export const dynamic = "force-dynamic";

async function getProducts(category) {
  const products = await Product.find({ category, isVisible: true }).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const categoryTitle = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${categoryTitle} Collection | Floramade`,
    description: `Explore our ${categoryTitle} collection of premium Ayurvedic products by Floramade. Natural formulations for wellness and health. 100% natural, lab-tested.`,
    keywords: [
      categoryTitle,
      "Floramade",
      "Ayurvedic products",
      "herbal supplements",
      "natural wellness",
      "Ayurvedic wellness Delhi",
      "Suresh Gaur",
      "Ayurvedic collection"
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `https://floramade.in/collections/${category}`,
      title: `${categoryTitle} Collection | Floramade`,
      description: `Explore our ${categoryTitle} collection of premium Ayurvedic products by Floramade.`,
      images: [
        {
          url: "/floramade-logo.png",
          width: 1200,
          height: 630,
          alt: `Floramade ${categoryTitle} Collection`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryTitle} Collection | Floramade`,
      description: `Explore our ${categoryTitle} collection of premium Ayurvedic products by Floramade.`,
      images: ["/floramade-logo.png"],
    },
    alternates: {
      canonical: `https://floramade.in/collections/${category}`,
    },
  };
}

export default async function CollectionPage({ params }) {
  const { category } = await params;
  const products = await getProducts(category);

  return (
    <PageTransition>
      <CollectionContent products={products} category={category} />
    </PageTransition>
  );
}
