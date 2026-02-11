import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">URL Kit</span> — URL 구성요소를 관리하고
          조합하는 도구
        </p>
        <p className="flex items-center gap-1">
          Implemented with <Heart className="h-3 w-3 text-red-500" /> by ybbarng & Claude
        </p>
      </div>
    </footer>
  );
}
