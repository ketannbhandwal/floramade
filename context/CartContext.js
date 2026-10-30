"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }
    } catch (error) {
      console.warn("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  function addToCart(product, pack = null, amount = 1) {
    const productId = product._id || product.id;
    const packId = pack?.id || "single";
    const cartItemKey = `${productId}:${packId}`;
    const price = Number(pack?.price ?? product.discountPrice ?? product.price ?? 0);
    setCartItems((prev) => {
      const found = prev.find((item) => (item.cartItemKey || `${item.productId}:single`) === cartItemKey);
      if (found) {
        return prev.map((item) =>
          (item.cartItemKey || `${item.productId}:single`) === cartItemKey ? { ...item, quantity: item.quantity + amount } : item
        );
      }
      return [
        ...prev,
        {
          productId,
          cartItemKey,
          name: product.name,
          price,
          compareAtPrice: Number(pack?.mrp ?? product.price ?? price),
          packId: pack?.id || null,
          packName: pack?.label || "",
          packContents: pack?.contents || "",
          packCount: Number(pack?.packCount || 1),
          quantity: amount,
          image: product.images?.[0],
          slug: product.slug,
        },
      ];
    });
  }

  function removeFromCart(cartItemKey) {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item.cartItemKey !== cartItemKey &&
          item.productId !== cartItemKey &&
          (item.cartItemKey || item.productId) !== cartItemKey
      )
    );
  }

  function updateQuantity(cartItemKey, quantity) {
    const nextQty = Number(quantity);
    if (nextQty < 1) {
      removeFromCart(cartItemKey);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        const matches =
          item.cartItemKey === cartItemKey ||
          item.productId === cartItemKey ||
          (item.cartItemKey || item.productId) === cartItemKey;
        return matches ? { ...item, quantity: nextQty } : item;
      })
    );
  }

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, total, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
