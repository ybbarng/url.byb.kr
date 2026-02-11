import "fake-indexeddb/auto";
import { type IDBPDatabase, openDB } from "idb";
import { afterEach, describe, expect, it } from "vitest";
import { exportAllData, restoreData } from "../backup";
import { getMigrationsToRun } from "../migrations";
import type { UrlKitDB } from "../schema";

const TEST_DB_NAME = "url-kit-test-backup";

let db: IDBPDatabase<UrlKitDB>;

async function createTestDB(): Promise<IDBPDatabase<UrlKitDB>> {
  return openDB<UrlKitDB>(TEST_DB_NAME, 2, {
    upgrade(db, _oldVersion, _newVersion, tx) {
      for (const m of getMigrationsToRun(0, 2)) {
        m.upgrade(db, tx);
      }
    },
  });
}

const now = new Date().toISOString();

describe("백업 및 복원", () => {
  afterEach(async () => {
    if (db) db.close();
    indexedDB.deleteDatabase(TEST_DB_NAME);
  });

  it("내보내기 → 가져오기 후 데이터가 동일하다", async () => {
    db = await createTestDB();

    // 테스트 데이터 삽입
    await db.put("sites", {
      id: "s1",
      name: "Site 1",
      description: "설명",
      createdAt: now,
      updatedAt: now,
    });
    await db.put("sites", {
      id: "s2",
      name: "Site 2",
      description: "",
      createdAt: now,
      updatedAt: now,
    });
    await db.put("url-items", {
      id: "u1",
      siteId: "s1",
      category: "protocol",
      name: "HTTPS",
      description: "",
      value: "https",
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
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    });

    // 내보내기
    const backup = await exportAllData(db);

    expect(backup.timestamp).toBeDefined();
    expect(backup.stores.sites).toHaveLength(2);
    expect(backup.stores["url-items"]).toHaveLength(1);
    expect(backup.stores.presets).toHaveLength(1);

    // 데이터 삭제
    const txSites = db.transaction("sites", "readwrite");
    await txSites.store.clear();
    await txSites.done;
    const txItems = db.transaction("url-items", "readwrite");
    await txItems.store.clear();
    await txItems.done;
    const txPresets = db.transaction("presets", "readwrite");
    await txPresets.store.clear();
    await txPresets.done;

    expect(await db.count("sites")).toBe(0);

    // 복원
    await restoreData(db, backup);

    expect(await db.count("sites")).toBe(2);
    expect(await db.count("url-items")).toBe(1);
    expect(await db.count("presets")).toBe(1);

    const site = await db.get("sites", "s1");
    expect(site?.name).toBe("Site 1");

    const preset = await db.get("presets", "p1");
    expect(preset?.isFavorite).toBe(true);
  });

  it("빈 데이터베이스 내보내기가 정상 동작한다", async () => {
    db = await createTestDB();

    const backup = await exportAllData(db);

    expect(backup.stores.sites).toHaveLength(0);
    expect(backup.stores["url-items"]).toHaveLength(0);
    expect(backup.stores.presets).toHaveLength(0);
  });

  it("존재하지 않는 store는 복원 시 건너뛴다", async () => {
    db = await createTestDB();

    const backup = {
      timestamp: now,
      stores: {
        sites: [{ id: "s1", name: "Site", description: "", createdAt: now, updatedAt: now }],
        "non-existent-store": [{ id: "x" }],
      },
    };

    // 에러 없이 복원 완료
    await restoreData(db, backup);

    expect(await db.count("sites")).toBe(1);
  });
});
