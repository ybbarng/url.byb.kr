import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UrlParseInput } from "../url-parse-input";

// sonner의 toast를 모킹
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from "sonner";

describe("UrlParseInput", () => {
  it("입력 필드와 파싱 버튼을 렌더링한다", () => {
    render(<UrlParseInput onParse={vi.fn()} />);

    expect(screen.getByPlaceholderText(/URL을 붙여넣으세요/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "파싱" })).toBeInTheDocument();
  });

  it("유효한 URL을 파싱하면 onParse를 호출하고 입력을 초기화한다", async () => {
    const user = userEvent.setup();
    const onParse = vi.fn();
    render(<UrlParseInput onParse={onParse} />);

    const input = screen.getByPlaceholderText(/URL을 붙여넣으세요/);
    await user.type(input, "https://blog.example.com/path?q=1");
    await user.click(screen.getByRole("button", { name: "파싱" }));

    expect(onParse).toHaveBeenCalledWith({
      protocol: "https",
      subdomain: "blog",
      domain: "example.com",
      path: "path",
      query: "q=1",
    });
    expect(input).toHaveValue("");
    expect(toast.success).toHaveBeenCalledWith("URL이 파싱되었습니다");
  });

  it("잘못된 URL이면 toast.error를 표시하고 onParse를 호출하지 않는다", async () => {
    const user = userEvent.setup();
    const onParse = vi.fn();
    render(<UrlParseInput onParse={onParse} />);

    const input = screen.getByPlaceholderText(/URL을 붙여넣으세요/);
    await user.type(input, "not-a-url");
    await user.click(screen.getByRole("button", { name: "파싱" }));

    expect(onParse).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
    expect(input).toHaveValue("not-a-url");
  });

  it("Enter 키로 파싱을 실행한다", async () => {
    const user = userEvent.setup();
    const onParse = vi.fn();
    render(<UrlParseInput onParse={onParse} />);

    const input = screen.getByPlaceholderText(/URL을 붙여넣으세요/);
    await user.type(input, "https://example.com{Enter}");

    expect(onParse).toHaveBeenCalledWith({
      protocol: "https",
      subdomain: null,
      domain: "example.com",
      path: null,
      query: null,
    });
  });
});
