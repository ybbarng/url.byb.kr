"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Site } from "@/types/site";

interface SiteCardProps {
  site: Site;
  onDelete: (id: string) => void;
}

/** 사이트 목록에서 표시되는 카드 */
export function SiteCard({ site, onDelete }: SiteCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="space-y-1.5 min-w-0">
          <CardTitle className="text-base">{site.name}</CardTitle>
          {site.description && (
            <CardDescription className="text-sm">{site.description}</CardDescription>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button asChild size="sm">
            <Link href={`/builder?siteId=${site.id}`}>
              <ExternalLink className="h-4 w-4" />
              URL 빌더 열기
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
