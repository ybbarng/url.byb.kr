"use client";

import { ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from "@/features/presets/hooks/use-presets";
import { useSites } from "@/features/sites/hooks/use-sites";
import { buildUrl } from "@/lib/url";
import type { Preset } from "@/types/preset";
import type { Site } from "@/types/site";

function FavoriteItem({ preset, site }: { preset: Preset; site?: Site }) {
  const url = useMemo(() => {
    if (!site) return "";
    return buildUrl({
      site,
      subdomain: preset.selectedSubdomainId ?? "",
      pathValues: preset.selectedPathValues,
      queryValues: preset.selectedQueryValues,
    });
  }, [site, preset]);

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

/** 홈 화면에 표시되는 즐겨찾기 목록 */
export function FavoriteList() {
  const { data: favorites, isLoading: favLoading } = useFavorites();
  const { data: sites, isLoading: sitesLoading } = useSites();

  const isLoading = favLoading || sitesLoading;
  const sitesMap = new Map(sites?.map((s) => [s.id, s]));

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
        <FavoriteItem key={fav.id} preset={fav} site={sitesMap.get(fav.siteId)} />
      ))}
    </div>
  );
}
