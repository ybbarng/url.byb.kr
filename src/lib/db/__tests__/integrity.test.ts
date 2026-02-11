import "fake-indexeddb/auto";
import { type IDBPDatabase, openDB } from "idb";
import { afterEach, describe, expect, it } from "vitest";
import { validateIntegrity } from "../integrity";
import { getMigrationsToRun } from "../migrations";
import type { UrlKitDB } from "../schema";

const TEST_DB_NAME = "url-kit-test-integrity";

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

describe("데이터 무결성 검증", () => {
  afterEach(async () => {
    if (db) db.close();
    indexedDB.deleteDatabase(TEST_DB_NAME);
  });

  it("정상 데이터는 검증을 통과한다", async () => {
    db = await createTestDB();

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
      category: "protocol",
      name: "HTTPS",
      description: "",
      value: "https",
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });
    await db.put("url-items", {
      id: "u2",
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
      selectedDomainId: "u2",
      selectedPathId: null,
      selectedQueryIds: [],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    });

    const result = await validateIntegrity(db);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("고아 UrlItem (존재하지 않는 siteId)을 감지한다", async () => {
    db = await createTestDB();

    await db.put("url-items", {
      id: "u1",
      siteId: "non-existent-site",
      category: "domain",
      name: "Domain",
      description: "",
      value: "example.com",
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });

    const result = await validateIntegrity(db);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("non-existent-site"))).toBe(true);
  });

  it("고아 Preset (존재하지 않는 siteId)을 감지한다", async () => {
    db = await createTestDB();

    await db.put("presets", {
      id: "p1",
      siteId: "non-existent-site",
      name: "Preset",
      selectedProtocolId: "u1",
      selectedSubdomainId: null,
      selectedDomainId: "u2",
      selectedPathId: null,
      selectedQueryIds: [],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    });

    const result = await validateIntegrity(db);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("non-existent-site"))).toBe(true);
  });

  it("유효하지 않은 selectedProtocolId를 감지한다", async () => {
    db = await createTestDB();

    await db.put("sites", {
      id: "s1",
      name: "Site",
      description: "",
      createdAt: now,
      updatedAt: now,
    });
    await db.put("presets", {
      id: "p1",
      siteId: "s1",
      name: "Preset",
      selectedProtocolId: "invalid-id",
      selectedSubdomainId: null,
      selectedDomainId: "invalid-id",
      selectedPathId: null,
      selectedQueryIds: [],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    });

    const result = await validateIntegrity(db);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("selectedProtocolId"))).toBe(true);
  });

  it("유효하지 않은 selectedQueryIds를 감지한다", async () => {
    db = await createTestDB();

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
      category: "protocol",
      name: "HTTPS",
      description: "",
      value: "https",
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    });
    await db.put("url-items", {
      id: "u2",
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
      selectedDomainId: "u2",
      selectedPathId: null,
      selectedQueryIds: ["non-existent-query"],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    });

    const result = await validateIntegrity(db);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("selectedQueryIds"))).toBe(true);
  });

  it("빈 데이터베이스는 검증을 통과한다", async () => {
    db = await createTestDB();

    const result = await validateIntegrity(db);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
