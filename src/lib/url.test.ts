import { describe, expect, it } from "vitest";
import type { UrlItem } from "@/types/url-item";
import { buildUrl } from "./url";

function makeItem(overrides: Partial<UrlItem>): UrlItem {
  return {
    id: "test-id",
    siteId: "site-1",
    category: "protocol",
    name: "Test",
    description: "",
    value: "",
    sortOrder: 0,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

const https = makeItem({ category: "protocol", name: "HTTPS", value: "https" });
const http = makeItem({ category: "protocol", name: "HTTP", value: "http" });
const devSubdomain = makeItem({ category: "subdomain", name: "개발", value: "tracker-dev" });
const stagingSubdomain = makeItem({
  category: "subdomain",
  name: "스테이징",
  value: "tracker-staging",
});
const domain = makeItem({ category: "domain", name: "메인", value: "example.com" });
const localhost = makeItem({ category: "domain", name: "로컬", value: "localhost:3000" });
const apiPath = makeItem({ category: "path", name: "API v2 유저", value: "api/v2/users" });
const adminPath = makeItem({ category: "path", name: "관리자 대시보드", value: "admin/dashboard" });
const viewQuery = makeItem({ category: "query", name: "보기 방식", value: "view=board" });
const sortQuery = makeItem({ category: "query", name: "정렬", value: "sort=newest" });
const limitQuery = makeItem({ category: "query", name: "개수", value: "limit=50" });

describe("buildUrl", () => {
  it("서브도메인 + 경로 + 쿼리로 URL을 빌드한다", () => {
    const url = buildUrl({
      protocol: https,
      subdomain: stagingSubdomain,
      domain,
      path: apiPath,
      queries: [viewQuery],
    });
    expect(url).toBe("https://tracker-staging.example.com/api/v2/users?view=board");
  });

  it("서브도메인 없이 URL을 빌드한다", () => {
    const url = buildUrl({
      protocol: https,
      subdomain: null,
      domain,
      path: apiPath,
      queries: [],
    });
    expect(url).toBe("https://example.com/api/v2/users");
  });

  it("경로 없이 루트 URL을 빌드한다", () => {
    const url = buildUrl({
      protocol: https,
      subdomain: devSubdomain,
      domain,
      path: null,
      queries: [],
    });
    expect(url).toBe("https://tracker-dev.example.com/");
  });

  it("localhost 도메인의 URL을 빌드한다", () => {
    const url = buildUrl({
      protocol: http,
      subdomain: null,
      domain: localhost,
      path: apiPath,
      queries: [viewQuery],
    });
    expect(url).toBe("http://localhost:3000/api/v2/users?view=board");
  });

  it("여러 쿼리 파라미터를 &로 연결한다", () => {
    const url = buildUrl({
      protocol: https,
      subdomain: null,
      domain,
      path: apiPath,
      queries: [viewQuery, sortQuery, limitQuery],
    });
    expect(url).toBe("https://example.com/api/v2/users?view=board&sort=newest&limit=50");
  });

  it("모든 구성요소가 최소일 때 URL을 빌드한다", () => {
    const url = buildUrl({
      protocol: https,
      subdomain: null,
      domain,
      path: null,
      queries: [],
    });
    expect(url).toBe("https://example.com/");
  });

  it("정적 경로를 빌드한다", () => {
    const url = buildUrl({
      protocol: https,
      subdomain: null,
      domain,
      path: adminPath,
      queries: [],
    });
    expect(url).toBe("https://example.com/admin/dashboard");
  });
});
