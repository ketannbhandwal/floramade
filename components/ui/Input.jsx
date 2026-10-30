import clsx from "clsx";

export default function Input({ label, error, className, icon, ...props }) {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.04em] text-[#171717]/60">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#171717]/40 group-focus-within:text-[#171717] transition-colors duration-300">
            {icon}
          </span>
        )}
        <input
          className={clsx(
            "h-11 w-full rounded-xl border border-[#E0D9C8] bg-white px-4 text-sm tracking-tight text-[#171717] outline-none transition placeholder:text-[#171717]/30 focus:border-[#101D17]/40 focus:ring-1 focus:ring-[#39160D]/10 focus:bg-white",
            icon && "pl-11",
            error && "border-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[10px] text-red-500 uppercase tracking-[0.04em] block font-bold">
          {error}
        </span>
      )}
    </div>
  );
}
