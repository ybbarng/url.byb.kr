"use client";

import { ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from "@/features/presets/hooks/use-presets";
import { useSites } from "@/features/sites/hooks/use-sites";
import { useUrlItems } from "@/features/url-builder/hooks/use-url-items";
import { buildUrl } from "@/lib/url";
import type { Preset } from "@/types/preset";
import type { UrlItem } from "@/types/url-item";

function FavoriteItem({
  preset,
  urlItems,
  siteName,
}: {
  preset: Preset;
  urlItems: UrlItem[];
  siteName?: string;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleTouchStart = useCallback(() => {
    timerRef.current = setTimeout(async () => {
      if (url) {
        await navigator.clipboard.writeText(url);
        toast.success("URL이 복사되었습니다");
      }
    }, 500);
  }, [url]);

  const handleTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const title = siteName ? `[${siteName}] ${preset.name}` : preset.name;

  return (
    <Card onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchEnd}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 py-3">
        <CardTitle className="text-sm min-w-0 truncate">{title}</CardTitle>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/presets#preset-${preset.id}`}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">수정</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => url && window.open(url, "_blank")}
            disabled={!url}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <CopyButton text={url} iconOnly className="h-8 w-8" />
        </div>
      </CardHeader>
    </Card>
  );
}

function FavoriteItemWrapper({ preset, siteName }: { preset: Preset; siteName?: string }) {
  const { data: urlItems } = useUrlItems(preset.siteId);
  return <FavoriteItem preset={preset} urlItems={urlItems ?? []} siteName={siteName} />;
}

/** 홈 화면에 표시되는 즐겨찾기 목록 */
export function FavoriteList() {
  const { data: favorites, isLoading } = useFavorites();
  const { data: sites } = useSites();

  const siteMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const site of sites ?? []) {
      map.set(site.id, site.name);
    }
    return map;
  }, [sites]);

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
        <FavoriteItemWrapper key={fav.id} preset={fav} siteName={siteMap.get(fav.siteId)} />
      ))}
    </div>
  );
}
