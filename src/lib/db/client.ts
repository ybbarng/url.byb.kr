import { type IDBPDatabase, openDB } from "idb";
import { getMigrationsToRun } from "./migrations";
import { DB_NAME, DB_VERSION, type UrlKitDB } from "./schema";

let dbInstance: IDBPDatabase<UrlKitDB> | null = null;

/** IndexedDB 연결을 반환합니다 (싱글톤) */
export async function getDB(): Promise<IDBPDatabase<UrlKitDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<UrlKitDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, tx) {
      const targetVersion = newVersion ?? DB_VERSION;
      const migrationsToRun = getMigrationsToRun(oldVersion, targetVersion);

      for (const migration of migrationsToRun) {
        console.log(`[url-kit] 마이그레이션 v${migration.version}: ${migration.description}`);
        migration.upgrade(db, tx);
      }
    },
  });

  return dbInstance;
}
