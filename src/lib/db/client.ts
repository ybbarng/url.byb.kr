import { type IDBPDatabase, openDB } from "idb";
import { DB_NAME, DB_VERSION, type UrlKitDB } from "./schema";

let dbInstance: IDBPDatabase<UrlKitDB> | null = null;

/** IndexedDB 연결을 반환합니다 (싱글톤) */
export async function getDB(): Promise<IDBPDatabase<UrlKitDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<UrlKitDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // v1→v2: 기존 stores 삭제 후 재생성 (데이터 모델 근본 변경)
      if (oldVersion < 2) {
        // 기존 stores 삭제
        for (const name of db.objectStoreNames) {
          db.deleteObjectStore(name);
        }
      }

      // sites 스토어
      if (!db.objectStoreNames.contains("sites")) {
        const siteStore = db.createObjectStore("sites", { keyPath: "id" });
        siteStore.createIndex("by-name", "name");
        siteStore.createIndex("by-updated", "updatedAt");
      }

      // url-items 스토어
      if (!db.objectStoreNames.contains("url-items")) {
        const urlItemStore = db.createObjectStore("url-items", { keyPath: "id" });
        urlItemStore.createIndex("by-site", "siteId");
        urlItemStore.createIndex("by-site-category", ["siteId", "category"]);
        urlItemStore.createIndex("by-updated", "updatedAt");
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
