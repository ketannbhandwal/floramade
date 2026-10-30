import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getSiteSettings, saveSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      announcement,
      banners, 
      concerns, 
      productHeading, 
      productSubheading,
      benefitsHeading,
      benefits,
      navLinks,
      testimonialsPretitle,
      testimonialsTitle,
      testimonialsSubtitle,
      testimonials,
      spotlightProductId
    } = body;

    const saved = await saveSiteSettings({ 
      announcement,
      banners, 
      concerns, 
      productHeading, 
      productSubheading,
      benefitsHeading,
      benefits,
      navLinks,
      testimonialsPretitle,
      testimonialsTitle,
      testimonialsSubtitle,
      testimonials,
      spotlightProductId
    });
    
    // Revalidate home page cache
    try {
      revalidatePath("/");
    } catch (e) {
      // ignore in dev
    }

    return NextResponse.json({ success: true, settings: saved });
  } catch (err) {
    console.error("POST /api/settings error:", err);
    return NextResponse.json({ error: err.message || "Failed to update settings" }, { status: 500 });
  }
}
