"use client";

const steps = ["placed", "processing", "shipped", "delivered"];

export default function OrderTimeline({ status = "placed" }) {
  const activeIndex = Math.max(0, steps.indexOf(status));

  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
              idx <= activeIndex ? "bg-[#6c875d] text-white" : "bg-[#eef4d7] text-[#7b8f70]"
            }`}
          >
            {idx + 1}
          </div>
          <span className={`text-xs capitalize ${idx <= activeIndex ? "text-[#4d6443]" : "text-[#8ca182]"}`}>{step}</span>
          {idx < steps.length - 1 ? <div className="h-px w-6 bg-[#dbe8bf]" /> : null}
        </div>
      ))}
    </div>
  );
}
