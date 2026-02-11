"use client";

import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildUrl } from "@/lib/url";
import type { Site } from "@/types/site";

interface BuilderFormProps {
  site: Site;
  /** 프리셋 저장 콜백 */
  onSavePreset?: (config: {
    subdomain: string;
    pathValues: Record<string, string>;
    queryValues: Record<string, string>;
  }) => void;
}

/** 사이트의 구성요소를 선택해 URL을 빌드하는 폼 */
export function BuilderForm({ site, onSavePreset }: BuilderFormProps) {
  const [subdomain, setSubdomain] = useState("");
  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});

  const url = useMemo(
    () => buildUrl({ site, subdomain, pathValues, queryValues }),
    [site, subdomain, pathValues, queryValues],
  );

  const updatePathValue = (segmentId: string, value: string) => {
    setPathValues((prev) => ({ ...prev, [segmentId]: value }));
  };

  const updateQueryValue = (paramId: string, value: string) => {
    setQueryValues((prev) => ({ ...prev, [paramId]: value }));
  };

  const handleOpen = () => {
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* 서브도메인 선택 */}
      {site.subdomains.length > 0 && (
        <div className="space-y-2">
          <Label>서브도메인</Label>
          <Select value={subdomain} onValueChange={setSubdomain}>
            <SelectTrigger>
              <SelectValue placeholder="서브도메인 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">없음</SelectItem>
              {site.subdomains.map((sd) => (
                <SelectItem key={sd.id} value={sd.value}>
                  {sd.label} ({sd.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 경로 세그먼트 선택 */}
      {site.pathSegments
        .filter((seg) => seg.type === "dynamic")
        .map((segment) => (
          <div key={segment.id} className="space-y-2">
            <Label>{segment.label}</Label>
            {segment.options && segment.options.length > 0 ? (
              <Select
                value={pathValues[segment.id] ?? ""}
                onValueChange={(v) => updatePathValue(segment.id, v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`${segment.label} 선택`} />
                </SelectTrigger>
                <SelectContent>
                  {segment.options.map((opt) => (
                    <SelectItem key={opt.id} value={opt.value}>
                      {opt.label} ({opt.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder={`${segment.label} 입력`}
                value={pathValues[segment.id] ?? ""}
                onChange={(e) => updatePathValue(segment.id, e.target.value)}
              />
            )}
          </div>
        ))}

      {/* 쿼리 파라미터 선택 */}
      {site.queryParams.map((param) => (
        <div key={param.id} className="space-y-2">
          <Label>
            {param.label} <span className="text-xs text-muted-foreground">({param.key})</span>
          </Label>
          {param.options && param.options.length > 0 ? (
            <Select
              value={queryValues[param.id] ?? ""}
              onValueChange={(v) => updateQueryValue(param.id, v === "__none__" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`${param.label} 선택`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">없음</SelectItem>
                {param.options.map((opt) => (
                  <SelectItem key={opt.id} value={opt.value}>
                    {opt.label} ({opt.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              placeholder={`${param.label} 입력`}
              value={queryValues[param.id] ?? ""}
              onChange={(e) => updateQueryValue(param.id, e.target.value)}
            />
          )}
        </div>
      ))}

      {/* URL 미리보기 및 액션 */}
      <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
        <Label className="text-xs text-muted-foreground">빌드된 URL</Label>
        <p className="break-all font-mono text-sm">{url}</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleOpen} className="gap-1">
            <ExternalLink className="h-4 w-4" />새 탭에서 열기
          </Button>
          <CopyButton text={url} />
          {onSavePreset && (
            <Button
              variant="secondary"
              onClick={() =>
                onSavePreset({
                  subdomain: subdomain === "__none__" ? "" : subdomain,
                  pathValues,
                  queryValues,
                })
              }
            >
              프리셋으로 저장
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
