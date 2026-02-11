"use client";

import { ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from "@/features/presets/hooks/use-presets";
import { useUrlItems } from "@/features/url-builder/hooks/use-url-items";
import { buildUrl } from "@/lib/url";
import type { Preset } from "@/types/preset";
import type { UrlItem } from "@/types/url-item";

function FavoriteItem({ preset, urlItems }: { preset: Preset; urlItems: UrlItem[] }) {
  const url = useMemo(() => {
    if (urlItems.length === 0) return "";

    const itemMap = new Map(urlItems.map((item) => [item.id, item]));
    const protocol = itemMap.get(preset.selectedProtocolId);
    const domain = itemMap.get(preset.selectedDomainId);

    if (!protocol || !domain) return "";

    return buildUrl({
      protocol,
      subdomain: preset.selectedSubdomainId
        ? (itemMap.get(preset.selectedSubdomainId) ?? null)
        : null,
      domain,
      path: preset.selectedPathId ? (itemMap.get(preset.selectedPathId) ?? null) : null,
      queries: preset.selectedQueryIds
        .map((id) => itemMap.get(id))
        .filter((item): item is UrlItem => !!item),
    });
  }, [urlItems, preset]);

  return (
    <Card className="group">
      <CardHeader className="flex flex-row items-center justify-between gap-2 py-3">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-1.5 text-sm">
            <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
            {preset.name}
          </CardTitle>
          <CardDescription className="font-mono text-xs truncate">{url}</CardDescription>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => url && window.open(url, "_blank")}
            disabled={!url}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <CopyButton text={url} className="h-8 px-2" />
        </div>
      </CardHeader>
    </Card>
  );
}

/** 개별 즐겨찾기 아이템에서 해당 사이트의 UrlItem을 로드 */
function FavoriteItemWrapper({ preset }: { preset: Preset }) {
  const { data: urlItems } = useUrlItems(preset.siteId);
  return <FavoriteItem preset={preset} urlItems={urlItems ?? []} />;
}

/** 홈 화면에 표시되는 즐겨찾기 목록 */
export function FavoriteList() {
  const { data: favorites, isLoading } = useFavorites();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">불러오는 중...</p>;
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-sm text-muted-foreground">즐겨찾기가 없습니다</p>
        <Button asChild variant="link" size="sm" className="mt-1">
          <Link href="/presets">프리셋에서 즐겨찾기를 추가해보세요</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {favorites.map((fav) => (
        <FavoriteItemWrapper key={fav.id} preset={fav} />
      ))}
    </div>
  );
}
