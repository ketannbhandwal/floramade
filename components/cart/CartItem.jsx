"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[90px_1fr_auto] md:grid-cols-[90px_1fr_auto_auto] gap-4 md:gap-6 items-center py-5 sm:py-6 group">

      {/* Image */}
      <Link href={`/product/${item.slug}`} className="relative h-20 w-20 sm:h-[90px] sm:w-[90px] overflow-hidden rounded-xl bg-white border border-[#E8D9C5] block flex-shrink-0">
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
        <Link href={`/product/${item.slug}`} className="text-sm sm:text-base font-bold tracking-tight text-[#39160D] hover:text-[#872B10] transition-colors duration-300 truncate">
          {item.name}
        </Link>
        <p className="text-xs text-[#39160D]/50 font-semibold tracking-tight mt-0.5">₹{item.price.toLocaleString()}</p>

        {/* Mobile Quantity + Remove */}
        <div className="md:hidden mt-3 flex items-center gap-3">
          <div className="flex items-center border border-[#E8D9C5] rounded-full h-8 justify-between bg-white">
            <button onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)} className="px-2.5 h-full hover:text-[#872B10] transition-colors">
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="text-xs font-bold text-[#39160D] min-w-[24px] text-center">{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)} className="px-2.5 h-full hover:text-[#872B10] transition-colors">
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>
          <button onClick={() => onRemove(item.productId)} className="text-[#39160D]/30 hover:text-red-500 transition-colors p-1">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Desktop Quantity */}
      <div className="hidden md:flex flex-col items-center justify-center gap-1.5">
        <div className="flex items-center border border-[#E8D9C5] rounded-full h-10 justify-between bg-white">
          <button onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)} className="px-3 h-full hover:text-[#872B10] transition-colors">
            <Minus size={13} strokeWidth={2.5} />
          </button>
          <span className="text-sm font-bold text-[#39160D] min-w-[28px] text-center">{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)} className="px-3 h-full hover:text-[#872B10] transition-colors">
            <Plus size={13} strokeWidth={2.5} />
          </button>
        </div>
        <button
          onClick={() => onRemove(item.productId)}
          className="text-[10px] uppercase tracking-[0.06em] font-bold text-[#39160D]/30 hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </div>

      {/* Total */}
      <div className="hidden md:flex justify-end items-center w-20">
        <p className="text-base font-bold tracking-tight text-[#39160D]">₹{(item.price * item.quantity).toLocaleString()}</p>
      </div>

    </div>
  );
}
