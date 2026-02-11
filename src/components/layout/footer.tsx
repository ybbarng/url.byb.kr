export function Footer() {
  return (
    <footer className="border-t">
      <div className="flex flex-col items-center gap-2 px-6 py-6 text-center text-sm text-muted-foreground">
        <p>
          <a
            href="https://github.com/ybbarng/url.byb.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            URL Kit
          </a>
          {" — URL 구성요소를 관리하고 조합하는 도구"}
        </p>
        <p>
          Implemented by{" "}
          <a
            href="https://github.com/ybbarng"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            ybbarng
          </a>
          {" & "}
          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Claude
          </a>
        </p>
      </div>
    </footer>
  );
}
