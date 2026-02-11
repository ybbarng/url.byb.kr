"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  className?: string;
}

/** 텍스트를 클립보드에 복사하는 버튼 */
export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} disabled={!text} className={className}>
      {copied ? (
        <>
          <Check className="mr-1 h-4 w-4" />
          복사됨
        </>
      ) : (
        <>
          <Copy className="mr-1 h-4 w-4" />
          복사
        </>
      )}
    </Button>
  );
}
