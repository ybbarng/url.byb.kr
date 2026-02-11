"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteCard } from "@/features/sites/components/site-card";
import { useDeleteSite, useSites } from "@/features/sites/hooks/use-sites";

export default function SitesPage() {
  const { data: sites, isLoading } = useSites();
  const deleteSite = useDeleteSite();

  const handleDelete = (id: string) => {
    if (!confirm("이 사이트와 연관된 프리셋을 모두 삭제합니다. 계속하시겠습니까?")) return;
    deleteSite.mutate(id, {
      onSuccess: () => toast.success("사이트가 삭제되었습니다"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">사이트</h1>
          <p className="text-sm text-muted-foreground">URL 템플릿을 관리합니다</p>
        </div>
        <Button asChild>
          <Link href="/sites/new" className="gap-1">
            <Plus className="h-4 w-4" />새 사이트
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      ) : sites?.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">등록된 사이트가 없습니다</p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/sites/new">첫 사이트를 등록해보세요</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {sites?.map((site) => (
            <SiteCard key={site.id} site={site} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
