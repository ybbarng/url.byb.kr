import type { UrlItem, UrlItemCategory } from "@/types/url-item";
import { getDB } from "../client";

/** 특정 사이트의 특정 카테고리 아이템을 sortOrder 순으로 조회합니다 */
export async function getUrlItemsBySiteAndCategory(
  siteId: string,
  category: UrlItemCategory,
): Promise<UrlItem[]> {
  const db = await getDB();
  const items = await db.getAllFromIndex("url-items", "by-site-category", [siteId, category]);
  return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

/** 특정 사이트의 모든 아이템을 조회합니다 */
export async function getUrlItemsBySite(siteId: string): Promise<UrlItem[]> {
  const db = await getDB();
  return db.getAllFromIndex("url-items", "by-site", siteId);
}

/** ID로 아이템을 조회합니다 */
export async function getUrlItemById(id: string): Promise<UrlItem | undefined> {
  const db = await getDB();
  return db.get("url-items", id);
}

/** 아이템을 생성합니다 */
export async function createUrlItem(item: UrlItem): Promise<UrlItem> {
  const db = await getDB();
  await db.add("url-items", item);
  return item;
}

/** 아이템을 업데이트합니다 */
export async function updateUrlItem(item: UrlItem): Promise<UrlItem> {
  const db = await getDB();
  await db.put("url-items", item);
  return item;
}

/** 아이템을 삭제합니다 */
export async function deleteUrlItem(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("url-items", id);
}

/** 특정 사이트의 모든 아이템을 삭제합니다 */
export async function deleteUrlItemsBySite(siteId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("url-items", "readwrite");
  const index = tx.store.index("by-site");
  let cursor = await index.openCursor(siteId);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}
