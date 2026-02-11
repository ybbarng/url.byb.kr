import { describe, expect, it } from "vitest";
import { siteFormSchema } from "./site-schema";

describe("siteFormSchema", () => {
  it("이름과 설명이 있으면 통과한다", () => {
    const result = siteFormSchema.safeParse({
      name: "테스트 사이트",
      description: "사이트 설명입니다",
    });
    expect(result.success).toBe(true);
  });

  it("설명이 빈 문자열이어도 통과한다", () => {
    const result = siteFormSchema.safeParse({ name: "테스트 사이트", description: "" });
    expect(result.success).toBe(true);
  });

  it("이름이 빈 문자열이면 실패한다", () => {
    const result = siteFormSchema.safeParse({ name: "", description: "" });
    expect(result.success).toBe(false);
  });

  it("이름이 누락되면 실패한다", () => {
    const result = siteFormSchema.safeParse({ description: "" });
    expect(result.success).toBe(false);
  });

  it("설명이 누락되면 실패한다", () => {
    const result = siteFormSchema.safeParse({ name: "테스트" });
    expect(result.success).toBe(false);
  });
});
