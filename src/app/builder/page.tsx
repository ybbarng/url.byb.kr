"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { createPreset } from "@/lib/db/repositories/preset-repository";
import type { Preset } from "@/types/preset";

function BuilderContent() {
  const searchParams = useSearchParams();
  const initialSiteId = searchParams.get("siteId") ?? "";
  const { data: sites, isLoading } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState(initialSiteId);
  const [presetDialog, setPresetDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [pendingConfig, setPendingConfig] = useState<{
    subdomain: string;
    pathValues: Record<string, string>;
    queryValues: Record<string, string>;
  } | null>(null);

  const selectedSite = sites?.find((s) => s.id === selectedSiteId);

  const handleSavePreset = (config: {
    subdomain: string;
    pathValues: Record<string, string>;
    queryValues: Record<string, string>;
  }) => {
    setPendingConfig(config);
    setPresetName("");
    setPresetDialog(true);
  };

  const confirmSavePreset = async () => {
    if (!pendingConfig || !selectedSite || !presetName.trim()) return;

    const now = new Date().toISOString();
    const preset: Preset = {
      id: crypto.randomUUID(),
      siteId: selectedSite.id,
      name: presetName.trim(),
      selectedSubdomainId: pendingConfig.subdomain || null,
      selectedPathValues: pendingConfig.pathValues,
      selectedQueryValues: pendingConfig.queryValues,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };

    await createPreset(preset);
    toast.success("프리셋이 저장되었습니다");
    setPresetDialog(false);
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">불러오는 중...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">URL 빌더</h1>
        <p className="text-sm text-muted-foreground">
          사이트를 선택하고 구성요소를 조합해 URL을 빌드합니다
        </p>
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
      {selectedSite && <BuilderForm site={selectedSite} onSavePreset={handleSavePreset} />}

      {/* 프리셋 저장 다이얼로그 */}
      <Dialog open={presetDialog} onOpenChange={setPresetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프리셋 저장</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>프리셋 이름</Label>
              <Input
                placeholder="예: FE 웹앱 로그인버그 보드뷰"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmSavePreset()}
              />
            </div>
            <Button onClick={confirmSavePreset} disabled={!presetName.trim()}>
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
