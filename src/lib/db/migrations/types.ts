import type { IDBPDatabase, IDBPTransaction } from "idb";
import type { UrlKitDB } from "../schema";

/** 단일 마이그레이션 정의 */
export interface Migration {
  /** 이 마이그레이션이 적용되는 DB_VERSION */
  version: number;
  /** 마이그레이션 설명 */
  description: string;
  /** store 구조 변경 및 데이터 변환 수행 */
  upgrade(
    db: IDBPDatabase<UrlKitDB>,
    tx: IDBPTransaction<UrlKitDB, ArrayLike<StoreNames>, "versionchange">,
  ): void;
}

type StoreNames = "sites" | "url-items" | "presets";
