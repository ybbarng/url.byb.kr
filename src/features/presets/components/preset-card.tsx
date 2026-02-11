"use client";

import { ExternalLink, Star, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildUrl } from "@/lib/url";
import { cn } from "@/lib/utils";
import type { Preset } from "@/types/preset";
import type { Site } from "@/types/site";

interface PresetCardProps {
  preset: Preset;
  site?: Site;
  onToggleFavorite: (preset: Preset) => void;
  onDelete: (id: string) => void;
}

/** 프리셋 카드: URL 미리보기, 열기, 복사, 즐겨찾기 토글, 삭제 */
export function PresetCard({ preset, site, onToggleFavorite, onDelete }: PresetCardProps) {
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
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{preset.name}</CardTitle>
            {site && (
              <Badge variant="outline" className="text-xs shrink-0">
                {site.name}
              </Badge>
            )}
          </div>
          <CardDescription className="font-mono text-xs truncate">{url}</CardDescription>
        </div>

        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleFavorite(preset)}
            aria-label={preset.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          >
            <Star
              className={cn(
                "h-4 w-4",
                preset.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
              )}
            />
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
          <CopyButton text={url} className="h-8 px-2" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(preset.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
