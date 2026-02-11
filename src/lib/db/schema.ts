import type { DBSchema } from "idb";
import type { Preset } from "@/types/preset";
import type { Site } from "@/types/site";
import type { UrlItem } from "@/types/url-item";

/** IndexedDB 스키마 정의 */
export interface UrlKitDB extends DBSchema {
  sites: {
    key: string;
    value: Site;
    indexes: {
      "by-name": string;
      "by-updated": string;
    };
  };
  "url-items": {
    key: string;
    value: UrlItem;
    indexes: {
      "by-site": string;
      "by-site-category": [string, string];
      "by-updated": string;
    };
  };
  presets: {
    key: string;
    value: Preset;
    indexes: {
      "by-site": string;
      "by-favorite": string;
      "by-updated": string;
    };
  };
}

export const DB_NAME = "url-kit-db";
export const DB_VERSION = 2;
