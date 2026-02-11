"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UrlItem, UrlItemCategory } from "@/types/url-item";
import { CATEGORY_COLORS } from "../category-colors";

interface UrlItemCardProps {
  item: UrlItem;
  category: UrlItemCategory;
  isSelected: boolean;
  onSelect: (item: UrlItem) => void;
  onEdit: (item: UrlItem) => void;
  onDelete: (item: UrlItem) => void;
  /** false이면 삭제 버튼을 숨긴다 */
  deletable?: boolean;
}

/** 컬럼 내 개별 항목 카드: 선택 하이라이트, 편집/삭제 */
export function UrlItemCard({
  item,
  category,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  deletable = true,
}: UrlItemCardProps) {
  return (
    <div
      className={cn(
        "group flex w-full items-center gap-2 rounded-md border px-3 py-2 transition-colors",
        isSelected
          ? `${CATEGORY_COLORS[category].border} ${CATEGORY_COLORS[category].activeBg} ring-1 ${CATEGORY_COLORS[category].ring}`
          : "hover:border-muted-foreground/30",
      )}
    >
      <button
        type="button"
        className="min-w-0 flex-1 cursor-pointer text-left"
        onClick={() => onSelect(item)}
      >
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p
          className={cn(
            "text-xs text-muted-foreground font-mono",
            category === "query" ? "truncate" : "break-all",
          )}
        >
          {item.value}
        </p>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
        )}
      </button>
      <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(item)}>
          <Pencil className="h-3 w-3" />
        </Button>
        {deletable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
