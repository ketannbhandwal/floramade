import clsx from "clsx";

export default function Input({ label, error, className, icon, ...props }) {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.04em] text-[#1A2332]/60">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A2332]/40 group-focus-within:text-[#1A2332] transition-colors duration-300">
            {icon}
          </span>
        )}
        <input
          className={clsx(
            "h-11 w-full rounded-xl border border-[#C5D5E8] bg-white px-4 text-sm tracking-tight text-[#1A2332] outline-none transition placeholder:text-[#1A2332]/30 focus:border-[#142B49]/40 focus:ring-1 focus:ring-[#0E1F36]/10 focus:bg-white",
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
