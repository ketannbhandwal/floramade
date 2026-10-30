import Product from "@/models/Product";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = "https://floramade.in";
  
  // All public accessible static routes
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let productPages = [];
  let categoryPages = [];

  try {
    const products = await Product.find({ isVisible: true }).lean();
    
    // Extract unique categories safely
    const categoriesSet = new Set();
    products.forEach((p) => {
      if (p.category && typeof p.category === "string") {
        const cat = p.category.trim();
        if (cat) categoriesSet.add(cat);
      }
    });

    categoryPages = Array.from(categoriesSet).map((category) => {
      const catSlug = encodeURIComponent(category.toLowerCase().replace(/[\s_]+/g, "-"));
      return {
        url: `${baseUrl}/collections/${catSlug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.85,
      };
    });

    productPages = products
      .filter((p) => p.slug && typeof p.slug === "string")
      .map((product) => {
        const safeSlug = encodeURIComponent(product.slug.trim());
        const updatedAtDate = product.updatedAt ? new Date(product.updatedAt) : new Date();
        const validDate = isNaN(updatedAtDate.getTime()) ? new Date() : updatedAtDate;
        
        return {
          url: `${baseUrl}/product/${safeSlug}`,
          lastModified: validDate,
          changeFrequency: "weekly",
          priority: 0.85,
        };
      });
  } catch (err) {
    console.error("Error generating dynamic sitemap records:", err);
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
