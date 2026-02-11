export interface ParsedUrl {
  protocol: string;
  subdomain: string | null;
  domain: string;
  path: string | null;
  query: string | null;
}

export type ParseUrlResult = { success: true; data: ParsedUrl } | { success: false; error: string };

/** URL 문자열을 파싱하여 각 구성요소로 분리합니다 */
export function parseUrl(input: string): ParseUrlResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { success: false, error: "URL을 입력해 주세요" };
  }

  // 프로토콜이 없는 경우 감지
  if (!/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(trimmed)) {
    return { success: false, error: "프로토콜(https://)을 포함한 전체 URL을 입력해 주세요" };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { success: false, error: "올바른 URL 형식이 아닙니다" };
  }

  if (!url.hostname) {
    return { success: false, error: "도메인을 찾을 수 없습니다" };
  }

  const protocol = url.protocol.replace(/:$/, "");

  // subdomain / domain 분리
  const hostname = url.hostname;
  let subdomain: string | null = null;
  let domainPart: string;

  if (isIpOrLocalhost(hostname)) {
    domainPart = hostname;
  } else {
    const segments = hostname.split(".");
    if (segments.length <= 2) {
      domainPart = hostname;
    } else {
      domainPart = segments.slice(-2).join(".");
      subdomain = segments.slice(0, -2).join(".");
    }
  }

  // 포트가 있으면 domain에 포함
  const domain = url.port ? `${domainPart}:${url.port}` : domainPart;

  // path: /를 제거한 나머지, 빈 문자열이면 null
  const rawPath = url.pathname.replace(/^\//, "");
  const path = rawPath || null;

  // query: ?를 제거한 전체 문자열
  const query = url.search ? url.search.replace(/^\?/, "") : null;

  return {
    success: true,
    data: { protocol, subdomain, domain, path, query },
  };
}

function isIpOrLocalhost(hostname: string): boolean {
  if (hostname === "localhost") return true;
  // IPv4
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return true;
  // IPv6 (brackets already stripped by URL parser)
  if (hostname.includes(":")) return true;
  // 단일 세그먼트 (점이 없는 호스트명)
  if (!hostname.includes(".")) return true;
  return false;
}
