"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PresetCard } from "@/features/presets/components/preset-card";
import {
  useDeletePreset,
  usePresets,
  useToggleFavorite,
} from "@/features/presets/hooks/use-presets";
import { useSites } from "@/features/sites/hooks/use-sites";
import { useUrlItems } from "@/features/url-builder/hooks/use-url-items";

/** 사이트별 UrlItem을 로드하는 래퍼 */
function PresetCardWithItems({
  preset,
  siteName,
  siteId,
  onToggleFavorite,
  onDelete,
}: {
  preset: Parameters<typeof PresetCard>[0]["preset"];
  siteName?: string;
  siteId: string;
  onToggleFavorite: Parameters<typeof PresetCard>[0]["onToggleFavorite"];
  onDelete: Parameters<typeof PresetCard>[0]["onDelete"];
}) {
  const { data: urlItems } = useUrlItems(siteId);
  return (
    <PresetCard
      preset={preset}
      site={
        siteName
          ? { id: siteId, name: siteName, description: "", createdAt: "", updatedAt: "" }
          : undefined
      }
      urlItems={urlItems}
      onToggleFavorite={onToggleFavorite}
      onDelete={onDelete}
    />
  );
}

export default function PresetsPage() {
  const { data: presets, isLoading: presetsLoading } = usePresets();
  const { data: sites, isLoading: sitesLoading } = useSites();
  const toggleFavorite = useToggleFavorite();
  const deletePreset = useDeletePreset();

  const isLoading = presetsLoading || sitesLoading;
  const sitesMap = new Map(sites?.map((s) => [s.id, s]));

  const handleDelete = (id: string) => {
    if (!confirm("이 프리셋을 삭제하시겠습니까?")) return;
    deletePreset.mutate(id, {
      onSuccess: () => toast.success("프리셋이 삭제되었습니다"),
    });
  };

  // 사이트별로 프리셋을 그룹화
  const groupedPresets = presets?.reduce(
    (acc, preset) => {
      const siteId = preset.siteId;
      const siteName = sitesMap.get(siteId)?.name ?? "알 수 없는 사이트";
      const key = `${siteId}::${siteName}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(preset);
      return acc;
    },
    {} as Record<string, typeof presets>,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">프리셋</h1>
        <p className="text-sm text-muted-foreground">저장된 URL 조합을 관리합니다</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      ) : !presets || presets.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">저장된 프리셋이 없습니다</p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/builder">URL 빌더에서 조합을 저장해보세요</Link>
          </Button>
        </div>
      ) : (
        Object.entries(groupedPresets ?? {}).map(([key, sitePresets]) => {
          const [siteId, siteName] = key.split("::");
          return (
            <section key={key} className="space-y-3">
              <h2 className="text-lg font-semibold">{siteName}</h2>
              <div className="grid gap-3">
                {sitePresets?.map((preset) => (
                  <PresetCardWithItems
                    key={preset.id}
                    preset={preset}
                    siteId={siteId}
                    siteName={siteName}
                    onToggleFavorite={(p) => toggleFavorite.mutate(p)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
