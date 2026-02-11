import type { UrlItemCategory } from "@/types/url-item";

export const CATEGORY_COLORS: Record<
  UrlItemCategory,
  { activeBg: string; activeText: string; border: string; ring: string }
> = {
  protocol: {
    activeBg: "bg-red-50 dark:bg-red-950/30",
    activeText: "text-red-600 dark:text-red-400",
    border: "border-red-300 dark:border-red-700",
    ring: "ring-red-300 dark:ring-red-700",
  },
  subdomain: {
    activeBg: "bg-orange-50 dark:bg-orange-950/30",
    activeText: "text-orange-600 dark:text-orange-400",
    border: "border-orange-300 dark:border-orange-700",
    ring: "ring-orange-300 dark:ring-orange-700",
  },
  domain: {
    activeBg: "bg-amber-50 dark:bg-amber-950/30",
    activeText: "text-amber-600 dark:text-amber-400",
    border: "border-amber-300 dark:border-amber-700",
    ring: "ring-amber-300 dark:ring-amber-700",
  },
  path: {
    activeBg: "bg-emerald-50 dark:bg-emerald-950/30",
    activeText: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-300 dark:border-emerald-700",
    ring: "ring-emerald-300 dark:ring-emerald-700",
  },
  query: {
    activeBg: "bg-blue-50 dark:bg-blue-950/30",
    activeText: "text-blue-600 dark:text-blue-400",
    border: "border-blue-300 dark:border-blue-700",
    ring: "ring-blue-300 dark:ring-blue-700",
  },
};
