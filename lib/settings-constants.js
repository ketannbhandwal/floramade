export const SETTINGS_ROW_ID = "00000000-0000-0000-0000-000000000002";

export const DEFAULT_ANNOUNCEMENT = {
  enabled: true,
  emoji: "🎉",
  highlight: "Festive Offer:",
  text: "Save Up to 20% + Extra Combo OFF!",
  link: "/collection",
};

export const DEFAULT_PRODUCT_HEADING = "Featured Best Products";
export const DEFAULT_PRODUCT_SUBHEADING = "Browse complete range of 100% organic & approved products.";

export const DEFAULT_BANNERS = [
  { 
    id: "banner-1",
    desktop: "/posters/1.jpg", 
    mobile: "/posters/mobile1.jpg", 
    alt: "Floramade Ayurvedic wellness - Natural Health Solutions",
    href: "/collection"
  },
  { 
    id: "banner-2",
    desktop: "/posters/2.jpg", 
    mobile: "/posters/mobile2.jpg", 
    alt: "Floramade Paachan Sathi Powder - Most Effective Ayurvedic Digestive Solution",
    href: "/collection"
  },
  { 
    id: "banner-3",
    desktop: "/posters/3.jpg", 
    mobile: "/posters/mobile3.jpg", 
    alt: "Floramade MadhuCurex - Sugar Control & Metabolism Support",
    href: "/collection"
  },
  { 
    id: "banner-4",
    desktop: "/posters/4.jpg", 
    mobile: "/posters/mobile4.jpg", 
    alt: "Floramade Ayurvedic Products - 100% Pure Botanical Formulations",
    href: "/collection"
  },
];

export const DEFAULT_CONCERNS = [
  {
    id: "concern-1",
    title: "LIVER CARE",
    image: "/concerns/liver_detox.png",
    bgColor: "#126768",
    href: "/collection",
  },
  {
    id: "concern-2",
    title: "PSORIASIS CARE",
    image: "/concerns/psoriasis_care.png",
    bgColor: "#126768",
    href: "/collection",
  },
  {
    id: "concern-3",
    title: "MIGRAINE CARE",
    image: "/concerns/migraine_care.png",
    bgColor: "#126768",
    href: "/collection",
  },
  {
    id: "concern-4",
    title: "DIABETES CARE",
    image: "https://gcxfqnqewpfypocphmml.supabase.co/storage/v1/object/public/product-media/products/ad217c00-7725-4b8a-bc22-2b861a30e86f.png",
    bgColor: "#126768",
    href: "/collection",
  },
  {
    id: "concern-5",
    title: "PILES CARE",
    image: "https://gcxfqnqewpfypocphmml.supabase.co/storage/v1/object/public/product-media/products/d5b03912-3dc3-44f5-9030-e75dcdd816bc.png",
    bgColor: "#126768",
    href: "/collection",
  },
  {
    id: "concern-6",
    title: "DIGESTIVE CARE",
    image: "/concerns/paachan_transparent.png",
    bgColor: "#126768",
    href: "/collection",
  },
];

export const DEFAULT_BENEFITS_HEADING = "Benefits";

export const DEFAULT_BENEFITS = [
  {
    id: 1,
    title: "Natural Healing",
    description:
      "Floramade focuses on using natural, plant-based ingredients providing a holistic approach to health without harmful chemicals or synthetic additives.",
    icon: "natural",
  },
  {
    id: 2,
    title: "Customized Solutions",
    description:
      "Our products, such as for diabetes relief or liver detox, target specific health concerns with tailored Ayurvedic remedies for long-term results.",
    icon: "solutions",
  },
  {
    id: 3,
    title: "Long-Lasting Wellness",
    description:
      "Ayurvedic products promote long-term health by addressing root causes, not just symptoms, ensuring sustainable vitality and wellness.",
    icon: "wellness",
  },
  {
    id: 4,
    title: "Holistic Health",
    description:
      "Following Ayurveda principles, Floramade supports mind, body and spirit to promote balance, harmony, and complete well-being.",
    icon: "holistic",
  },
];

export const DEFAULT_NAV_LINKS = [
  {
    id: "nav-home",
    label: "Home",
    href: "/",
    type: "link",
  },
  {
    id: "nav-madhucurex",
    label: "MadhuCurex",
    href: "/product/madhucurex-diabetes-pro",
    type: "dropdown",
    subHeading: "Ayurvedic Sugar & Vitality Support",
    subLinks: [
      {
        id: "madhu-1",
        label: "MadhuCurex Diabetes Pro",
        badge: "Best Seller",
        description: "Advanced Ayurvedic formulation for blood sugar & vitality",
        href: "/product/madhucurex-diabetes-pro",
      },
    ],
  },
  {
    id: "nav-about",
    label: "About Us",
    href: "/about",
    type: "link",
  },
  {
    id: "nav-contact",
    label: "Contact Us",
    href: "/contact",
    type: "link",
  },
  {
    id: "nav-policy",
    label: "Policy",
    href: "/policy",
    type: "dropdown",
    subHeading: "Store Policies & Guidelines",
    subLinks: [
      {
        id: "sub-terms",
        label: "Terms & Conditions",
        badge: "",
        description: "Guidelines and legal terms",
        href: "/terms",
      },
      {
        id: "sub-privacy",
        label: "Privacy Policy",
        badge: "",
        description: "Data protection and privacy",
        href: "/privacy-policy",
      },
      {
        id: "sub-refund",
        label: "Refund Policy",
        badge: "",
        description: "Transparent return and refund terms",
        href: "/refund-policy",
      },
      {
        id: "sub-shipping",
        label: "Shipping Policy",
        badge: "",
        description: "Pan-India delivery guidelines",
        href: "/shipping-policy",
      },
    ],
  },
];

