import Product from "@/models/Product";
import User from "@/models/User";
import { productsSeed } from "@/lib/data";
import { hashPassword } from "@/lib/auth";

export async function seedProductsIfEmpty() {
  for (const item of productsSeed) {
    const existing = await Product.findOne({ slug: item.slug });
    if (existing) {
      Object.assign(existing, item);
      await existing.save();
    } else {
      await Product.create(item);
    }
  }
}

export async function seedDefaultAdmin() {
  const email = "admin@fiveetatv.com";
  const existing = await User.findOne({ email });
  if (existing) {
    if (!existing.phone) {
      existing.phone = "9318445297";
      await existing.save();
    }
    return existing;
  }

  const password = await hashPassword("admin123");
  return User.create({
    name: "Fiveetatv Admin",
    email,
    phone: "9318445297",
    password,
    role: "admin",
  });
}
