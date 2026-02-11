# 아키텍처 설계

## 1. 기술 스택 상세

### 1.1 프레임워크 및 언어

- **Next.js 15** (App Router): 정적 사이트 생성(SSG) 활용, 파일 기반 라우팅
- **TypeScript**: 타입 안정성 확보, Zod와 연계한 런타임 검증
- **React 19**: 서버 컴포넌트는 레이아웃 수준에서만 활용, 대부분 클라이언트 컴포넌트

### 1.2 스타일링

- **Tailwind CSS 4**: 유틸리티 기반 스타일링
- **Radix UI + shadcn/ui**: 접근성 있는 headless 컴포넌트 + 스타일 프리셋
- **clsx**: 조건부 클래스 조합의 가독성 향상

### 1.3 상태 관리

- **TanStack Query**: IndexedDB 데이터의 비동기 상태 관리 (캐싱, 무효화)
- **Zustand**: 글로벌 UI 상태 관리 (필요 시 사용 가능, 현재 테마는 next-themes로 처리)
- **React Hook Form + Zod**: 폼 상태 관리 및 검증

### 1.4 데이터 저장

- **IndexedDB** (via `idb` 라이브러리): 모든 사용자 데이터의 영속 저장소
  - 서버 통신 없이 브라우저 로컬에서만 데이터 관리
  - 스키마 버전 관리로 마이그레이션 지원

### 1.5 HTTP 클라이언트

- **wretch**: 가벼운 fetch 래퍼 (현재 외부 API 호출은 없으나, 향후 확장 대비)

### 1.6 개발 도구

- **Biome**: 린트 + 포맷 통합 도구 (space 2칸, 탭 미사용)
- **Vitest**: 단위 테스트 및 통합 테스트
- **Testing Library**: 컴포넌트 테스트

---

## 2. 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (테마, 폰트, 공통 Provider)
│   ├── page.tsx                  # 홈 페이지
│   ├── globals.css               # 글로벌 스타일
│   ├── sites/
│   │   ├── page.tsx              # 사이트 목록
│   │   ├── new/
│   │   │   └── page.tsx          # 사이트 생성
│   │   └── edit/
│   │       └── page.tsx          # 사이트 수정 (?id=xxx 쿼리 파라미터)
│   ├── builder/
│   │   └── page.tsx              # URL 빌더
│   └── presets/
│       └── page.tsx              # 프리셋 목록
│
├── components/                   # 공통 컴포넌트
│   ├── ui/                       # shadcn/ui 기반 기본 컴포넌트
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   └── tooltip.tsx
│   ├── layout/                   # 레이아웃 컴포넌트
│   │   ├── header.tsx            # 네비게이션 + 모바일 메뉴 + 테마 토글
│   │   ├── footer.tsx
│   │   └── theme-toggle.tsx      # 다크/라이트 테마 토글
│   └── shared/                   # 여러 feature에서 공유하는 컴포넌트
│       └── copy-button.tsx       # 클립보드 복사 버튼
│
├── features/                     # 기능별 모듈
│   ├── sites/                    # 사이트 관리
│   │   ├── components/
│   │   │   ├── site-form.tsx     # 사이트 생성/수정 폼 (이름 + 설명)
│   │   │   └── site-card.tsx     # 사이트 목록 카드
│   │   ├── hooks/
│   │   │   └── use-sites.ts      # 사이트 CRUD TanStack Query 훅
│   │   └── schemas/
│   │       └── site-schema.ts    # Zod 스키마 (폼 검증)
│   │
│   ├── url-builder/              # URL 빌더
│   │   ├── components/
│   │   │   ├── builder-form.tsx  # 5컬럼 빌더 + URL 미리보기
│   │   │   ├── url-column.tsx    # 카테고리별 세로 컬럼
│   │   │   ├── url-item-card.tsx # 컬럼 내 개별 항목
│   │   │   ├── item-form-dialog.tsx  # 항목 추가/수정 다이얼로그
│   │   │   ├── url-preview.tsx   # URL 미리보기 + 열기/복사
│   │   │   └── preset-save-dialog.tsx # 프리셋 저장 다이얼로그
│   │   ├── hooks/
│   │   │   └── use-url-items.ts  # UrlItem CRUD TanStack Query 훅
│   │   └── schemas/
│   │       └── url-item-schema.ts # UrlItem 폼 Zod 스키마
│   │
│   ├── presets/                   # 프리셋
│   │   ├── components/
│   │   │   └── preset-card.tsx   # 프리셋 카드 (열기/복사/즐겨찾기/삭제)
│   │   └── hooks/
│   │       └── use-presets.ts    # 프리셋/즐겨찾기 TanStack Query 훅
│   │
│   └── favorites/                # 즐겨찾기
│       └── components/
│           └── favorite-list.tsx # 홈 화면 즐겨찾기 목록
│
├── lib/                          # 라이브러리 및 유틸리티
│   ├── db/                       # IndexedDB 관련
│   │   ├── client.ts             # DB 연결 싱글턴 및 초기화 (v2 마이그레이션 포함)
│   │   ├── schema.ts             # DB 스키마 정의 (sites, url-items, presets)
│   │   └── repositories/         # 데이터 접근 계층
│   │       ├── site-repository.ts
│   │       ├── url-item-repository.ts
│   │       └── preset-repository.ts
│   ├── url.ts                    # URL 빌드 유틸리티 (buildUrl)
│   ├── utils.ts                  # clsx + tailwind-merge 래퍼 (cn)
│   └── providers/                # React Context Provider
│       ├── index.tsx             # 통합 Provider (Theme + Query + Tooltip)
│       ├── theme-provider.tsx
│       └── query-provider.tsx
│
├── test/                         # 테스트 설정
│   └── setup.ts
│
└── types/                        # 공통 타입 정의
    ├── site.ts                   # Site 타입 (이름 + 설명)
    ├── url-item.ts               # UrlItem 타입 (카테고리별 URL 구성요소)
    └── preset.ts                 # Preset 타입 (UrlItem ID 참조)
