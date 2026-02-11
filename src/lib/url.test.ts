import { describe, expect, it } from "vitest";
import type { Site } from "@/types/site";
import { buildUrl } from "./url";

const baseSite: Site = {
  id: "site-1",
  name: "Issue Tracker",
  protocol: "https",
  domain: "example.com",
  subdomains: [
    { id: "sd-1", label: "개발", value: "tracker-dev" },
    { id: "sd-2", label: "스테이징", value: "tracker-staging" },
    { id: "sd-3", label: "프로덕션", value: "tracker" },
  ],
  pathSegments: [
    {
      id: "ps-1",
      type: "dynamic",
      label: "팀",
      options: [
        { id: "opt-1", label: "프론트엔드", value: "frontend" },
        { id: "opt-2", label: "백엔드", value: "backend" },
      ],
    },
    {
      id: "ps-2",
      type: "dynamic",
      label: "프로젝트",
      options: [
        { id: "opt-3", label: "웹 앱", value: "web-app" },
        { id: "opt-4", label: "API 서버", value: "api-server" },
      ],
    },
    { id: "ps-3", type: "static", label: "이슈", value: "issues" },
    {
      id: "ps-4",
      type: "dynamic",
      label: "이슈 번호",
      options: [{ id: "opt-5", label: "로그인 버그", value: "101" }],
    },
  ],
  queryParams: [
    {
      id: "qp-1",
      key: "view",
      label: "보기 방식",
      options: [
        { id: "qo-1", label: "보드", value: "board" },
        { id: "qo-2", label: "리스트", value: "list" },
      ],
    },
  ],
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

describe("buildUrl", () => {
  it("서브도메인 + 다중 동적 경로 + 쿼리로 URL을 빌드한다", () => {
    const url = buildUrl({
      site: baseSite,
      subdomain: "tracker-staging",
      pathValues: { "ps-1": "frontend", "ps-2": "web-app", "ps-4": "101" },
      queryValues: { "qp-1": "board" },
    });
    expect(url).toBe("https://tracker-staging.example.com/frontend/web-app/issues/101?view=board");
  });

  it("서브도메인 없이 URL을 빌드한다", () => {
    const url = buildUrl({
      site: baseSite,
      subdomain: "",
      pathValues: { "ps-1": "backend", "ps-2": "api-server", "ps-4": "205" },
      queryValues: {},
    });
    expect(url).toBe("https://example.com/backend/api-server/issues/205");
  });

  it("쿼리 파라미터 없이 URL을 빌드한다", () => {
    const url = buildUrl({
      site: baseSite,
      subdomain: "tracker-dev",
      pathValues: { "ps-1": "frontend", "ps-2": "web-app", "ps-4": "101" },
      queryValues: {},
    });
    expect(url).toBe("https://tracker-dev.example.com/frontend/web-app/issues/101");
  });

  it("localhost 사이트의 URL을 빌드한다", () => {
    const localSite: Site = {
      ...baseSite,
      id: "site-2",
      name: "Issue Tracker 로컬",
      protocol: "http",
      domain: "localhost:3000",
    };
    const url = buildUrl({
      site: localSite,
      subdomain: "",
      pathValues: { "ps-1": "frontend", "ps-2": "web-app", "ps-4": "101" },
      queryValues: { "qp-1": "board" },
    });
    expect(url).toBe("http://localhost:3000/frontend/web-app/issues/101?view=board");
  });

  it("경로 세그먼트가 없으면 루트 경로를 반환한다", () => {
    const noPathSite: Site = {
      ...baseSite,
      pathSegments: [],
    };
    const url = buildUrl({
      site: noPathSite,
      subdomain: "tracker",
      pathValues: {},
      queryValues: {},
    });
    expect(url).toBe("https://tracker.example.com/");
  });

  it("여러 쿼리 파라미터를 포함한 URL을 빌드한다", () => {
    const multiQuerySite: Site = {
      ...baseSite,
      queryParams: [
        {
          id: "qp-1",
          key: "view",
          label: "보기 방식",
          options: [{ id: "qo-1", label: "보드", value: "board" }],
        },
        {
          id: "qp-2",
          key: "sort",
          label: "정렬",
          options: [{ id: "qo-2", label: "최신순", value: "newest" }],
        },
        {
          id: "qp-3",
          key: "limit",
          label: "개수",
          options: [{ id: "qo-3", label: "50개", value: "50" }],
        },
      ],
    };
    const url = buildUrl({
      site: multiQuerySite,
      subdomain: "",
      pathValues: { "ps-1": "frontend", "ps-2": "web-app", "ps-4": "101" },
      queryValues: { "qp-1": "board", "qp-2": "newest", "qp-3": "50" },
    });
    expect(url).toBe(
      "https://example.com/frontend/web-app/issues/101?view=board&sort=newest&limit=50",
    );
  });

  it("동적 경로 값이 비어있으면 해당 세그먼트를 건너뛴다", () => {
    const url = buildUrl({
      site: baseSite,
      subdomain: "",
      pathValues: { "ps-1": "frontend", "ps-2": "", "ps-4": "101" },
      queryValues: {},
    });
    expect(url).toBe("https://example.com/frontend/issues/101");
  });

  it("선택되지 않은 쿼리 파라미터는 URL에 포함하지 않는다", () => {
    const multiQuerySite: Site = {
      ...baseSite,
      queryParams: [
        {
          id: "qp-1",
          key: "view",
          label: "보기 방식",
          options: [{ id: "qo-1", label: "보드", value: "board" }],
        },
        {
          id: "qp-2",
          key: "sort",
          label: "정렬",
          options: [{ id: "qo-2", label: "최신순", value: "newest" }],
        },
      ],
    };
    const url = buildUrl({
      site: multiQuerySite,
      subdomain: "",
      pathValues: { "ps-1": "frontend", "ps-2": "web-app", "ps-4": "101" },
      queryValues: { "qp-1": "board" },
    });
    expect(url).toBe("https://example.com/frontend/web-app/issues/101?view=board");
  });

  it("정적 세그먼트만 있는 경로를 빌드한다", () => {
    const staticOnlySite: Site = {
      ...baseSite,
      pathSegments: [
        { id: "ps-1", type: "static", label: "관리자", value: "admin" },
        { id: "ps-2", type: "static", label: "대시보드", value: "dashboard" },
      ],
    };
    const url = buildUrl({
      site: staticOnlySite,
      subdomain: "",
      pathValues: {},
      queryValues: {},
    });
    expect(url).toBe("https://example.com/admin/dashboard");
  });
});
