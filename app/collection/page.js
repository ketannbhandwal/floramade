import PageTransition from "@/components/ui/PageTransition";
import CollectionContent from "./CollectionContent";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

async function getAllProducts() {
  const products = await Product.find({ isVisible: true }).lean();
  
  // Reorder products to put MadhuCurex Capsules at the end
  const capsuleProduct = products.find(p => p.name.includes("MadhuCurex Capsules"));
  const otherProducts = products.filter(p => !p.name.includes("MadhuCurex Capsules"));
  const sortedProducts = capsuleProduct ? [...otherProducts, capsuleProduct] : products;
  
  return JSON.parse(JSON.stringify(sortedProducts));
}

export async function generateMetadata() {
  return {
    title: "Our Collection | Floramade",
    description: "Explore our complete collection of premium Ayurvedic products by Floramade. Natural formulations for wellness and health. 100% natural, lab-tested.",
    keywords: [
      "Ayurvedic products",
      "herbal supplements",
      "natural wellness",
      "diabetes care",
      "digestive health",
      "Floramade collection"
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://floramade.in/collection",
      title: "Our Collection | Floramade",
      description: "Explore our complete collection of premium Ayurvedic products by Floramade.",
      images: [
        {
          url: "/floramade-logo.png",
          width: 1200,
          height: 630,
          alt: "Floramade Collection",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Our Collection | Floramade",
      description: "Explore our complete collection of premium Ayurvedic products by Floramade.",
      images: ["/floramade-logo.png"],
    },
    alternates: {
      canonical: "https://floramade.in/collection",
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