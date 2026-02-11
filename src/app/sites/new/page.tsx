"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SiteForm } from "@/features/sites/components/site-form";
import { useCreateSite } from "@/features/sites/hooks/use-sites";
import type { SiteFormValues } from "@/features/sites/schemas/site-schema";
import type { Site } from "@/types/site";

export default function NewSitePage() {
  const router = useRouter();
  const createSite = useCreateSite();

  const handleSubmit = (values: SiteFormValues) => {
    const now = new Date().toISOString();
    const site: Site = {
      id: crypto.randomUUID(),
      name: values.name,
      description: values.description ?? "",
      createdAt: now,
      updatedAt: now,
    };

    createSite.mutate(site, {
      onSuccess: () => {
        toast.success("사이트가 생성되었습니다");
        router.push("/sites");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">새 사이트</h1>
        <p className="text-sm text-muted-foreground">
          사이트를 생성한 뒤 URL 빌더에서 구성요소를 추가하세요
        </p>
      </div>
      <SiteForm
        onSubmit={handleSubmit}
        submitLabel="사이트 생성"
        isPending={createSite.isPending}
      />
    </div>
  );
}
