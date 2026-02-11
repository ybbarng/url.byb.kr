"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { UrlItem, UrlItemCategory } from "@/types/url-item";
import { CATEGORY_COLORS } from "../category-colors";
import {
  useCreateUrlItem,
  useDeleteUrlItem,
  useUpdateUrlItem,
  useUrlItemsByCategory,
} from "../hooks/use-url-items";
import type { UrlItemFormValues } from "../schemas/url-item-schema";
import { ItemFormDialog } from "./item-form-dialog";
import { UrlItemCard } from "./url-item-card";

const CATEGORY_LABELS: Record<UrlItemCategory, string> = {
  protocol: "프로토콜",
  subdomain: "서브도메인",
  domain: "도메인",
  path: "경로",
  query: "쿼리",
};

interface UrlColumnProps {
  siteId: string;
  category: UrlItemCategory;
  /** 선택된 항목 ID (query는 여러 개 가능이므로 배열 사용) */
  selectedIds: string[];
  onSelect: (item: UrlItem) => void;
  /** 항목이 비어 있을 때 추가 버튼을 강조 */
  highlight?: boolean;
}

/** 카테고리별 세로 컬럼: 항목 목록 + 추가 버튼 */
export function UrlColumn({ siteId, category, selectedIds, onSelect, highlight }: UrlColumnProps) {
  const { data: items, isLoading } = useUrlItemsByCategory(siteId, category);
  const createItem = useCreateUrlItem();
  const updateItem = useUpdateUrlItem();
  const deleteItem = useDeleteUrlItem(siteId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UrlItem | null>(null);

  const handleAdd = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: UrlItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (item: UrlItem) => {
    if (!confirm(`"${item.name}" 항목을 삭제하시겠습니까?`)) return;
    deleteItem.mutate(item.id, {
      onSuccess: () => toast.success("항목이 삭제되었습니다"),
    });
  };

  const sanitizeValue = (value: string): string => {
    switch (category) {
      case "protocol":
        return value.replace(/:\/\/$/,  "");
      case "subdomain":
        return value.replace(/\.+$/, "");
      case "path":
        return value.replace(/^\/+/, "").replace(/\?+$/, "");
      case "query":
        return value.replace(/^\?+/, "");
      default:
        return value;
    }
  };

  const handleSubmit = (values: UrlItemFormValues) => {
    const now = new Date().toISOString();
    const sanitizedValue = sanitizeValue(values.value.trim());

    if (editingItem) {
      updateItem.mutate(
        {
          ...editingItem,
          name: values.name,
          description: values.description ?? "",
          value: sanitizedValue,
          updatedAt: now,
        },
        {
          onSuccess: () => toast.success("항목이 수정되었습니다"),
        },
      );
    } else {
      createItem.mutate(
        {
          id: crypto.randomUUID(),
          siteId,
          category,
          name: values.name,
          description: values.description ?? "",
          value: sanitizedValue,
          sortOrder: items?.length ?? 0,
          createdAt: now,
          updatedAt: now,
        },
        {
          onSuccess: () => toast.success("항목이 추가되었습니다"),
        },
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className={cn("text-sm font-semibold", CATEGORY_COLORS[category].activeText)}>
        {CATEGORY_LABELS[category]}
      </h3>

      {isLoading ? (
        <p className="text-xs text-muted-foreground">불러오는 중...</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "rounded-md border border-dashed p-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors",
              highlight && (!items || items.length === 0) && "animate-pulse border-primary/50 text-foreground",
            )}
          >
            항목 추가
          </button>
          {items?.map((item) => (
            <UrlItemCard
              key={item.id}
              item={item}
              category={category}
              isSelected={selectedIds.includes(item.id)}
              onSelect={onSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ItemFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={category}
        editItem={editingItem}
        onSubmit={handleSubmit}
        isPending={createItem.isPending || updateItem.isPending}
      />
    </div>
  );
}
