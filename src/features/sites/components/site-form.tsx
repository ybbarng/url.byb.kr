"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SiteFormValues, siteFormSchema } from "../schemas/site-schema";

interface SiteFormProps {
  defaultValues?: SiteFormValues;
  onSubmit: (values: SiteFormValues) => void;
  submitLabel: string;
  isPending?: boolean;
}

/** 사이트 생성/수정 폼 (이름 + 설명) */
export function SiteForm({ defaultValues, onSubmit, submitLabel, isPending }: SiteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">사이트 이름</Label>
        <Input id="name" placeholder="예: Issue Tracker, My Blog" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Input
          id="description"
          placeholder="예: 이슈 트래커 URL 관리"
          {...register("description")}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "저장 중..." : submitLabel}
      </Button>
    </form>
  );
}
