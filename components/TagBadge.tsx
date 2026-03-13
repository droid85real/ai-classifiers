"use client";

type TagBadgeVariant = "seo" | "sustainability";

interface TagBadgeProps {
  label: string;
  variant?: TagBadgeVariant;
}

const variantStyles: Record<TagBadgeVariant, string> = {
  seo: "bg-slate-200 text-slate-800 border-slate-300",
  sustainability: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

export function TagBadge({ label, variant = "seo" }: TagBadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium " +
        variantStyles[variant]
      }
    >
      {label}
    </span>
  );
}
