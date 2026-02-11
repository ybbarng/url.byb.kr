"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UrlItem, UrlItemCategory } from "@/types/url-item";
import { type UrlItemFormValues, urlItemFormSchema } from "../schemas/url-item-schema";

const CATEGORY_LABELS: Record<UrlItemCategory, string> = {
  protocol: "프로토콜",
  subdomain: "서브도메인",
  domain: "도메인",
  path: "경로",
  query: "쿼리",
};

const VALUE_PLACEHOLDERS: Record<UrlItemCategory, string> = {
  protocol: "예: https, http",
  subdomain: "예: app-dev, staging",
  domain: "예: example.com, localhost:3000",
  path: "예: api/v2/users (선행 / 없이)",
  query: "예: view=board, lang=ko",
};

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: UrlItemCategory;
  editItem?: UrlItem | null;
  onSubmit: (values: UrlItemFormValues) => void;
  isPending?: boolean;
}

/** 항목 추가/수정 다이얼로그 */
export function ItemFormDialog({
  open,
  onOpenChange,
  category,
  editItem,
  onSubmit,
  isPending,
}: ItemFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UrlItemFormValues>({
    resolver: zodResolver(urlItemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      value: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        editItem
          ? { name: editItem.name, description: editItem.description, value: editItem.value }
          : { name: "", description: "", value: "" },
      );
    }
  }, [open, editItem, reset]);

  const label = CATEGORY_LABELS[category];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editItem ? `${label} 수정` : `${label} 추가`}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => {
            onSubmit(values);
            onOpenChange(false);
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="item-name">이름</Label>
            <Input id="item-name" placeholder="표시 이름" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-value">값</Label>
            <Input
              id="item-value"
              placeholder={VALUE_PLACEHOLDERS[category]}
              {...register("value")}
            />
            {errors.value && <p className="text-sm text-destructive">{errors.value.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-description">설명 (선택)</Label>
            <Input id="item-description" placeholder="설명" {...register("description")} />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "저장 중..." : editItem ? "수정" : "추가"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
