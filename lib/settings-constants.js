export const SETTINGS_ROW_ID = "00000000-0000-0000-0000-000000000002";

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
    bgColor: "#39160D",
    href: "/collection",
  },
  {
    id: "concern-2",
    title: "PSORIASIS CARE",
    image: "/concerns/psoriasis_care.png",
    bgColor: "#39160D",
    href: "/collection",
  },
  {
    id: "concern-3",
    title: "MIGRAINE CARE",
    image: "/concerns/migraine_care.png",
    bgColor: "#39160D",
    href: "/collection",
  },
  {
    id: "concern-4",
    title: "DIABETES CARE",
    image: "https://gcxfqnqewpfypocphmml.supabase.co/storage/v1/object/public/product-media/products/ad217c00-7725-4b8a-bc22-2b861a30e86f.png",
    bgColor: "#39160D",
    href: "/collection",
  },
  {
    id: "concern-5",
    title: "PILES CARE",
    image: "https://gcxfqnqewpfypocphmml.supabase.co/storage/v1/object/public/product-media/products/d5b03912-3dc3-44f5-9030-e75dcdd816bc.png",
    bgColor: "#39160D",
    href: "/collection",
  },
  {
    id: "concern-6",
    title: "DIGESTIVE CARE",
    image: "/concerns/paachan_transparent.png",
    bgColor: "#39160D",
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
    id: "nav-paachan-sathi",
    label: "Paachan Sathi",
    href: "/product/paachan-sathi-powder",
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
      {
        id: "madhu-2",
        label: "MadhuCurex Powder",
        badge: "Kadha Blend",
        description: "15-Herb traditional formulation for sugar control",
        href: "/product/madhucurex-powder",
      },
      {
        id: "madhu-3",
        label: "MadhuCurex Capsules",
        badge: "Daily Care",
        description: "Daily dose with Gudmar, Neem & Karela extracts",
        href: "/product/madhucurex-capsules",
      },
    ],
  },
  {
    id: "nav-all-products",
    label: "All Products",
    href: "/collection",
    type: "link",
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
];

export const DEFAULT_TESTIMONIALS_PRETITLE = "KIND WORDS FROM OUR COMMUNITY";
export const DEFAULT_TESTIMONIALS_TITLE = "Wellness stories, shared.";
export const DEFAULT_TESTIMONIALS_SUBTITLE = "Real experiences from people who made Floramade a part of their daily wellness journey.";

export const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: "Mr. Amit Patel",
    role: "Verified Customer",
    location: "Ahmedabad",
    rating: 5,
    tag: "PILES RELIEF",
    text: "Pilecurex powder se 1 week me hi jalan aur pain me rahat mil gayi. Surgery se darr lag raha tha par is natural formula ne kamaal ka kaam kiya. Thank you Floramade!",
    img: "/review/5.jpeg",
    initials: "AP",
  },
  {
    id: 2,
    name: "Mr. Shivansh",
    role: "Verified Customer",
    location: "Delhi",
    rating: 5,
    tag: "OVERALL HEALTH",
    text: "Maine 4 months se Floramade products use kiye hain aur results bahut impressive hain. Mera overall health improve ho gaya hai aur energy level bhi stable hai. Natural formulation pe completely trust karta hoon.",
    img: "/review/16.jpeg",
    initials: "S",
  },
  {
    id: 3,
    name: "Mr. Vijay Kumar",
    role: "Verified Customer",
    location: "Jaipur",
    rating: 5,
    tag: "DIGESTION",
    text: "Excellent products hain. Maine 2 months se use kar raha hoon aur digestion mein bahut improvement dekha. Pure ingredients hain aur koi side effects nahi. Highly recommend karta hoon.",
    img: "/review/1.jpeg",
    initials: "VK",
  },
  {
    id: 4,
    name: "Mrs. Badama Devi",
    role: "Verified Customer",
    location: "Haryana",
    rating: 5,
    tag: "SUGAR BALANCE",
    text: "Bahut acche results mile hain. Sugar control ke liye best hai. Doctor ne bhi recommend kiya tha. Regular use karne se bahut fayda hua hai. Quality outstanding hai.",
    img: "/review/2.jpeg",
    initials: "BD",
  },
  {
    id: 5,
    name: "Mr. Rajneesh",
    role: "Verified Customer",
    location: "Lucknow",
    rating: 5,
    tag: "GUT HEALTH",
    text: "Digestion ke liye excellent hai. Ab bloating nahi hoti! Digestive issues se years se struggle kar raha tha, aur ye products lifesaver nikle. Har meal ke baad lighter aur comfortable feel karta hoon.",
    img: "/review/4.jpeg",
    initials: "R",
  },
  {
    id: 6,
    name: "Mr. Birender Kumar",
    role: "Verified Customer",
    location: "Punjab",
    rating: 5,
    tag: "METABOLISM",
    text: "Main 3 months se Floramade products use kar raha hoon aur mera blood sugar level bahut improve ho gaya hai. Natural ingredients hain toh mind bhi peaceful rehta hai, aur ab mid-day mein energy crash nahi hota.",
    img: "/review/15.jpeg",
    initials: "BK",
  },
  {
    id: 7,
    name: "Mr. Jamuna Bhardwaj",
    role: "Verified Customer",
    location: "Chandigarh",
    rating: 5,
    tag: "VITALITY",
    text: "2 weeks ke baad results bahut acche mil rahe hain. Mere sugar cravings kam ho gaye hain aur poora din energetic feel karta hoon. Products use karne mein easy hain aur koi bad taste nahi hai.",
    img: "/review/14.jpeg",
    initials: "JB",
  },
  {
    id: 8,
    name: "Mrs. Sunita Sharma",
    role: "Verified Customer",
    location: "Indore",
    rating: 5,
    tag: "SUGAR CONTROL",
    text: "MadhuCurex powder use karne ke baad fasting sugar readings me constant stability aayi hai. Ayurvedic jadibootiyan bilkul authentic hain aur packaging bhi premium hai. Bahut satisfied hoon.",
    img: "/review/3.jpeg",
    initials: "SS",
  },
];
