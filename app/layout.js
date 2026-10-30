import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/ui/Providers";
import CookieConsent from "@/components/ui/CookieConsent";
import LenisProvider from "@/components/ui/LenisProvider";
import NetworkStatus from "@/components/ui/NetworkStatus";
import { Toaster } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";

const organizationSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://floramade.in/#organization",
    "name": "Floramade",
    "legalName": "Floramade Healthcare Pvt. Ltd.",
    "alternateName": ["Floramade Ayurveda", "Floramade Healthcare"],
    "url": "https://floramade.in",
    "logo": "https://floramade.in/floramade-official-logo.png",
    "description": "Floramade - Premium Ayurvedic wellness brand founded by Suresh Gaur in Delhi, India. Natural Ayurvedic products for sugar balance, digestive health, and overall wellness.",
    "founder": {
      "@type": "Person",
      "@id": "https://floramade.in/#founder",
      "name": "Suresh Gaur",
      "jobTitle": "Founder & Visionary",
      "url": "https://floramade.in/about",
      "worksFor": {
        "@id": "https://floramade.in/#organization"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Delhi",
        "addressCountry": "IN"
      }
    },
    "founders": [
      {
        "@type": "Person",
        "name": "Suresh Gaur"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rohini Sector 21",
      "addressLocality": "New Delhi",
      "postalCode": "110086",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9220251059",
      "email": "floramade517@gmail.com",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.instagram.com/floramadeofficial/",
      "https://www.facebook.com/share/1HuEXx3gQh/",
      "https://twitter.com/floramade"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://floramade.in/#website",
    "url": "https://floramade.in",
    "name": "Floramade",
    "alternateName": ["Floramade Ayurveda"],
    "publisher": {
      "@id": "https://floramade.in/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://floramade.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
];

export const metadata = {
  metadataBase: new URL("https://floramade.in"),
  title: {
    default: "Floramade | Premium Ayurvedic Wellness Products in Delhi, India",
    template: "%s | Floramade",
  },
  description: "Floramade - Premium Ayurvedic wellness brand founded by Suresh Gaur in Delhi, India. Natural Ayurvedic products for sugar balance, digestive health, and overall wellness. 100% natural, lab-tested formulations.",
  keywords: [
    "Floramade",
    "Ayurvedic products",
    "Ayurveda India",
    "herbal supplements",
    "natural wellness",
    "Ayurvedic medicine",
    "sugar balance",
    "digestive health",
    "Ayurvedic wellness Delhi",
    "Suresh Gaur",
    "traditional Ayurveda",
    "herbal remedies",
    "Ayurvedic formulations",
    "natural health products",
    "Ayurvedic store",
    "herbal medicine India",
    "Ayurvedic supplements",
    "wellness products"
  ],
  authors: [{ name: "Suresh Gaur", url: "https://floramade.in" }],
  creator: "Floramade",
  publisher: "Floramade",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://floramade.in",
    siteName: "Floramade",
    title: "Floramade | Premium Ayurvedic Wellness Products",
    description: "Premium Ayurvedic wellness brand founded by Suresh Gaur. Natural products for sugar balance, digestive health, and overall wellness.",
    images: [
      {
        url: "/floramade-logo.png",
        width: 1200,
        height: 630,
        alt: "Floramade - Premium Ayurvedic Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Floramade | Premium Ayurvedic Wellness Products",
    description: "Premium Ayurvedic wellness brand founded by Suresh Gaur. Natural products for sugar balance, digestive health, and overall wellness.",
    images: ["/floramade-logo.png"],
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/floramade-icon.png" type="image/png" />
        <meta name="theme-color" content="#101D17" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Floramade" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/floramade-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground overflow-x-clip selection:bg-primary selection:text-foreground">
        <NetworkStatus />
        <Providers>
          <LenisProvider>
            <Navbar />
            <main className="w-full flex-1 flex flex-col pt-[104px] sm:pt-[108px] lg:pt-[110px] relative z-10">{children}</main>
            <Footer />
            <CookieConsent />
            
            {/* Floating WhatsApp Button */}
            <a 
              href="https://wa.me/919220251059" 
              target="_blank" 
              rel="noopener noreferrer"
              className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 active:scale-95 group"
              aria-label="Contact us on WhatsApp"
            >
              <FaWhatsapp size={32} />
              <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-slate-100">
                Chat with us
              </span>
            </a>
          </LenisProvider>
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { border: "1px solid #E0D9C8", background: "#F8F4E9", color: "#171717" },
          }}
        />
      </body>
    </html>
  );
}
