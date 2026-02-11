import type { Site } from "@/types/site";
import type { UrlItem } from "@/types/url-item";
import { getDB } from "../client";

/** 모든 사이트를 업데이트 시간 역순으로 조회합니다 */
export async function getAllSites(): Promise<Site[]> {
  const db = await getDB();
  const sites = await db.getAllFromIndex("sites", "by-updated");
  return sites.reverse();
}

/** ID로 사이트를 조회합니다 */
export async function getSiteById(id: string): Promise<Site | undefined> {
  const db = await getDB();
  return db.get("sites", id);
}

/** 사이트를 생성하고 기본 프로토콜(HTTPS, HTTP)을 자동 생성합니다 */
export async function createSite(site: Site): Promise<Site> {
  const db = await getDB();
  const now = new Date().toISOString();

  const defaultProtocols: UrlItem[] = [
    {
      id: crypto.randomUUID(),
      siteId: site.id,
      category: "protocol",
      name: "HTTPS",
      description: "보안 연결",
      value: "https",
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      siteId: site.id,
      category: "protocol",
      name: "HTTP",
      description: "일반 연결",
      value: "http",
      sortOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const tx = db.transaction(["sites", "url-items"], "readwrite");
  await tx.objectStore("sites").add(site);
  for (const protocol of defaultProtocols) {
    await tx.objectStore("url-items").add(protocol);
  }
  await tx.done;

  return site;
}

/** 사이트를 업데이트합니다 */
export async function updateSite(site: Site): Promise<Site> {
  const db = await getDB();
  await db.put("sites", site);
  return site;
}

/** 사이트와 연관된 url-items, 프리셋을 모두 삭제합니다 */
export async function deleteSite(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["sites", "url-items", "presets"], "readwrite");

  // 연관 url-items 삭제
  const urlItemIndex = tx.objectStore("url-items").index("by-site");
  let urlItemCursor = await urlItemIndex.openCursor(id);
  while (urlItemCursor) {
    await urlItemCursor.delete();
    urlItemCursor = await urlItemCursor.continue();
  }

  // 연관 프리셋 삭제
  const presetIndex = tx.objectStore("presets").index("by-site");
  let presetCursor = await presetIndex.openCursor(id);
  while (presetCursor) {
    await presetCursor.delete();
    presetCursor = await presetCursor.continue();
  }

  // 사이트 삭제
  await tx.objectStore("sites").delete(id);
  await tx.done;
}
