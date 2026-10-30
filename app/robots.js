export default function robots() {
  const baseUrl = "https://floramade.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/cart",
          "/checkout",
          "/account",
          "/account/*",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/wishlist",
          "/search",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
