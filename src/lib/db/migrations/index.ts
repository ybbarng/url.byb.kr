import type { Migration } from "./types";

/** 버전별 마이그레이션 목록 (순서대로 실행) */
export const migrations: Migration[] = [
  {
    version: 2,
    description: "sites, url-items, presets 스토어 및 인덱스 생성",
    upgrade(db) {
      // sites 스토어
      if (!db.objectStoreNames.contains("sites")) {
        const siteStore = db.createObjectStore("sites", { keyPath: "id" });
        siteStore.createIndex("by-name", "name");
        siteStore.createIndex("by-updated", "updatedAt");
      }

      // url-items 스토어
      if (!db.objectStoreNames.contains("url-items")) {
        const urlItemStore = db.createObjectStore("url-items", {
          keyPath: "id",
        });
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
  },
];

/** oldVersion부터 newVersion까지 적용할 마이그레이션 필터링 */
export function getMigrationsToRun(oldVersion: number, newVersion: number): Migration[] {
  return migrations.filter((m) => m.version > oldVersion && m.version <= newVersion);
}
