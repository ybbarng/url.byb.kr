import type { IDBPDatabase } from "idb";
import type { UrlKitDB } from "./schema";

const BACKUP_KEY = "url-kit-migration-backup";

interface BackupData {
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
