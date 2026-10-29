import { Metadata } from "next";

export const metadata = {
  title: "About Floramade | Ayurvedic Wellness Brand by Suresh Gaur",
  description: "Floramade is an Ayurvedic wellness brand founded by Suresh Gaur in Delhi, India. We provide natural and effective Ayurvedic products for a healthier lifestyle with focus on quality, purity, and traditional formulations.",
  keywords: "Floramade, Ayurvedic products, Suresh Gaur, Ayurvedic wellness, natural health products, Delhi India, traditional Ayurveda, herbal supplements, wellness brand",
  openGraph: {
    title: "About Floramade | Ayurvedic Wellness Brand",
    description: "Founded by Suresh Gaur, Floramade provides natural and effective Ayurvedic products for a healthier lifestyle based in Delhi, India.",
    type: "website",
  },
};

export default function AboutLayout({ children }) {
  return children;
}
