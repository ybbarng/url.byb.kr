"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Option } from "@/types/site";

interface OptionListEditorProps {
  options: Option[];
  onChange: (options: Option[]) => void;
  labelPlaceholder?: string;
  valuePlaceholder?: string;
}

/** 이름-값 옵션 목록을 추가/수정/삭제하는 편집기 */
export function OptionListEditor({
  options,
  onChange,
  labelPlaceholder = "표시 이름",
  valuePlaceholder = "값",
}: OptionListEditorProps) {
  const addOption = () => {
    onChange([...options, { id: crypto.randomUUID(), label: "", value: "" }]);
  };

  const updateOption = (id: string, field: "label" | "value", newValue: string) => {
    onChange(options.map((opt) => (opt.id === id ? { ...opt, [field]: newValue } : opt)));
  };

  const removeOption = (id: string) => {
    onChange(options.filter((opt) => opt.id !== id));
  };

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <div key={opt.id} className="flex items-center gap-2">
          <Input
            placeholder={labelPlaceholder}
            value={opt.label}
            onChange={(e) => updateOption(opt.id, "label", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder={valuePlaceholder}
            value={opt.value}
            onChange={(e) => updateOption(opt.id, "value", e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeOption(opt.id)}
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-1">
        <Plus className="h-3 w-3" />
        추가
      </Button>
    </div>
  );
}
