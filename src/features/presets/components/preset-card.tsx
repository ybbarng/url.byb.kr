"use client";

import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_COLORS } from "@/features/url-builder/category-colors";
import { buildUrl } from "@/lib/url";
import { cn } from "@/lib/utils";
import type { Preset } from "@/types/preset";
import type { UrlItem, UrlItemCategory } from "@/types/url-item";

interface UrlSegment {
  text: string;
  category?: UrlItemCategory;
  key: string;
}

interface PresetCardProps {
  preset: Preset;
  urlItems?: UrlItem[];
  onToggleFavorite: (preset: Preset) => void;
  onDelete: (id: string) => void;
}

/** 프리셋 카드: URL 미리보기, 열기, 복사, 즐겨찾기 토글, 삭제 */
export function PresetCard({ preset, urlItems, onToggleFavorite, onDelete }: PresetCardProps) {
  const { url, nameSegments, valueSegments } = useMemo(() => {
    const empty = { url: "", nameSegments: [] as UrlSegment[], valueSegments: [] as UrlSegment[] };
    if (!urlItems || urlItems.length === 0) return empty;

    const itemMap = new Map(urlItems.map((item) => [item.id, item]));
    const protocol = itemMap.get(preset.selectedProtocolId);
    const subdomain = preset.selectedSubdomainId
      ? (itemMap.get(preset.selectedSubdomainId) ?? null)
      : null;
    const domain = itemMap.get(preset.selectedDomainId);
    const path = preset.selectedPathId ? (itemMap.get(preset.selectedPathId) ?? null) : null;
    const queries = preset.selectedQueryIds
      .map((id) => itemMap.get(id))
      .filter((item): item is UrlItem => !!item);

    if (!protocol || !domain) return empty;

    const builtUrl = buildUrl({ protocol, subdomain, domain, path, queries });

    const names: UrlSegment[] = [];
    const values: UrlSegment[] = [];

    names.push({ text: protocol.name, category: "protocol", key: "protocol" });
    values.push({ text: protocol.value, category: "protocol", key: "protocol" });
    names.push({ text: "://", key: "sep-protocol" });
    values.push({ text: "://", key: "sep-protocol" });

    if (subdomain) {
      names.push({ text: subdomain.name, category: "subdomain", key: "subdomain" });
      values.push({ text: subdomain.value, category: "subdomain", key: "subdomain" });
      names.push({ text: ".", key: "sep-subdomain" });
      values.push({ text: ".", key: "sep-subdomain" });
    }

    names.push({ text: domain.name, category: "domain", key: "domain" });
    values.push({ text: domain.value, category: "domain", key: "domain" });

    if (path) {
      names.push({ text: "/", key: "sep-path" });
      values.push({ text: "/", key: "sep-path" });
      names.push({ text: path.name, category: "path", key: "path" });
      values.push({ text: path.value, category: "path", key: "path" });
    }

    if (queries.length > 0) {
      names.push({ text: "?", key: "sep-query" });
      values.push({ text: "?", key: "sep-query" });
      queries.forEach((q, i) => {
        if (i > 0) {
          names.push({ text: "&", key: `sep-query-${q.id}` });
          values.push({ text: "&", key: `sep-query-${q.id}` });
        }
        names.push({ text: q.name, category: "query", key: `query-${q.id}` });
        values.push({ text: q.value, category: "query", key: `query-${q.id}` });
      });
    }

    return { url: builtUrl, nameSegments: names, valueSegments: values };
  }, [urlItems, preset]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1.5 min-w-0">
          <CardTitle className="text-base">{preset.name}</CardTitle>
          {nameSegments.length > 0 && (
            <p className="text-sm truncate">
              {nameSegments.map((seg) => (
                <span
                  key={seg.key}
                  className={
                    seg.category ? CATEGORY_COLORS[seg.category].activeText : "text-foreground/50"
                  }
                >
                  {seg.text}
                </span>
              ))}
            </p>
          )}
          {valueSegments.length > 0 && (
            <p className="font-mono text-xs truncate">
              {valueSegments.map((seg) => (
                <span
                  key={seg.key}
                  className={
                    seg.category
                      ? CATEGORY_COLORS[seg.category].activeText
                      : "text-muted-foreground"
                  }
                >
                  {seg.text}
                </span>
              ))}
            </p>
          )}
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
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/builder?siteId=${preset.siteId}&presetId=${preset.id}`}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">편집</span>
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
