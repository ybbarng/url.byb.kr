"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { createPreset } from "@/lib/db/repositories/preset-repository";
import { buildUrl } from "@/lib/url";
import type { Preset } from "@/types/preset";
import type { UrlItem, UrlItemCategory } from "@/types/url-item";
import { useUrlItems } from "../hooks/use-url-items";
import { PresetSaveDialog } from "./preset-save-dialog";
import { UrlColumn } from "./url-column";
import { UrlPreview } from "./url-preview";

interface BuilderFormProps {
  siteId: string;
}

interface SelectionState {
  protocolId: string | null;
  subdomainId: string | null;
  domainId: string | null;
  pathId: string | null;
  queryIds: string[];
}

/** 사이트의 구성요소를 구성하고 선택해 URL을 빌드하는 폼 */
export function BuilderForm({ siteId }: BuilderFormProps) {
  const { data: allItems } = useUrlItems(siteId);
  const [selection, setSelection] = useState<SelectionState>({
    protocolId: null,
    subdomainId: null,
    domainId: null,
    pathId: null,
    queryIds: [],
  });
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);

  // 카테고리별 아이템 분류
  const itemsByCategory = useMemo(() => {
    const map: Record<UrlItemCategory, UrlItem[]> = {
      protocol: [],
      subdomain: [],
      domain: [],
      path: [],
      query: [],
    };
    for (const item of allItems ?? []) {
      map[item.category].push(item);
    }
    // sortOrder로 정렬
    for (const category of Object.keys(map) as UrlItemCategory[]) {
      map[category].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return map;
  }, [allItems]);

  // 첫 프로토콜 자동 선택
  const effectiveProtocolId = selection.protocolId ?? itemsByCategory.protocol[0]?.id ?? null;

  // 아이템 ID → UrlItem 매핑
  const itemMap = useMemo(() => {
    const map = new Map<string, UrlItem>();
    for (const item of allItems ?? []) {
      map.set(item.id, item);
    }
    return map;
  }, [allItems]);

  // URL 빌드
  const url = useMemo(() => {
    const protocol = effectiveProtocolId ? itemMap.get(effectiveProtocolId) : null;
    const domain = selection.domainId ? itemMap.get(selection.domainId) : null;

    if (!protocol || !domain) return "";

    return buildUrl({
      protocol,
      subdomain: selection.subdomainId ? (itemMap.get(selection.subdomainId) ?? null) : null,
      domain,
      path: selection.pathId ? (itemMap.get(selection.pathId) ?? null) : null,
      queries: selection.queryIds
        .map((id) => itemMap.get(id))
        .filter((item): item is UrlItem => !!item),
    });
  }, [effectiveProtocolId, selection, itemMap]);

  const handleSelect = useCallback(
    (category: UrlItemCategory) => (item: UrlItem) => {
      setSelection((prev) => {
        switch (category) {
          case "protocol":
            return { ...prev, protocolId: prev.protocolId === item.id ? null : item.id };
          case "subdomain":
            return { ...prev, subdomainId: prev.subdomainId === item.id ? null : item.id };
          case "domain":
            return { ...prev, domainId: prev.domainId === item.id ? null : item.id };
          case "path":
            return { ...prev, pathId: prev.pathId === item.id ? null : item.id };
          case "query": {
            const has = prev.queryIds.includes(item.id);
            return {
              ...prev,
              queryIds: has
                ? prev.queryIds.filter((id) => id !== item.id)
                : [...prev.queryIds, item.id],
            };
          }
        }
      });
    },
    [],
  );

  const handleSavePreset = async (name: string) => {
    if (!effectiveProtocolId || !selection.domainId) {
      toast.error("프로토콜과 도메인은 필수입니다");
      return;
    }

    const now = new Date().toISOString();
    const preset: Preset = {
      id: crypto.randomUUID(),
      siteId,
      name,
      selectedProtocolId: effectiveProtocolId,
      selectedSubdomainId: selection.subdomainId,
      selectedDomainId: selection.domainId,
      selectedPathId: selection.pathId,
      selectedQueryIds: selection.queryIds,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };

    await createPreset(preset);
    toast.success("프리셋이 저장되었습니다");
    setPresetDialogOpen(false);
  };

  const getSelectedIds = (category: UrlItemCategory): string[] => {
    switch (category) {
      case "protocol":
        return effectiveProtocolId ? [effectiveProtocolId] : [];
      case "subdomain":
        return selection.subdomainId ? [selection.subdomainId] : [];
      case "domain":
        return selection.domainId ? [selection.domainId] : [];
      case "path":
        return selection.pathId ? [selection.pathId] : [];
      case "query":
        return selection.queryIds;
    }
  };

  const categories: UrlItemCategory[] = ["protocol", "subdomain", "domain", "path", "query"];

  return (
    <div className="space-y-6">
      {/* URL 미리보기 */}
      <UrlPreview
        url={url}
        protocolValue={
          effectiveProtocolId ? (itemMap.get(effectiveProtocolId)?.value ?? null) : null
        }
        subdomainValue={
          selection.subdomainId ? (itemMap.get(selection.subdomainId)?.value ?? null) : null
        }
        domainValue={selection.domainId ? (itemMap.get(selection.domainId)?.value ?? null) : null}
        pathValue={selection.pathId ? (itemMap.get(selection.pathId)?.value ?? null) : null}
        queryValues={selection.queryIds
          .map((id) => itemMap.get(id)?.value)
          .filter((v): v is string => !!v)}
        onSavePreset={() => setPresetDialogOpen(true)}
      />

      {/* 5 컬럼 그리드 */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <UrlColumn
            key={category}
            siteId={siteId}
            category={category}
            selectedIds={getSelectedIds(category)}
            onSelect={handleSelect(category)}
          />
        ))}
      </div>

      {/* 프리셋 저장 다이얼로그 */}
      <PresetSaveDialog
        open={presetDialogOpen}
        onOpenChange={setPresetDialogOpen}
        onSave={handleSavePreset}
      />
    </div>
  );
}