export const DEFAULT_TESTIMONIALS_PRETITLE = "REAL STORIES & REVIEWS";
export const DEFAULT_TESTIMONIALS_TITLE = "What Our Customers Are Saying";
export const DEFAULT_TESTIMONIALS_SUBTITLE = "Customer satisfaction is our #1 priority";

export const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: "Vishal Khanna",
    role: "Verified Customer",
    location: "Delhi, India",
    rating: 5,
    tag: "ENERGY & VITALITY",
    text: "I've been using Floramade Ashwagandha Tablets for about six months now, and I must say, it's been a game-changer for me. As someone who juggles a demanding job, family responsibilities, and a desire for overall well-being, finding a natural solution that addresses various aspects of health was crucial for me.",
    img: "/review/16.jpeg",
    initials: "VK",
  },
  {
    id: 2,
    name: "Sameer Kumar",
    role: "Verified Customer",
    location: "Jaipur, India",
    rating: 5,
    tag: "SUGAR & METABOLISM",
    text: "One of the standout benefits for me has been the steady balance in daily energy and blood sugar levels. The adaptogenic properties of natural herbs are evident in their ability to combat both physical and mental exhaustion without any jitters or crashes associated with other supplements.",
    img: "/review/1.jpeg",
    initials: "SK",
  },
  {
    id: 3,
    name: "Nishant Verma",
    role: "Verified Customer",
    location: "Lucknow, India",
    rating: 5,
    tag: "DIGESTIVE HEALTH",
    text: "I can confidently say that they've had a positive impact on my overall health and well-being. As someone who values natural solutions, the blend of ingredients in these tablets caught my attention, and the results have been truly impressive.",
    img: "/review/4.jpeg",
    initials: "NV",
  },
  {
    id: 4,
    name: "Mrs. Sunita Sharma",
    role: "Verified Customer",
    location: "Indore, India",
    rating: 5,
    tag: "SUGAR CONTROL",
    text: "MadhuCurex powder use karne ke baad fasting sugar readings me constant stability aayi hai. Ayurvedic jadibootiyan bilkul authentic hain aur packaging bhi premium hai. Bahut satisfied hoon.",
    img: "/review/3.jpeg",
    initials: "SS",
  },
  {
    id: 5,
    name: "Mr. Amit Patel",
    role: "Verified Customer",
    location: "Ahmedabad, India",
    rating: 5,
    tag: "PILES RELIEF",
    text: "Pilecurex powder se 1 week me hi jalan aur pain me rahat mil gayi. Surgery se darr lag raha tha par is natural formula ne kamaal ka kaam kiya. Thank you Floramade!",
    img: "/review/5.jpeg",
    initials: "AP",
  },
  {
    id: 6,
    name: "Mrs. Badama Devi",
    role: "Verified Customer",
    location: "Haryana, India",
    rating: 5,
    tag: "SUGAR BALANCE",
    text: "Bahut acche results mile hain. Sugar control ke liye best hai. Doctor ne bhi recommend kiya tha. Regular use karne se bahut fayda hua hai. Quality outstanding hai.",
    img: "/review/2.jpeg",
    initials: "BD",
  },
  {
    id: 7,
    name: "Mr. Birender Kumar",
    role: "Verified Customer",
    location: "Punjab, India",
    rating: 5,
    tag: "METABOLISM",
    text: "Main 3 months se Floramade products use kar raha hoon aur mera blood sugar level bahut improve ho gaya hai. Natural ingredients hain toh mind bhi peaceful rehta hai, aur ab mid-day mein energy crash nahi hota.",
    img: "/review/15.jpeg",
    initials: "BK",
  },
  {
    id: 8,
    name: "Mr. Jamuna Bhardwaj",
    role: "Verified Customer",
    location: "Chandigarh, India",
    rating: 5,
    tag: "VITALITY",
    text: "2 weeks ke baad results bahut acche mil rahe hain. Mere sugar cravings kam ho gaye hain aur poora din energetic feel karta hoon. Products use karne mein easy hain aur koi bad taste nahi hai.",
    img: "/review/14.jpeg",
    initials: "JB",
  },
];

export const DEFAULT_COUPONS = [
  {
    id: "coupon-1",
    code: "FLAT05",
    discountType: "percentage",
    discountValue: 5,
    minOrderAmount: 0,
    badge: "FIRST ORDER",
    title: "Flat 5% OFF",
    description: "Get flat 5% OFF on your first order. Applicable on all products.",
    showOnProductPage: true,
    isActive: true,
  },
  {
    id: "coupon-2",
    code: "FLAT10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 3000,
    badge: "BEST VALUE",
    title: "Flat 10% OFF",
    description: "Get flat 10% OFF on orders above ₹3,000. Applicable on all products.",
    showOnProductPage: true,
    isActive: true,
  },
];
