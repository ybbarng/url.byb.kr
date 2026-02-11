import type { IDBPDatabase } from "idb";
import type { Preset } from "@/types/preset";
import type { UrlKitDB } from "./schema";

interface IntegrityResult {
  valid: boolean;
  errors: string[];
}

/** 마이그레이션 후 데이터 무결성 검증 */
export async function validateIntegrity(db: IDBPDatabase<UrlKitDB>): Promise<IntegrityResult> {
  const errors: string[] = [];

  const sites = await db.getAll("sites");
  const urlItems = await db.getAll("url-items");
  const presets = await db.getAll("presets");

  const siteIds = new Set(sites.map((s) => s.id));
  const urlItemIds = new Set(urlItems.map((u) => u.id));

  // UrlItem의 siteId가 존재하는 Site를 참조하는지
  for (const item of urlItems) {
    if (!item.siteId || !siteIds.has(item.siteId)) {
      errors.push(`UrlItem "${item.id}"의 siteId "${item.siteId}"가 유효하지 않음`);
    }
    if (!item.id) {
      errors.push("UrlItem에 id가 누락됨");
    }
  }

  // Preset의 참조 무결성 검증
  for (const preset of presets) {
    if (!preset.siteId || !siteIds.has(preset.siteId)) {
      errors.push(`Preset "${preset.id}"의 siteId "${preset.siteId}"가 유효하지 않음`);
    }
    validatePresetUrlItemRef(preset, "selectedProtocolId", urlItemIds, errors);
    validatePresetUrlItemRef(preset, "selectedDomainId", urlItemIds, errors);
    validatePresetOptionalRef(preset, "selectedSubdomainId", urlItemIds, errors);
    validatePresetOptionalRef(preset, "selectedPathId", urlItemIds, errors);

    if (preset.selectedQueryIds) {
      for (const qid of preset.selectedQueryIds) {
        if (!urlItemIds.has(qid)) {
          errors.push(`Preset "${preset.id}"의 selectedQueryIds에 유효하지 않은 UrlItem "${qid}"`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.warn("[url-kit] 데이터 무결성 검증 실패:", errors);
  }

  return { valid: errors.length === 0, errors };
}

function validatePresetUrlItemRef(
  preset: Preset,
  field: "selectedProtocolId" | "selectedDomainId",
  urlItemIds: Set<string>,
  errors: string[],
): void {
  const value = preset[field];
  if (!value || !urlItemIds.has(value)) {
    errors.push(`Preset "${preset.id}"의 ${field} "${value}"가 유효하지 않음`);
  }
}

function validatePresetOptionalRef(
  preset: Preset,
  field: "selectedSubdomainId" | "selectedPathId",
  urlItemIds: Set<string>,
  errors: string[],
): void {
  const value = preset[field];
  if (value !== null && value !== undefined && !urlItemIds.has(value)) {
    errors.push(`Preset "${preset.id}"의 ${field} "${value}"가 유효하지 않음`);
  }
}
