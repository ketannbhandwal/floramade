import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/ui/Providers";
import CookieConsent from "@/components/ui/CookieConsent";
import LenisProvider from "@/components/ui/LenisProvider";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Fiveetatva",
  "url": "https://fiveetatva.com",
  "logo": "https://fiveetatva.com/assets/logo.png",
  "description": "Fiveetatva - Premium Ayurvedic wellness brand founded by Rahul Gour & Suraj Gaur in Delhi, India. Natural Ayurvedic products for sugar balance, digestive health, and overall wellness.",
  "founders": [
    {
      "@type": "Person",
      "name": "Rahul Gour"
    },
    {
      "@type": "Person",
      "name": "Suraj Gaur"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Delhi",
    "addressCountry": "India"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "fiveetatv@gmail.com",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://www.instagram.com/fiveetatva",
    "https://www.facebook.com/fiveetatva",
    "https://twitter.com/fiveetatva"
  ]
};

export const metadata = {
  metadataBase: new URL("https://fiveetatva.com"),
  title: {
    default: "Fiveetatva | Premium Ayurvedic Wellness Products in Delhi, India",
    template: "%s | Fiveetatva",
  },
  description: "Fiveetatva - Premium Ayurvedic wellness brand founded by Rahul Gour & Suraj Gaur in Delhi, India. Natural Ayurvedic products for sugar balance, digestive health, and overall wellness. 100% natural, lab-tested formulations.",
  keywords: [
    "Fiveetatva",
    "Ayurvedic products",
    "Ayurveda India",
    "herbal supplements",
    "natural wellness",
    "Ayurvedic medicine",
    "sugar balance",
    "digestive health",
    "Ayurvedic wellness Delhi",
    "Rahul Gour",
    "Suraj Gaur",
    "traditional Ayurveda",
    "herbal remedies",
    "Ayurvedic formulations",
    "natural health products",
    "Ayurvedic store",
    "herbal medicine India",
    "Ayurvedic supplements",
    "wellness products"
  ],
  authors: [{ name: "Rahul Gour", url: "https://fiveetatva.com" }, { name: "Suraj Gaur", url: "https://fiveetatva.com" }],
  creator: "Fiveetatva",
  publisher: "Fiveetatva",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://fiveetatva.com",
    siteName: "Fiveetatva",
    title: "Fiveetatva | Premium Ayurvedic Wellness Products",
    description: "Premium Ayurvedic wellness brand founded by Rahul Gour & Suraj Gaur. Natural products for sugar balance, digestive health, and overall wellness.",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Fiveetatva - Premium Ayurvedic Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiveetatva | Premium Ayurvedic Wellness Products",
    description: "Premium Ayurvedic wellness brand founded by Rahul Gour & Suraj Gaur. Natural products for sugar balance, digestive health, and overall wellness.",
    images: ["/assets/logo.png"],
    creator: "@fiveetatva",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-foreground">
        <Providers>
          <LenisProvider>
            <Navbar />
            <main className="w-full flex-1 flex flex-col">{children}</main>
            <Footer />
            <CookieConsent />
          </LenisProvider>
        </Providers>
      </body>
    </html>
  );
}
