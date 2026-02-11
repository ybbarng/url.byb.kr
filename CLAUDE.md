# CLAUDE.md

## 프로젝트 개요

**URL Kit** — URL 구성요소를 관리하고 조합하는 웹 도구 (url.byb.kr)
모든 데이터는 브라우저 IndexedDB에 저장, 서버 통신 없음, 정적 사이트(SSG)

## 명령어

```bash
pnpm dev          # 개발 서버 (turbopack)
pnpm build        # 정적 빌드 (output: export)
pnpm lint         # Biome 린트 + 포맷 (자동 수정)
pnpm lint:check   # Biome 체크 (수정 없이)
pnpm test         # Vitest 테스트
pnpm test:watch   # Vitest 워치 모드
pnpm add <pkg>    # 의존성 추가 (npm install 사용 금지)
```

> **참고**: pnpm v10은 보안상 postinstall 스크립트를 기본 차단합니다 (esbuild, msw, sharp 등).
> 빌드/테스트 실패 시 `pnpm approve-builds`로 해당 패키지의 빌드 스크립트를 허용해야 할 수 있습니다.

## 기술 스택

- Next.js 15 (App Router, `output: "export"`), TypeScript, React 19
- Tailwind CSS 4, shadcn/ui (Radix UI), clsx + tailwind-merge
- Zustand (UI 상태), TanStack Query (IndexedDB 비동기 상태)
- React Hook Form + Zod (v4, `zod/v4` import), idb (IndexedDB)
- Biome (린트/포맷, space 2칸, 더블쿼트, 세미콜론), Vitest + Testing Library

## 코드 컨벤션

- Biome: space 2칸 (탭 사용 안 함), 세미콜론 필수, 더블쿼트
- `"use client"` 지시문: 브라우저 API나 훅 사용하는 컴포넌트에 필수
- 정적 export 제약: 동적 라우트 `[param]` 사용 불가 → 쿼리 파라미터 방식 사용 (예: `/sites/edit?id=xxx`)
- `useSearchParams()` 사용 시 반드시 `<Suspense>`로 감싸기
- 조건부 클래스: `cn()` (lib/utils.ts) 또는 `clsx` 사용
- import 정렬: Biome assist가 자동 정리

## 디렉토리 구조

```
src/
├── app/                  # 페이지 (/, /sites, /sites/new, /sites/edit, /builder, /presets)
├── components/
│   ├── ui/               # shadcn/ui 컴포넌트 (수정 지양)
│   ├── layout/           # Header, Footer, ThemeToggle
│   └── shared/           # CopyButton 등 공유 컴포넌트
├── features/             # 기능별 모듈
│   ├── sites/            # components/, hooks/, schemas/
│   ├── url-builder/      # components/, hooks/, schemas/
│   ├── presets/           # components/, hooks/
│   └── favorites/        # components/
├── lib/
│   ├── db/               # IndexedDB client, schema, repositories/
│   ├── providers/        # ThemeProvider, QueryProvider
│   └── utils.ts          # cn() 유틸리티
├── types/                # Site, Preset, UrlItem 타입 정의
└── test/                 # 테스트 setup
```

## 핵심 데이터 모델

- **Site**: `{ id, name, description, createdAt, updatedAt }` — 사이트 기본 정보만
- **UrlItem**: `{ id, siteId, category, name, description, value, sortOrder, createdAt, updatedAt }` — 별도 `url-items` IndexedDB store에 저장
  - `category`: `"protocol" | "subdomain" | "domain" | "path" | "query"`
  - 복합 인덱스 `[siteId, category]`로 효율적 조회
  - 사이트 생성 시 기본 프로토콜(HTTPS, HTTP) 자동 생성
- **Preset**: `{ id, siteId, name, selectedProtocolId, selectedSubdomainId, selectedDomainId, selectedPathId, selectedQueryIds[], isFavorite, createdAt, updatedAt }` — UrlItem ID 참조
- 모든 ID는 `crypto.randomUUID()`, 날짜는 ISO 문자열
- DB_VERSION=2, 마이그레이션은 `src/lib/db/migrations/` 레지스트리로 관리

## 마이그레이션 정책

1. **store 삭제 금지** — 기존 store는 절대 삭제하지 않음
2. **필드 삭제 금지** — 기존 필드는 삭제하지 않고 deprecated 처리
3. **마이그레이션은 항상 데이터 변환** — 새 형태로 transform, 절대 drop & recreate 아님
4. **마이그레이션 전 자동 백업** — `backup.ts`의 `exportAllData()`로 스냅샷 저장
5. **마이그레이션 후 무결성 검증** — `integrity.ts`의 `validateIntegrity()` 실행, 실패 시 경고
6. **마이그레이션 테스트 필수** — 새 마이그레이션 추가 시 반드시 테스트 동반
7. **DB_VERSION 증가 시** — `migrations/index.ts`에 새 Migration 엔트리 추가, `schema.ts`에서 버전 올리기

## Git

- `git checkout` 대신 `git switch` / `git restore` 사용
- 원격: `origin` → `git@github.com:ybbarng/url.byb.kr.git`
- 커밋 메시지: 한국어, conventional commits (feat/fix/chore/docs)
- 커밋 시 `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` 포함
