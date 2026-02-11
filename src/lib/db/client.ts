import { type IDBPDatabase, openDB } from "idb";
import { DB_NAME, DB_VERSION, type UrlKitDB } from "./schema";

let dbInstance: IDBPDatabase<UrlKitDB> | null = null;

/** IndexedDB 연결을 반환합니다 (싱글톤) */
export async function getDB(): Promise<IDBPDatabase<UrlKitDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<UrlKitDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // sites 스토어
      if (!db.objectStoreNames.contains("sites")) {
        const siteStore = db.createObjectStore("sites", { keyPath: "id" });
        siteStore.createIndex("by-name", "name");
        siteStore.createIndex("by-updated", "updatedAt");
      }

      // presets 스토어
      if (!db.objectStoreNames.contains("presets")) {
        const presetStore = db.createObjectStore("presets", { keyPath: "id" });
        presetStore.createIndex("by-site", "siteId");
        presetStore.createIndex("by-favorite", "isFavorite");
        presetStore.createIndex("by-updated", "updatedAt");
      }
    },
  });

  return dbInstance;
}
