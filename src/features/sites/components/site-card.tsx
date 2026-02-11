"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Site } from "@/types/site";

interface SiteCardProps {
  site: Site;
  onDelete: (id: string) => void;
}

/** 사이트 목록에서 표시되는 카드 */
export function SiteCard({ site, onDelete }: SiteCardProps) {
  const subdomainCount = site.subdomains.length;
  const dynamicSegments = site.pathSegments.filter((s) => s.type === "dynamic").length;
  const queryCount = site.queryParams.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1.5 min-w-0">
          <CardTitle className="text-base">{site.name}</CardTitle>
          <CardDescription className="font-mono text-xs truncate">
            {site.protocol}://
            {subdomainCount > 0 ? "{서브도메인}." : ""}
            {site.domain}/...
          </CardDescription>
          <div className="flex flex-wrap gap-1 pt-1">
            {subdomainCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                서브도메인 {subdomainCount}개
              </Badge>
            )}
            {dynamicSegments > 0 && (
              <Badge variant="secondary" className="text-xs">
                동적 경로 {dynamicSegments}개
              </Badge>
            )}
            {queryCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                쿼리 {queryCount}개
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-1 shrink-0">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/builder?siteId=${site.id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/sites/edit?id=${site.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(site.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
