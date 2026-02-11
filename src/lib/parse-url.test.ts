import { describe, expect, it } from "vitest";
import { parseUrl } from "./parse-url";

describe("parseUrl", () => {
  describe("성공 케이스", () => {
    it("기본 URL을 파싱한다", () => {
      const result = parseUrl("https://example.com");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "https",
          subdomain: null,
          domain: "example.com",
          path: null,
          query: null,
        },
      });
    });

    it("서브도메인이 포함된 URL을 파싱한다", () => {
      const result = parseUrl("https://blog.example.com");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "https",
          subdomain: "blog",
          domain: "example.com",
          path: null,
          query: null,
        },
      });
    });

    it("여러 단계 서브도메인을 파싱한다", () => {
      const result = parseUrl("https://a.b.example.com");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "https",
          subdomain: "a.b",
          domain: "example.com",
          path: null,
          query: null,
        },
      });
    });

    it("경로가 포함된 URL을 파싱한다", () => {
      const result = parseUrl("https://example.com/api/v2/users");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "https",
          subdomain: null,
          domain: "example.com",
          path: "api/v2/users",
          query: null,
        },
      });
    });

    it("쿼리가 포함된 URL을 파싱한다", () => {
      const result = parseUrl("https://example.com/search?lang=ko&page=1");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "https",
          subdomain: null,
          domain: "example.com",
          path: "search",
          query: "lang=ko&page=1",
        },
      });
    });

    it("모든 구성요소가 포함된 URL을 파싱한다", () => {
      const result = parseUrl("https://blog.example.com/posts/123?view=full");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "https",
          subdomain: "blog",
          domain: "example.com",
          path: "posts/123",
          query: "view=full",
        },
      });
    });

    it("HTTP 프로토콜을 파싱한다", () => {
      const result = parseUrl("http://example.com");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "http",
          subdomain: null,
          domain: "example.com",
          path: null,
          query: null,
        },
      });
    });

    it("포트번호가 포함된 URL을 파싱한다", () => {
      const result = parseUrl("http://localhost:3000/api");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "http",
          subdomain: null,
          domain: "localhost:3000",
          path: "api",
          query: null,
        },
      });
    });

    it("서브도메인 + 포트번호 URL을 파싱한다", () => {
      const result = parseUrl("https://blog.site.com:1234/path");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "https",
          subdomain: "blog",
          domain: "site.com:1234",
          path: "path",
          query: null,
        },
      });
    });

    it("IP 주소 URL을 파싱한다", () => {
      const result = parseUrl("http://127.0.0.1:8080/api");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "http",
          subdomain: null,
          domain: "127.0.0.1:8080",
          path: "api",
          query: null,
        },
      });
    });

    it("IP 주소(포트 없음)를 파싱한다", () => {
      const result = parseUrl("http://192.168.1.1/admin");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "http",
          subdomain: null,
          domain: "192.168.1.1",
          path: "admin",
          query: null,
        },
      });
    });

    it("쿼리만 있고 경로가 없는 URL을 파싱한다", () => {
      const result = parseUrl("https://example.com?key=value");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "https",
          subdomain: null,
          domain: "example.com",
          path: null,
          query: "key=value",
        },
      });
    });

    it("입력값 앞뒤 공백을 제거한다", () => {
      const result = parseUrl("  https://example.com  ");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "https",
          subdomain: null,
          domain: "example.com",
          path: null,
          query: null,
        },
      });
    });

    it("localhost(포트 없음)를 파싱한다", () => {
      const result = parseUrl("http://localhost/api");
      expect(result).toEqual({
        success: true,
        data: {
          protocol: "http",
          subdomain: null,
          domain: "localhost",
          path: "api",
          query: null,
        },
      });
    });
  });

  describe("실패 케이스", () => {
    it("빈 문자열이면 에러를 반환한다", () => {
      const result = parseUrl("");
      expect(result).toEqual({
        success: false,
        error: "URL을 입력해 주세요",
      });
    });

    it("공백만 있으면 에러를 반환한다", () => {
      const result = parseUrl("   ");
      expect(result).toEqual({
        success: false,
        error: "URL을 입력해 주세요",
      });
    });

    it("프로토콜이 없으면 에러를 반환한다", () => {
      const result = parseUrl("example.com/path");
      expect(result).toEqual({
        success: false,
        error: "프로토콜(https://)을 포함한 전체 URL을 입력해 주세요",
      });
    });

    it("잘못된 URL 형식이면 에러를 반환한다", () => {
      const result = parseUrl("https://");
      expect(result).toEqual({
        success: false,
        error: "올바른 URL 형식이 아닙니다",
      });
    });
  });
});
