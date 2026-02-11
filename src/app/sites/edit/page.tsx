"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { SiteForm } from "@/features/sites/components/site-form";
import { useSite, useUpdateSite } from "@/features/sites/hooks/use-sites";
import type { SiteFormValues } from "@/features/sites/schemas/site-schema";
import type { Site } from "@/types/site";

function SiteEditContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("id") ?? "";
  const router = useRouter();
  const { data: site, isLoading } = useSite(siteId);
  const updateSite = useUpdateSite();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">불러오는 중...</p>;
  }

  if (!site) {
    return <p className="text-sm text-destructive">사이트를 찾을 수 없습니다</p>;
  }

  const handleSubmit = (values: SiteFormValues) => {
    const updated: Site = {
      ...site,
      name: values.name,
      description: values.description ?? "",
      updatedAt: new Date().toISOString(),
    };

    updateSite.mutate(updated, {
      onSuccess: () => {
        toast.success("사이트가 수정되었습니다");
        router.push("/sites");
      },
    });
  };

  const defaultValues: SiteFormValues = {
    name: site.name,
    description: site.description,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{site.name}</h1>
        <p className="text-sm text-muted-foreground">사이트 정보를 수정합니다</p>
      </div>
      <SiteForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="저장"
        isPending={updateSite.isPending}
      />
    </div>
  );
}

export default function SiteEditPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">불러오는 중...</p>}>
      <SiteEditContent />
    </Suspense>
  );
}
