import type { Preset } from "@/types/preset";
import { getDB } from "../client";

/** 모든 프리셋을 업데이트 시간 역순으로 조회합니다 */
export async function getAllPresets(): Promise<Preset[]> {
  const db = await getDB();
  const presets = await db.getAllFromIndex("presets", "by-updated");
  return presets.reverse();
}

/** 특정 사이트의 프리셋을 조회합니다 */
export async function getPresetsBySiteId(siteId: string): Promise<Preset[]> {
  const db = await getDB();
  return db.getAllFromIndex("presets", "by-site", siteId);
}

/** 즐겨찾기 프리셋만 조회합니다 */
export async function getFavoritePresets(): Promise<Preset[]> {
  const db = await getDB();
  // isFavorite를 문자열 "true"로 인덱싱하기 어려우므로 전체에서 필터
  const all = await db.getAll("presets");
  return all.filter((p) => p.isFavorite);
}

/** ID로 프리셋을 조회합니다 */
export async function getPresetById(id: string): Promise<Preset | undefined> {
  const db = await getDB();
  return db.get("presets", id);
}

/** 프리셋을 생성합니다 */
export async function createPreset(preset: Preset): Promise<Preset> {
  const db = await getDB();
  await db.add("presets", preset);
  return preset;
}

/** 프리셋을 업데이트합니다 */
export async function updatePreset(preset: Preset): Promise<Preset> {
  const db = await getDB();
  await db.put("presets", preset);
  return preset;
}

/** 프리셋을 삭제합니다 */
export async function deletePreset(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("presets", id);
}
