"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const itemKey = item.cartItemKey || item.productId || item._id;

  return (
    <div className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[90px_1fr_auto] md:grid-cols-[90px_1fr_auto_auto] gap-4 md:gap-6 items-center py-5 sm:py-6 group">

      {/* Image */}
      <Link href={`/product/${item.slug}`} className="relative h-20 w-20 sm:h-[90px] sm:w-[90px] overflow-hidden rounded-xl bg-white border border-[#DCE8E8] block flex-shrink-0">
        <Image
          src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"}
          alt={item.name}
          fill
          sizes="90px"
          className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-col justify-center min-w-0">
        <Link href={`/product/${item.slug}`} className="text-sm sm:text-base font-bold tracking-tight text-[#123838] hover:text-[#126768] transition-colors duration-300 truncate">
          {item.name}
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-[#123838]/60 font-semibold tracking-tight">₹{item.price.toLocaleString()}</p>
          {item.packName && (
            <span className="text-[10px] font-bold text-[#126768] bg-[#126768]/10 px-2 py-0.5 rounded-md uppercase tracking-tight">
              {item.packName}
            </span>
          )}
        </div>

        {/* Mobile Quantity + Remove */}
        <div className="md:hidden mt-3 flex items-center gap-3">
          <div className="flex items-center border border-[#DCE8E8] rounded-full h-8 justify-between bg-white">
            <button
              type="button"
              onClick={() => {
                if (item.quantity <= 1) {
                  onRemove(itemKey);
                } else {
                  onUpdateQuantity(itemKey, item.quantity - 1);
                }
              }}
              className="px-2.5 h-full hover:text-[#126768] transition-colors cursor-pointer select-none"
              aria-label="Decrease quantity"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="text-xs font-bold text-[#123838] min-w-[24px] text-center select-none">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(itemKey, item.quantity + 1)}
              className="px-2.5 h-full hover:text-[#126768] transition-colors cursor-pointer select-none"
              aria-label="Increase quantity"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onRemove(itemKey)}
            className="text-[#123838]/40 hover:text-red-500 transition-colors p-1 cursor-pointer"
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Desktop Quantity */}
      <div className="hidden md:flex flex-col items-center justify-center gap-1.5">
        <div className="flex items-center border border-[#DCE8E8] rounded-full h-10 justify-between bg-white shadow-xs">
          <button
            type="button"
            onClick={() => {
              if (item.quantity <= 1) {
                onRemove(itemKey);
              } else {
                onUpdateQuantity(itemKey, item.quantity - 1);
              }
            }}
            className="px-3 h-full hover:text-[#126768] transition-colors cursor-pointer select-none"
            aria-label="Decrease quantity"
          >
            <Minus size={13} strokeWidth={2.5} />
          </button>
          <span className="text-sm font-bold text-[#123838] min-w-[28px] text-center select-none">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(itemKey, item.quantity + 1)}
            className="px-3 h-full hover:text-[#126768] transition-colors cursor-pointer select-none"
            aria-label="Increase quantity"
          >
            <Plus size={13} strokeWidth={2.5} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(itemKey)}
          className="text-[10px] uppercase tracking-[0.06em] font-bold text-[#123838]/40 hover:text-red-500 transition-colors cursor-pointer"
        >
          Remove
        </button>
      </div>

      {/* Total */}
      <div className="hidden md:flex justify-end items-center w-20">
        <p className="text-base font-bold tracking-tight text-[#123838]">₹{(item.price * item.quantity).toLocaleString()}</p>
      </div>

    </div>
  );
}
