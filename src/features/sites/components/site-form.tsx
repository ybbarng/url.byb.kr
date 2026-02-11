"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { type SiteFormValues, siteFormSchema } from "../schemas/site-schema";
import { OptionListEditor } from "./option-list-editor";
import { PathSegmentEditor } from "./path-segment-editor";
import { QueryParamEditor } from "./query-param-editor";

interface SiteFormProps {
  defaultValues?: SiteFormValues;
  onSubmit: (values: SiteFormValues) => void;
  submitLabel: string;
  isPending?: boolean;
}

/** 사이트 생성/수정 폼 */
export function SiteForm({ defaultValues, onSubmit, submitLabel, isPending }: SiteFormProps) {
  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      protocol: "https",
      domain: "",
      subdomains: [],
      pathSegments: [],
      queryParams: [],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 기본 정보 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">기본 정보</h2>
        <div className="space-y-2">
          <Label htmlFor="name">사이트 이름</Label>
          <Input id="name" placeholder="예: Issue Tracker, My Blog" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>프로토콜</Label>
            <Select
              value={watch("protocol")}
              onValueChange={(v: "http" | "https") => setValue("protocol", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="https">https</SelectItem>
                <SelectItem value="http">http</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">도메인</Label>
            <Input
              id="domain"
              placeholder="예: example.com, localhost:3000"
              {...register("domain")}
            />
            {errors.domain && <p className="text-sm text-destructive">{errors.domain.message}</p>}
          </div>
        </div>
      </section>

      <Separator />

      {/* 서브도메인 */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">서브도메인</h2>
          <p className="text-sm text-muted-foreground">
            배포 환경별 서브도메인을 추가합니다. 없으면 비워두세요.
          </p>
        </div>
        <OptionListEditor
          options={watch("subdomains")}
          onChange={(options) => setValue("subdomains", options)}
          labelPlaceholder="표시 이름 (예: 개발)"
          valuePlaceholder="서브도메인 (예: app-dev)"
        />
      </section>

      <Separator />

      {/* 경로 세그먼트 */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">경로 세그먼트</h2>
          <p className="text-sm text-muted-foreground">
            URL 경로를 구성하는 조각들을 순서대로 추가합니다. 정적(고정값) 또는 동적(선택 가능한
            옵션)으로 구분됩니다.
          </p>
        </div>
        <PathSegmentEditor
          segments={watch("pathSegments")}
          onChange={(segments) => setValue("pathSegments", segments)}
        />
      </section>

      <Separator />

      {/* 쿼리 파라미터 */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">쿼리 파라미터</h2>
          <p className="text-sm text-muted-foreground">
            URL 끝에 붙는 쿼리 파라미터를 정의합니다. 옵션을 미리 정의하거나 자유 입력을 허용할 수
            있습니다.
          </p>
        </div>
        <QueryParamEditor
          params={watch("queryParams")}
          onChange={(params) => setValue("queryParams", params)}
        />
      </section>

      <Separator />

      <Button type="submit" disabled={isPending}>
        {isPending ? "저장 중..." : submitLabel}
      </Button>
    </form>
  );
}
