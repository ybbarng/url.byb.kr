import type { Site } from "@/types/site";

interface BuildUrlParams {
  site: Site;
  /** 선택된 서브도메인 값 (빈 문자열이면 서브도메인 없음) */
  subdomain: string;
  /** 경로 세그먼트 ID → 값 매핑 (정적 세그먼트는 자동으로 value 사용) */
  pathValues: Record<string, string>;
  /** 쿼리 파라미터 ID → 값 매핑 */
  queryValues: Record<string, string>;
}

/** 사이트 템플릿과 선택된 값들로 URL을 빌드합니다 */
export function buildUrl({ site, subdomain, pathValues, queryValues }: BuildUrlParams): string {
  // 호스트 조합: 서브도메인 + 도메인
  const host = subdomain ? `${subdomain}.${site.domain}` : site.domain;

  // 경로 조합: 각 세그먼트의 값을 순서대로 연결
  const pathParts = site.pathSegments.map((segment) => {
    if (segment.type === "static") {
      return segment.value ?? "";
    }
    return pathValues[segment.id] ?? "";
  });
  const path = `/${pathParts.filter(Boolean).join("/")}`;

  // 쿼리 파라미터 조합
  const queryEntries = site.queryParams
    .filter((param) => queryValues[param.id])
    .map((param) => [param.key, queryValues[param.id]]);
  const queryString = new URLSearchParams(queryEntries).toString();

  const base = `${site.protocol}://${host}${path}`;
  return queryString ? `${base}?${queryString}` : base;
}
