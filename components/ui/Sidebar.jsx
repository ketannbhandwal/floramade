import clsx from "clsx";

export default function Sidebar({ items, activeKey, onChange, className }) {
  return (
    <aside className={clsx("h-fit rounded-2xl border border-[#e5dcc7] bg-white p-3 shadow-[0_16px_34px_-28px_rgba(126,94,40,0.25)]", className)}>
      {items.map((item) => {
        const active = item.key === activeKey;
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={clsx(
              "mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition",
              active ? "bg-[#f4eddd] text-[#55421f]" : "text-[#756342] hover:bg-[#faf7ef]"
            )}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {item.label}
          </button>
        );
      })}
    </aside>
  );
}
