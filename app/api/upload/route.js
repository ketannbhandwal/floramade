import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { image } = await req.json();
    
    // Validate input
    if (!image) {
      return NextResponse.json({ message: "Image is required" }, { status: 400 });
    }
    
    // Validate image is a valid base64 string
    if (!image.startsWith('data:image/')) {
      return NextResponse.json({ message: "Invalid image format" }, { status: 400 });
    }
    
    // Check file size (limit to 5MB)
    const base64Data = image.split(',')[1];
    const fileSize = Math.ceil((base64Data.length * 3) / 4) / 1024 / 1024;
    if (fileSize > 5) {
      return NextResponse.json({ message: "Image size must be less than 5MB" }, { status: 400 });
    }
    
    // Upload to Cloudinary with optimizations
    const result = await cloudinary.uploader.upload(image, {
      folder: "ayurveda-products",
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 1200, crop: "limit" }
      ],
      resource_type: "auto"
    });
    
    return NextResponse.json({ 
      url: result.secure_url,
      publicId: result.public_id 
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ 
      message: error.message || "Failed to upload image" 
    }, { status: 500 });
  }
}
