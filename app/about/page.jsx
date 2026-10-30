import AboutContent from "./AboutContent";

export const metadata = {
  title: "About Suresh Gaur & Floramade | Authentic Ayurvedic Heritage",
  description: "Learn about Floramade Healthcare, founded by Suresh Gaur in Delhi, India. Discover our mission of bringing pure, lab-tested classical Ayurvedic formulations for blood sugar, vitality, and digestive wellness.",
  keywords: [
    "Suresh Gaur",
    "Suresh Gaur Floramade",
    "Floramade founder",
    "Ayurvedic wellness Delhi",
    "Floramade Healthcare Pvt Ltd",
    "Ayurvedic heritage India",
    "herbal formulations India",
    "Pancha Mahabhutas Ayurveda",
  ],
  alternates: {
    canonical: "https://floramade.in/about",
  },
  openGraph: {
    title: "About Suresh Gaur & Floramade | Authentic Ayurvedic Heritage",
    description: "Learn about Floramade Healthcare, founded by Suresh Gaur in Delhi, India. Pure, lab-tested classical Ayurvedic formulations.",
    url: "https://floramade.in/about",
    siteName: "Floramade",
    locale: "en_IN",
    type: "profile",
    images: [
      {
        url: "/assets/aboutus2.webp",
        width: 1200,
        height: 630,
        alt: "Suresh Gaur - Floramade Ayurvedic Heritage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Suresh Gaur & Floramade",
    description: "Learn about Floramade Healthcare, founded by Suresh Gaur in Delhi, India.",
    images: ["/assets/aboutus2.webp"],
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://floramade.in/about#webpage",
  "url": "https://floramade.in/about",
  "name": "About Floramade & Founder Suresh Gaur",
  "description": "Floramade is an authentic Ayurvedic wellness brand founded by Suresh Gaur in Delhi, India, bringing pure, lab-tested herbal remedies to modern living.",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://floramade.in/#website",
    "name": "Floramade",
    "url": "https://floramade.in"
  },
  "mainEntity": {
    "@type": "Person",
    "@id": "https://floramade.in/#founder",
    "name": "Suresh Gaur",
    "jobTitle": "Founder & Visionary",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://floramade.in/#organization",
      "name": "Floramade Healthcare Pvt. Ltd.",
      "url": "https://floramade.in"
    },
    "description": "Founder and Visionary of Floramade Healthcare Pvt. Ltd., dedicated to classical Ayurvedic formulations and botanical standardization.",
    "image": "https://floramade.in/assets/aboutus2.webp",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rohini Sector 21",
      "addressLocality": "New Delhi",
      "postalCode": "110086",
      "addressCountry": "IN"
    }
  }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutContent />
    </>
  );
}
