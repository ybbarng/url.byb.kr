"use client";

import { ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UrlItemCategory } from "@/types/url-item";
import { CATEGORY_COLORS } from "../category-colors";

interface UrlPreviewProps {
  url: string;
  protocolValue: string | null;
  subdomainValue: string | null;
  domainValue: string | null;
  pathValue: string | null;
  queryValues: string[];
  onSavePreset: () => void;
}

function Part({
  value,
  placeholder,
  category,
  className,
}: {
  value: string | null;
  placeholder: string;
  category: UrlItemCategory;
  className?: string;
}) {
  const active = !!value;
  const colors = CATEGORY_COLORS[category];
  return (
    <span
      className={cn(
        "inline-block shrink-0 whitespace-nowrap rounded px-1 py-0.5 transition-colors",
        active ? `${colors.activeBg} ${colors.activeText}` : "text-muted-foreground/50",
        className,
      )}
    >
      {value || placeholder}
    </span>
  );
}

function Separator({ children, active }: { children: string; active: boolean }) {
  return (
    <span className={cn("font-mono", active ? "text-foreground/70" : "text-muted-foreground/30")}>
      {children}
    </span>
  );
}

/** 상단 URL 미리보기: URL 구조를 시각적으로 표현 */
export function UrlPreview({
  url,
  protocolValue,
  subdomainValue,
  domainValue,
  pathValue,
  queryValues,
  onSavePreset,
}: UrlPreviewProps) {
  const handleOpen = () => {
    window.open(url, "_blank");
  };

  const hasProtocol = !!protocolValue;
  const hasSubdomain = !!subdomainValue;
  const hasDomain = !!domainValue;
  const hasQuery = queryValues.length > 0;
  const queryString = queryValues.join("&");

  return (
    <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
      {/* URL 구조 시각화 */}
      <div className="flex items-center gap-0 overflow-hidden font-mono text-sm leading-relaxed">
        <Part value={protocolValue} placeholder="프로토콜" category="protocol" />
        <Separator active={hasProtocol}>://</Separator>
        <Part value={subdomainValue} placeholder="서브도메인" category="subdomain" />
        <Separator active={hasSubdomain}>.</Separator>
        <Part value={domainValue} placeholder="도메인" category="domain" />
        <Separator active={hasDomain}>/</Separator>
        <Part value={pathValue} placeholder="경로" category="path" />
        <Separator active={hasQuery}>?</Separator>
        <Part
          value={hasQuery ? queryString : null}
          placeholder="쿼리"
          category="query"
          className="shrink truncate min-w-0"
        />
      </div>

      {/* 실제 빌드된 URL */}
      {url && (
        <p className="break-all font-mono text-xs text-muted-foreground border-t pt-2">{url}</p>
      )}

      {/* 액션 버튼 */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleOpen} disabled={!url} className="gap-1">
          <ExternalLink className="h-4 w-4" />새 탭에서 열기
        </Button>
        <CopyButton text={url} />
        <Button variant="secondary" onClick={onSavePreset} disabled={!url}>
          프리셋으로 저장
        </Button>
      </div>
    </div>
  );
}
