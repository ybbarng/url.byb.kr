import type { UrlItem } from "@/types/url-item";

interface BuildUrlParams {
  protocol: UrlItem;
  subdomain: UrlItem | null;
  domain: UrlItem;
  path: UrlItem | null;
  queries: UrlItem[];
}

/** 선택된 UrlItem들로 URL을 빌드합니다 */
export function buildUrl({ protocol, subdomain, domain, path, queries }: BuildUrlParams): string {
  // 호스트 조합: 서브도메인 + 도메인
  const host = subdomain ? `${subdomain.value}.${domain.value}` : domain.value;

  // 경로: 선행 / 없이 저장된 value에 / 추가
  const pathPart = path ? `/${path.value}` : "/";

  // 쿼리: 각 아이템의 value는 "key=value" 형태, 여러 개 &로 join
  const queryString = queries.map((q) => q.value).join("&");

  const base = `${protocol.value}://${host}${pathPart}`;
  return queryString ? `${base}?${queryString}` : base;
}
