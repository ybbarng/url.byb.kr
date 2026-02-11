"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ParsedUrl } from "@/lib/parse-url";
import { parseUrl } from "@/lib/parse-url";

interface UrlParseInputProps {
  onParse: (parsed: ParsedUrl) => void;
}

/** URL을 붙여넣어 자동 파싱하는 입력 컴포넌트 */
export function UrlParseInput({ onParse }: UrlParseInputProps) {
  const [value, setValue] = useState("");

  const handleParse = () => {
    const result = parseUrl(value);
    if (result.success) {
      onParse(result.data);
      setValue("");
      toast.success("URL이 파싱되었습니다");
    } else {
      toast.error(result.error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleParse();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="URL을 붙여넣으세요 (예: https://blog.example.com/path?query=1)"
        className="flex-1"
      />
      <Button type="button" variant="secondary" onClick={handleParse}>
        파싱
      </Button>
    </div>
  );
}
