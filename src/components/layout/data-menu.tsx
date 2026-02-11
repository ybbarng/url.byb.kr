"use client";

import { Database, Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type BackupData,
  downloadAsJsonFile,
  exportAllData,
  readBackupFile,
  restoreData,
} from "@/lib/db/backup";
import { getDB } from "@/lib/db/client";
import { validateIntegrity } from "@/lib/db/integrity";

export function DataMenu() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<BackupData | null>(null);

  const handleExport = async () => {
    try {
      const db = await getDB();
      const data = await exportAllData(db);
      downloadAsJsonFile(data);
      toast.success("데이터를 내보냈습니다.");
    } catch (error) {
      console.error("[url-kit] 내보내기 실패:", error);
      toast.error("데이터 내보내기에 실패했습니다.");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 같은 파일을 다시 선택할 수 있도록 초기화
    e.target.value = "";

    try {
      const backup = await readBackupFile(file);
      setPendingBackup(backup);
      setConfirmOpen(true);
    } catch (error) {
      console.error("[url-kit] 파일 읽기 실패:", error);
      toast.error(error instanceof Error ? error.message : "파일을 읽을 수 없습니다.");
    }
  };

  const handleConfirmRestore = async () => {
    if (!pendingBackup) return;

    try {
      const db = await getDB();
      await restoreData(db, pendingBackup);
      const result = await validateIntegrity(db);

      if (!result.valid) {
        console.warn("[url-kit] 무결성 경고:", result.errors);
        toast.warning("데이터를 복원했지만 일부 무결성 문제가 있습니다.");
      } else {
        toast.success("데이터를 성공적으로 가져왔습니다.");
      }

      setConfirmOpen(false);
      setPendingBackup(null);
      window.location.reload();
    } catch (error) {
      console.error("[url-kit] 복원 실패:", error);
      toast.error("데이터 가져오기에 실패했습니다.");
    }
  };

  const storeNames = pendingBackup ? Object.keys(pendingBackup.stores) : [];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="데이터 관리">
            <Database className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleExport}>
            <Download className="h-4 w-4" />
            데이터 내보내기
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleImportClick}>
            <Upload className="h-4 w-4" />
            데이터 가져오기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>데이터 가져오기</DialogTitle>
            <DialogDescription>
              기존 데이터가 백업 파일의 데이터로 교체됩니다. 계속하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          {pendingBackup && (
            <div className="text-sm text-muted-foreground">
              <p>백업 시각: {new Date(pendingBackup.timestamp).toLocaleString()}</p>
              <p>포함된 데이터: {storeNames.join(", ")}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              취소
            </Button>
            <Button onClick={handleConfirmRestore}>가져오기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
