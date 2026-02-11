import type { Site } from "@/types/site";
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

/** 사이트를 생성합니다 */
export async function createSite(site: Site): Promise<Site> {
  const db = await getDB();
  await db.add("sites", site);
  return site;
}

/** 사이트를 업데이트합니다 */
export async function updateSite(site: Site): Promise<Site> {
  const db = await getDB();
  await db.put("sites", site);
  return site;
}

/** 사이트와 연관된 프리셋을 모두 삭제합니다 */
export async function deleteSite(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["sites", "presets"], "readwrite");

  // 연관 프리셋 삭제
  const presetIndex = tx.objectStore("presets").index("by-site");
  let cursor = await presetIndex.openCursor(id);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }

  // 사이트 삭제
  await tx.objectStore("sites").delete(id);
  await tx.done;
}
