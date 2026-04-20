"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { border: "1px solid #dbe8bf", background: "#ffffff", color: "#3f5b35" },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
