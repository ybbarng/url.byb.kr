"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QueryParamTemplate } from "@/types/site";
import { OptionListEditor } from "./option-list-editor";

interface QueryParamEditorProps {
  params: QueryParamTemplate[];
  onChange: (params: QueryParamTemplate[]) => void;
}

/** 쿼리 파라미터 템플릿 목록을 관리하는 편집기 */
export function QueryParamEditor({ params, onChange }: QueryParamEditorProps) {
  const addParam = () => {
    onChange([...params, { id: crypto.randomUUID(), key: "", label: "", options: [] }]);
  };

  const updateParam = (id: string, updates: Partial<QueryParamTemplate>) => {
    onChange(params.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const removeParam = (id: string) => {
    onChange(params.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      {params.map((param) => (
        <div key={param.id} className="rounded-lg border p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="키 (예: lang, view)"
              value={param.key}
              onChange={(e) => updateParam(param.id, { key: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="표시 이름 (예: 언어, 보기 방식)"
              value={param.label}
              onChange={(e) => updateParam(param.id, { label: e.target.value })}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeParam(param.id)}
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">값 옵션 (비어있으면 자유 입력)</Label>
            <OptionListEditor
              options={param.options ?? []}
              onChange={(options) => updateParam(param.id, { options })}
              labelPlaceholder="표시 이름 (예: 한국어)"
              valuePlaceholder="값 (예: ko)"
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addParam} className="gap-1">
        <Plus className="h-3 w-3" />
        쿼리 파라미터
      </Button>
    </div>
  );
}
