export type UrlItemCategory = "protocol" | "subdomain" | "domain" | "path" | "query";

export interface UrlItem {
  id: string;
  siteId: string;
  category: UrlItemCategory;
  /** 표시 이름 */
  name: string;
  /** 설명 */
  description: string;
  /** URL에 사용되는 실제 값 */
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