```

---

## 3. 데이터 흐름

### 3.1 전체 데이터 흐름

```
[UI Component]
    ↕ React Hook Form (폼 상태)
    ↕ TanStack Query (비동기 상태 + 캐싱)
    ↕ Repository Layer (데이터 접근 추상화)
    ↕ idb (IndexedDB 래퍼)
    ↕ IndexedDB (브라우저 로컬 저장소)
```

### 3.2 URL 빌드 흐름

```
1. 사용자가 사이트 선택
2. TanStack Query로 사이트 데이터 로드 (IndexedDB → 캐시)
3. 사용자가 각 구성요소 선택 (React Hook Form)
4. buildUrl() 유틸리티로 URL 생성 (실시간 미리보기)
5. "열기" → window.open(url, '_blank')
6. "복사" → navigator.clipboard.writeText(url)
7. "프리셋 저장" → Repository → IndexedDB
```

### 3.3 IndexedDB 스키마

```typescript
// DB 이름: "url-kit-db"
// 버전: 2 (v1→v2: 기존 stores 삭제 후 재생성)

interface UrlKitDB {
  sites: {
    key: string;        // site.id (UUID)
    value: Site;        // { id, name, description, createdAt, updatedAt }
    indexes: {
      "by-name": string;
      "by-updated": string;
    };
  };
  "url-items": {
    key: string;        // urlItem.id (UUID)
    value: UrlItem;     // { id, siteId, category, name, description, value, sortOrder, ... }
    indexes: {
      "by-site": string;
      "by-site-category": [string, string]; // [siteId, category] 복합 인덱스
      "by-updated": string;
    };
  };
  presets: {
    key: string;        // preset.id (UUID)
    value: Preset;      // { id, siteId, name, selectedProtocolId, selectedDomainId, ... }
    indexes: {
      "by-site": string;
      "by-favorite": string;
      "by-updated": string;
    };
  };
}
```

---

## 4. 주요 설계 결정

### 4.1 왜 IndexedDB인가?

| 저장소 | 용량 | 구조화 | 비동기 | 선택 이유 |
|--------|------|--------|--------|-----------|
| localStorage | ~5MB | 문자열만 | 동기 | 용량 제한, 동기 블로킹 |
| IndexedDB | 수백MB+ | 객체 저장 | 비동기 | **적합**: 구조화 데이터, 대용량 지원, 비동기 |
| 서버 DB | 무제한 | 자유 | 비동기 | 외부 유출 위험, 서버 비용 |

### 4.2 왜 TanStack Query + IndexedDB인가?

IndexedDB는 비동기 API이므로 서버 상태와 유사한 패턴으로 다룰 수 있습니다.
TanStack Query를 활용하면:

- **캐싱**: 동일 데이터 중복 읽기 방지
- **무효화**: 데이터 변경 시 관련 쿼리 자동 갱신
- **로딩/에러 상태**: 일관된 비동기 상태 관리
- **Optimistic Update**: 저장 시 즉각적 UI 반영

### 4.3 정적 사이트 vs 서버 사이드

- 외부 API 호출이 없으므로 **정적 사이트(SSG)** 로 빌드
- Next.js의 `output: 'export'`로 정적 HTML 생성
- CDN 배포로 빠른 로드

### 4.4 Repository 패턴

IndexedDB 접근 로직을 Repository로 분리하여:

- **테스트 용이성**: Repository를 모킹하여 컴포넌트 테스트
- **관심사 분리**: UI ↔ 데이터 접근 로직 분리
- **마이그레이션**: DB 스키마 변경 시 Repository만 수정

---

## 5. 다크 모드 전략

- `next-themes` 라이브러리 활용
- 시스템 설정 자동 감지 (`prefers-color-scheme`)
- 사용자 수동 토글 (header에 테마 전환 버튼)
- Tailwind CSS의 `dark:` 접두사로 스타일 분기
- `class` 전략 사용 (`<html class="dark">`)

---

## 6. 테스트 전략

### 6.1 단위 테스트 (Vitest)

- URL 빌드 로직 (`buildUrl`)
- Zod 스키마 검증
- Repository 함수 (idb 모킹)

### 6.2 컴포넌트 테스트 (Testing Library)

- 폼 컴포넌트 입력/검증
- URL 미리보기 업데이트
- 복사/열기 버튼 동작

### 6.3 테스트 우선순위

1. URL 빌드 유틸리티 (핵심 로직)
2. Repository CRUD 함수
3. 주요 사용자 인터랙션 (폼 제출, URL 복사)

---

## 7. 배포

- **호스팅**: 정적 사이트 배포 (Vercel, Cloudflare Pages 등)
- **도메인**: `url.byb.kr`
- **빌드**: `next build` → 정적 HTML/CSS/JS 출력
- **CI/CD**: GitHub Actions (린트 → 테스트 → 빌드 → 배포)

---

## 8. 향후 확장 가능성

- **가져오기/내보내기**: IndexedDB 데이터를 JSON으로 백업/복원
- **공유**: 사이트 템플릿을 URL로 인코딩하여 팀원에게 공유
- **히스토리**: 최근 빌드한 URL 기록
- **태그/분류**: 사이트를 프로젝트/팀별로 분류
