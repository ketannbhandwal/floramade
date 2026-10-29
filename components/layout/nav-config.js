export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "All Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const PRODUCT_CATEGORIES = [
  {
    label: "Diabetes Care",
    hasDropdown: true,
    href: "/collections/diabetes",
    subLinks: [
      {
        label: "MadhuCurex Powder",
        description: "15-Herb Ayurvedic Blend for Sugar Control",
        href: "/product/madhucurex-powder"
      },
      {
        label: "MadhuCurex Capsules",
        description: "Advanced Glucose & Insulin Sensitivity Support",
        href: "/product/madhucurex-capsules"
      }
    ]
  },
  {
    label: "Digestive Health",
    hasDropdown: false,
    href: "/product/paachan-sathi-powder",
    description: "Instant relief for gastric & digestive wellness"
  }
];

export const SEARCH_PAGES = [
  { href: "/collection", title: "All Products", description: "Explore the entire Floramade Ayurvedic range." },
  { href: "/about", title: "About Floramade", description: "Brand philosophy, founder, and our wellness mission." },
  { href: "/contact", title: "Contact", description: "Support, wholesale, and order help." },
  { href: "/privacy-policy", title: "Privacy Policy", description: "How we protect user data." },
  { href: "/terms", title: "Terms & Conditions", description: "Order and platform terms." },
  { href: "/refund-policy", title: "Refund Policy", description: "Return and refund process." },
  { href: "/shipping-policy", title: "Shipping Policy", description: "Delivery windows and fees." },
  { href: "/account", title: "My Account", description: "Profile, orders, and settings." },
  { href: "/cart", title: "Cart", description: "Review items before checkout." },
];
