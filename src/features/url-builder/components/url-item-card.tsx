"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UrlItem, UrlItemCategory } from "@/types/url-item";

interface UrlItemCardProps {
  item: UrlItem;
  category: UrlItemCategory;
  isSelected: boolean;
  onSelect: (item: UrlItem) => void;
  onEdit: (item: UrlItem) => void;
  onDelete: (item: UrlItem) => void;
}

/** 컬럼 내 개별 항목 카드: 선택 하이라이트, 편집/삭제 */
export function UrlItemCard({
  item,
  category,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: UrlItemCardProps) {
  return (
    <div
      className={cn(
        "group flex w-full items-center gap-2 rounded-md border px-3 py-2 transition-colors",
        isSelected
          ? "border-primary bg-primary/10 ring-1 ring-primary"
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
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
