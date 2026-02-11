"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  className?: string;
  iconOnly?: boolean;
}

/** 텍스트를 클립보드에 복사하는 버튼 */
export function CopyButton({ text, className, iconOnly }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (iconOnly) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        disabled={!text}
        className={className}
        aria-label={copied ? "복사됨" : "복사"}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleCopy} disabled={!text} className={className}>
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
