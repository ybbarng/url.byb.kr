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
});
