"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UrlItem, UrlItemCategory } from "@/types/url-item";
import { CATEGORY_COLORS } from "../category-colors";
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

const CATEGORY_DESCRIPTIONS: Record<
  UrlItemCategory,
  { description: string; urlParts: { before: string; highlight: string; after: string } }
> = {
  protocol: {
    description: "웹 주소 맨 앞에 붙는 통신 방식입니다. 보통 https(보안)나 http를 사용합니다.",
    urlParts: { before: "", highlight: "https", after: "://blog.example.com/posts/123?lang=ko" },
  },
  subdomain: {
    description: "도메인 앞에 붙는 이름으로, 같은 사이트 안에서 영역을 나눌 때 사용합니다.",
    urlParts: { before: "https://", highlight: "blog", after: ".example.com/posts/123?lang=ko" },
  },
  domain: {
    description: "웹사이트의 고유 주소입니다. 사이트를 찾아가기 위한 핵심 부분입니다.",
    urlParts: { before: "https://blog.", highlight: "example.com", after: "/posts/123?lang=ko" },
  },
  path: {
    description: "도메인 뒤에 오는 경로로, 사이트 안에서 특정 페이지 위치를 나타냅니다.",
    urlParts: { before: "https://blog.example.com/", highlight: "posts/123", after: "?lang=ko" },
  },
  query: {
    description: "주소 끝에 ? 뒤로 붙는 추가 정보입니다. 검색어, 필터 등 옵션을 전달합니다.",
    urlParts: { before: "https://blog.example.com/posts/123?", highlight: "lang=ko", after: "" },
  },
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
        <div className="rounded-md bg-muted/50 p-3 space-y-1.5">
          <p className="text-sm text-muted-foreground">
            {CATEGORY_DESCRIPTIONS[category].description}
          </p>
          <p className="font-mono text-sm break-all">
            <span className="text-muted-foreground">
              {CATEGORY_DESCRIPTIONS[category].urlParts.before}
            </span>
            <span
              className={`font-bold ${CATEGORY_COLORS[category].activeText} underline decoration-2 underline-offset-2`}
            >
              {CATEGORY_DESCRIPTIONS[category].urlParts.highlight}
            </span>
            <span className="text-muted-foreground">
              {CATEGORY_DESCRIPTIONS[category].urlParts.after}
            </span>
          </p>
        </div>
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
