"use client";

import { Check, Clock, PackageCheck, Truck, Home, XCircle } from "lucide-react";

const TRACKING_STEPS = [
  {
    key: "placed",
    label: "Order Placed",
    subtext: "Order confirmed",
    icon: Clock,
  },
  {
    key: "processing",
    label: "Preparing",
    subtext: "Ayurvedic pharmacy",
    icon: PackageCheck,
  },
  {
    key: "shipped",
    label: "In Transit",
    subtext: "Dispatched with courier",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    subtext: "Delivered at doorstep",
    icon: Home,
  },
];

export default function OrderTimeline({ status = "placed", className = "" }) {
  const isCancelled = status === "cancelled";
  const stepKeys = ["placed", "processing", "shipped", "delivered"];
  const currentIdx = isCancelled ? -1 : Math.max(0, stepKeys.indexOf(status));

  if (isCancelled) {
    return (
      <div className={`p-4 rounded-xl bg-red-50/80 border border-red-200/80 flex items-center gap-3 ${className}`}>
        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
          <XCircle size={18} />
        </div>
        <div>
          <p className="text-xs font-bold text-red-800 uppercase tracking-tight">Order Cancelled</p>
          <p className="text-[11px] text-red-700/80 tracking-tight mt-0.5">
            This order was cancelled. If you need any assistance, our Ayurvedic support is ready to help.
          </p>
        </div>
      </div>
    );
  }

  // Calculate percentage for active bar
  const progressPercent = (currentIdx / (TRACKING_STEPS.length - 1)) * 100;

  return (
    <div className={`w-full py-2 ${className}`}>
      {/* Stepper Container */}
      <div className="relative">
        {/* Background Track Line */}
        <div className="absolute top-4 left-6 right-6 sm:left-8 sm:right-8 h-1 bg-[#E0D9C8]/60 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Active Progress Line */}
        <div
          className="absolute top-4 left-6 sm:left-8 h-1 bg-[#123D2B] -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `calc(${progressPercent}% * (100% - 3rem) / 100)` }}
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-4 relative z-10">
          {TRACKING_STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isPending = idx > currentIdx;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                {/* Node Circle */}
                <div
                  className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 relative ${
                    isCompleted
                      ? "bg-[#123D2B] text-white shadow-xs"
                      : isCurrent
                      ? "bg-[#123D2B] text-white ring-4 ring-[#123D2B]/20 shadow-md shadow-[#123D2B]/20"
                      : "bg-white border-2 border-[#E0D9C8] text-[#171717]/40"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <StepIcon size={14} strokeWidth={2.5} />
                  )}

                  {/* Pulsing glow for current stage */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-[#123D2B] animate-ping opacity-25 pointer-events-none" />
                  )}
                </div>

                {/* Step Labels */}
                <div className="mt-2.5 px-0.5">
                  <p
                    className={`text-[11px] sm:text-xs font-bold tracking-tight leading-tight ${
                      isCurrent
                        ? "text-[#123D2B]"
                        : isCompleted
                        ? "text-[#171717]"
                        : "text-[#171717]/40"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="hidden sm:block text-[10px] text-[#171717]/45 tracking-tight mt-0.5 leading-tight">
                    {step.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
