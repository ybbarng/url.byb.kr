import { describe, expect, it } from "vitest";
import { siteFormSchema } from "./site-schema";

const validOption = { id: "opt-1", label: "옵션1", value: "val1" };

const validSite = {
  name: "테스트 사이트",
  protocol: "https" as const,
  domain: "example.com",
  subdomains: [validOption],
  pathSegments: [
    { id: "ps-1", type: "static" as const, label: "고정경로", value: "api" },
    {
      id: "ps-2",
      type: "dynamic" as const,
      label: "사용자",
      options: [validOption],
    },
  ],
  queryParams: [{ id: "qp-1", key: "page", label: "페이지", options: [validOption] }],
};

describe("siteFormSchema", () => {
  it("올바른 데이터를 통과시킨다", () => {
    const result = siteFormSchema.safeParse(validSite);
    expect(result.success).toBe(true);
  });

  it("이름이 빈 문자열이면 실패한다", () => {
    const result = siteFormSchema.safeParse({ ...validSite, name: "" });
    expect(result.success).toBe(false);
  });

  it("도메인이 빈 문자열이면 실패한다", () => {
    const result = siteFormSchema.safeParse({ ...validSite, domain: "" });
    expect(result.success).toBe(false);
  });

  it("protocol이 http 또는 https만 허용한다", () => {
    const httpResult = siteFormSchema.safeParse({
      ...validSite,
      protocol: "http",
    });
    expect(httpResult.success).toBe(true);

    const invalidResult = siteFormSchema.safeParse({
      ...validSite,
      protocol: "ftp",
    });
    expect(invalidResult.success).toBe(false);
  });

  it("subdomains가 빈 배열이어도 통과한다", () => {
    const result = siteFormSchema.safeParse({
      ...validSite,
      subdomains: [],
    });
    expect(result.success).toBe(true);
  });

  it("pathSegments가 빈 배열이어도 통과한다", () => {
    const result = siteFormSchema.safeParse({
      ...validSite,
      pathSegments: [],
    });
    expect(result.success).toBe(true);
  });

  it("queryParams가 빈 배열이어도 통과한다", () => {
    const result = siteFormSchema.safeParse({
      ...validSite,
      queryParams: [],
    });
    expect(result.success).toBe(true);
  });

  it("옵션의 label이 빈 문자열이면 실패한다", () => {
    const result = siteFormSchema.safeParse({
      ...validSite,
      subdomains: [{ id: "sd-1", label: "", value: "dev" }],
    });
    expect(result.success).toBe(false);
  });

  it("옵션의 value가 빈 문자열이면 실패한다", () => {
    const result = siteFormSchema.safeParse({
      ...validSite,
      subdomains: [{ id: "sd-1", label: "개발", value: "" }],
    });
    expect(result.success).toBe(false);
  });

  it("pathSegment의 type이 static/dynamic만 허용한다", () => {
    const result = siteFormSchema.safeParse({
      ...validSite,
      pathSegments: [{ id: "ps-1", type: "unknown", label: "잘못된 타입" }],
    });
    expect(result.success).toBe(false);
  });

  it("pathSegment의 label이 빈 문자열이면 실패한다", () => {
    const result = siteFormSchema.safeParse({
      ...validSite,
      pathSegments: [{ id: "ps-1", type: "static", label: "", value: "api" }],
    });
    expect(result.success).toBe(false);
  });

  it("queryParam의 key가 빈 문자열이면 실패한다", () => {
    const result = siteFormSchema.safeParse({
      ...validSite,
      queryParams: [{ id: "qp-1", key: "", label: "파라미터" }],
    });
    expect(result.success).toBe(false);
  });

  it("queryParam의 label이 빈 문자열이면 실패한다", () => {
    const result = siteFormSchema.safeParse({
      ...validSite,
      queryParams: [{ id: "qp-1", key: "page", label: "" }],
    });
    expect(result.success).toBe(false);
  });

  it("필수 필드가 누락되면 실패한다", () => {
    const { name: _, ...withoutName } = validSite;
    expect(siteFormSchema.safeParse(withoutName).success).toBe(false);

    const { domain: __, ...withoutDomain } = validSite;
    expect(siteFormSchema.safeParse(withoutDomain).success).toBe(false);

    const { protocol: ___, ...withoutProtocol } = validSite;
    expect(siteFormSchema.safeParse(withoutProtocol).success).toBe(false);
  });
});
