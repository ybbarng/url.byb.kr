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
      const siteName = sitesMap.get(preset.siteId)?.name ?? "알 수 없는 사이트";
      if (!acc[siteName]) acc[siteName] = [];
      acc[siteName].push(preset);
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
        Object.entries(groupedPresets ?? {}).map(([siteName, sitePresets]) => (
          <section key={siteName} className="space-y-3">
            <h2 className="text-lg font-semibold">{siteName}</h2>
            <div className="grid gap-3">
              {sitePresets?.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  site={sitesMap.get(preset.siteId)}
                  onToggleFavorite={(p) => toggleFavorite.mutate(p)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
