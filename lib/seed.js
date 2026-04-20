import Product from "@/models/Product";
import User from "@/models/User";
import { productsSeed } from "@/lib/data";
import { hashPassword } from "@/lib/auth";

export async function seedProductsIfEmpty() {
  for (const item of productsSeed) {
    await Product.findOneAndUpdate({ slug: item.slug }, item, {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
    });
  }
}

export async function seedDefaultAdmin() {
  const email = "admin@fiveetatva.com";
  const existing = await User.findOne({ email });
  if (existing) {
    if (!existing.phone) {
      existing.phone = "9999999999";
      await existing.save();
    }
    return existing;
  }

  const password = await hashPassword("admin123");
  return User.create({
    name: "Fiveetatva Admin",
    email,
    phone: "9999999999",
    password,
    role: "admin",
  });
}
