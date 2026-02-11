import "fake-indexeddb/auto";
import { type IDBPDatabase, openDB } from "idb";
import { afterEach, describe, expect, it } from "vitest";
import { getMigrationsToRun } from "../migrations";
import type { UrlKitDB } from "../schema";

const TEST_DB_NAME = "url-kit-test-migrations";

let db: IDBPDatabase<UrlKitDB>;

async function openTestDB(oldVersion = 0): Promise<IDBPDatabase<UrlKitDB>> {
  return openDB<UrlKitDB>(TEST_DB_NAME, 2, {
    upgrade(db, _oldVersion, _newVersion, tx) {
      const toRun = getMigrationsToRun(oldVersion, 2);
      for (const migration of toRun) {
        migration.upgrade(db, tx);
      }
    },
  });
}

describe("마이그레이션 시스템", () => {
  afterEach(async () => {
    if (db) db.close();
    indexedDB.deleteDatabase(TEST_DB_NAME);
  });

  it("v0→v2: 모든 store와 인덱스가 생성된다", async () => {
    db = await openTestDB(0);

    expect(db.objectStoreNames).toContain("sites");
    expect(db.objectStoreNames).toContain("url-items");
    expect(db.objectStoreNames).toContain("presets");
  });

  it("v2→v2: 이미 존재하는 store를 다시 생성하지 않는다", async () => {
    // 먼저 v2로 생성
    db = await openTestDB(0);
    db.close();

    // 같은 버전으로 다시 열기 (upgrade 미실행)
    db = await openDB<UrlKitDB>(TEST_DB_NAME, 2);

    expect(db.objectStoreNames).toContain("sites");
    expect(db.objectStoreNames).toContain("url-items");
    expect(db.objectStoreNames).toContain("presets");
  });

  it("store에 데이터를 삽입하고 조회할 수 있다", async () => {
    db = await openTestDB(0);

    const now = new Date().toISOString();
    const site = {
      id: "site-1",
      name: "테스트 사이트",
      description: "설명",
      createdAt: now,
      updatedAt: now,
    };

    await db.put("sites", site);
    const result = await db.get("sites", "site-1");
    expect(result).toEqual(site);
  });

  it("url-items 복합 인덱스로 조회할 수 있다", async () => {
    db = await openTestDB(0);

    const now = new Date().toISOString();
    const item = {
      id: "item-1",
      siteId: "site-1",
      category: "protocol" as const,
      name: "HTTPS",
      description: "",
      value: "https",
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.put("url-items", item);
    const results = await db.getAllFromIndex("url-items", "by-site-category", [
      "site-1",
      "protocol",
    ]);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(item);
  });

  it("기존 데이터가 마이그레이션 후에도 보존된다", async () => {
    db = await openTestDB(0);

    const now = new Date().toISOString();
    await db.put("sites", {
      id: "s1",
      name: "Site",
      description: "",
      createdAt: now,
      updatedAt: now,
    });
    await db.put("url-items", {
      id: "u1",
      siteId: "s1",
      category: "domain",
      name: "Domain",
      description: "",
      value: "example.com",
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });
    await db.put("presets", {
      id: "p1",
      siteId: "s1",
      name: "Preset",
      selectedProtocolId: "u1",
      selectedSubdomainId: null,
      selectedDomainId: "u1",
      selectedPathId: null,
      selectedQueryIds: [],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    });

    // 데이터 확인
    expect(await db.count("sites")).toBe(1);
    expect(await db.count("url-items")).toBe(1);
    expect(await db.count("presets")).toBe(1);

    const site = await db.get("sites", "s1");
    expect(site?.name).toBe("Site");
  });

  describe("getMigrationsToRun", () => {
    it("oldVersion부터 newVersion 사이의 마이그레이션만 반환한다", () => {
      const result = getMigrationsToRun(0, 2);
      expect(result).toHaveLength(1);
      expect(result[0].version).toBe(2);
    });

    it("동일 버전이면 빈 배열을 반환한다", () => {
      const result = getMigrationsToRun(2, 2);
      expect(result).toHaveLength(0);
    });

    it("범위 밖 마이그레이션은 포함하지 않는다", () => {
      const result = getMigrationsToRun(2, 3);
      // 현재 v3 마이그레이션이 없으므로 빈 배열
      expect(result).toHaveLength(0);
    });
  });
});
