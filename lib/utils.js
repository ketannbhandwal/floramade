import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sortProducts(products) {
  if (!Array.isArray(products)) return [];
  return [...products].sort((a, b) => {
    const orderA = typeof a.sortOrder === "number" ? a.sortOrder : (typeof a.order === "number" ? a.order : 999999);
    const orderB = typeof b.sortOrder === "number" ? b.sortOrder : (typeof b.order === "number" ? b.order : 999999);
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });
}
