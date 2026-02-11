"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
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
import type { PathSegment } from "@/types/site";
import { OptionListEditor } from "./option-list-editor";

interface PathSegmentEditorProps {
  segments: PathSegment[];
  onChange: (segments: PathSegment[]) => void;
}

/** 경로 세그먼트 목록을 관리하는 편집기 */
export function PathSegmentEditor({ segments, onChange }: PathSegmentEditorProps) {
  const addSegment = (type: "static" | "dynamic") => {
    const newSegment: PathSegment = {
      id: crypto.randomUUID(),
      type,
      label: "",
      ...(type === "static" ? { value: "" } : { options: [] }),
    };
    onChange([...segments, newSegment]);
  };

  const updateSegment = (id: string, updates: Partial<PathSegment>) => {
    onChange(segments.map((seg) => (seg.id === id ? { ...seg, ...updates } : seg)));
  };

  const removeSegment = (id: string) => {
    onChange(segments.filter((seg) => seg.id !== id));
  };

  // 간단한 드래그 없이 위/아래 이동
  const moveSegment = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= segments.length) return;
    const updated = [...segments];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {segments.map((segment, index) => (
        <div key={segment.id} className="rounded-lg border p-3 space-y-3">
          <div className="flex items-center gap-2">
            {/* 순서 조작 */}
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => moveSegment(index, -1)}
                disabled={index === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs"
                aria-label="위로"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            </div>

            <Select
              value={segment.type}
              onValueChange={(value: "static" | "dynamic") =>
                updateSegment(segment.id, {
                  type: value,
                  ...(value === "static"
                    ? { value: "", options: undefined }
                    : { value: undefined, options: [] }),
                })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">정적</SelectItem>
                <SelectItem value="dynamic">동적</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="이름 (예: 팀, 이슈 번호)"
              value={segment.label}
              onChange={(e) => updateSegment(segment.id, { label: e.target.value })}
              className="flex-1"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeSegment(segment.id)}
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {segment.type === "static" ? (
            <div className="pl-10">
              <Label className="text-xs text-muted-foreground">고정 값</Label>
              <Input
                placeholder="예: posts, issues, v2"
                value={segment.value ?? ""}
                onChange={(e) => updateSegment(segment.id, { value: e.target.value })}
              />
            </div>
          ) : (
            <div className="pl-10 space-y-2">
              <Label className="text-xs text-muted-foreground">옵션 목록</Label>
              <OptionListEditor
                options={segment.options ?? []}
                onChange={(options) => updateSegment(segment.id, { options })}
                labelPlaceholder="표시 이름 (예: 프론트엔드)"
                valuePlaceholder="값 (예: frontend)"
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addSegment("static")}
          className="gap-1"
        >
          <Plus className="h-3 w-3" />
          정적 세그먼트
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addSegment("dynamic")}
          className="gap-1"
        >
          <Plus className="h-3 w-3" />
          동적 세그먼트
        </Button>
      </div>
    </div>
  );
}
