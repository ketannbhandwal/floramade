import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard | Floramade",
  description: "Floramade administration portal",
};

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login?redirect=/admin");
  }

  return children;
}

