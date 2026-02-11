"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSites } from "@/features/sites/hooks/use-sites";
import { BuilderForm } from "@/features/url-builder/components/builder-form";

function BuilderContent() {
  const searchParams = useSearchParams();
  const initialSiteId = searchParams.get("siteId") ?? "";
  const { data: sites, isLoading } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState(initialSiteId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">불러오는 중...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">URL 빌더</h1>
        <p className="text-sm text-muted-foreground">구성요소를 추가하고 선택해 URL을 빌드합니다</p>
      </div>

      {/* 사이트 선택 */}
      <div className="space-y-2">
        <Label>사이트</Label>
        {sites?.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            등록된 사이트가 없습니다. 먼저 사이트를 등록해주세요.
          </p>
        ) : (
          <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
            <SelectTrigger>
              <SelectValue placeholder="사이트 선택" />
            </SelectTrigger>
            <SelectContent>
              {sites?.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 빌더 폼 */}
      {selectedSiteId && <BuilderForm key={selectedSiteId} siteId={selectedSiteId} />}
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">불러오는 중...</p>}>
      <BuilderContent />
    </Suspense>
  );
}
