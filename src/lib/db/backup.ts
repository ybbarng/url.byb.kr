import type { IDBPDatabase } from "idb";
import type { UrlKitDB } from "./schema";

const BACKUP_KEY = "url-kit-migration-backup";

export interface BackupData {
  timestamp: string;
  stores: Record<string, unknown[]>;
}

/** 모든 store 데이터를 JSON으로 내보내기 */
export async function exportAllData(db: IDBPDatabase<UrlKitDB>): Promise<BackupData> {
  const stores: Record<string, unknown[]> = {};

  for (const name of db.objectStoreNames) {
    const tx = db.transaction(name, "readonly");
    stores[name] = await tx.store.getAll();
    await tx.done;
  }

  return {
    timestamp: new Date().toISOString(),
    stores,
  };
}

/** 백업 데이터로 store 복원 */
export async function restoreData(db: IDBPDatabase<UrlKitDB>, backup: BackupData): Promise<void> {
  for (const [storeName, records] of Object.entries(backup.stores)) {
    if (!db.objectStoreNames.contains(storeName as "sites")) continue;

    const tx = db.transaction(storeName as "sites", "readwrite");
    await tx.store.clear();
    for (const record of records) {
      await tx.store.put(record as never);
    }
    await tx.done;
  }
}

/** localStorage에 백업 저장 */
export function saveBackupToLocalStorage(backup: BackupData): void {
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
  } catch {
    console.warn("[url-kit] 백업 저장 실패 (localStorage 용량 초과 가능)");
  }
}

/** localStorage에서 백업 로드 */
export function loadBackupFromLocalStorage(): BackupData | null {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BackupData;
  } catch {
    return null;
  }
}

/** localStorage 백업 삭제 */
export function clearBackupFromLocalStorage(): void {
  localStorage.removeItem(BACKUP_KEY);
}

/** BackupData를 JSON 파일로 다운로드 */
export function downloadAsJsonFile(data: BackupData): void {
  const date = new Date().toISOString().slice(0, 10);
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `url-kit-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** File 객체에서 BackupData 파싱 + 기본 검증 */
export async function readBackupFile(file: File): Promise<BackupData> {
  const text = await file.text();
  const data: unknown = JSON.parse(text);

  if (typeof data !== "object" || data === null || !("timestamp" in data) || !("stores" in data)) {
    throw new Error("유효하지 않은 백업 파일입니다.");
  }

  const backup = data as BackupData;

  if (typeof backup.timestamp !== "string" || typeof backup.stores !== "object") {
    throw new Error("백업 파일 형식이 올바르지 않습니다.");
  }

  return backup;
}
