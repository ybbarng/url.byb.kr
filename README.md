# URL Kit

**URL Kit**은 서비스 개발 및 테스트 과정에서 복잡한 URL 관리를 간편하게 해주는 웹 도구입니다.

서브도메인, 도메인, 경로, 쿼리 파라미터 등 URL의 각 구성요소를 이름 기반으로 관리하고,
원하는 조합을 선택해 한 번의 클릭으로 URL을 빌드하고 열 수 있습니다.

## 왜 URL Kit인가?

개발/QA 환경에서 URL은 다양한 구성요소의 조합으로 이루어집니다:

```
https://blog-staging.example.com/posts/hello-world?lang=ko
https://api-dev.example.com/v2/users/42?verbose=true
https://tracker.example.com/frontend/web-app/issues/101?view=board
http://localhost:5173/admin/dashboard
```

서브도메인, 경로 파라미터, 쿼리 등 각 구성요소가 매번 달라지면서
URL을 수동으로 조합하는 것은 번거롭고 실수가 발생하기 쉽습니다.

URL Kit은 이 구성요소들을 **명시적인 이름으로 관리**하고,
**조합 → 빌드 → 열기**를 하나의 워크플로우로 만들어줍니다.

## 주요 기능

- **사이트 관리**: URL 템플릿을 이름 기반으로 생성 및 관리
- **URL 자동 파싱**: URL을 붙여넣으면 프로토콜, 서브도메인, 도메인, 경로, 쿼리로 자동 분리
- **URL 빌더**: 서브도메인, 도메인, 경로, 쿼리를 시각적으로 조합
- **프리셋**: 자주 사용하는 조합을 저장하고 빠르게 재사용
- **즐겨찾기**: 홈 화면에서 원클릭으로 URL 열기
- **localhost 지원**: 로컬 개발 환경(localhost:포트) 완벽 지원
- **다크 모드**: 시스템 설정에 따른 자동 테마 전환
- **오프라인 데이터**: 모든 데이터는 브라우저 IndexedDB에 저장 (외부 유출 없음)

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router), TypeScript |
| 스타일링 | Tailwind CSS |
| UI 컴포넌트 | Radix UI + shadcn/ui |
| 상태 관리 | Zustand |
| 서버 상태 | TanStack Query |
| 폼 관리 | React Hook Form + Zod |
| HTTP 클라이언트 | wretch |
| 로컬 저장소 | IndexedDB (idb) |
| 린트/포맷 | Biome (space 2칸) |
| 테스트 | Vitest + Testing Library |
| 조건부 클래스 | clsx |

## 시작하기

### 요구사항

- Node.js 20+
- pnpm 10+

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 린트
pnpm lint

# 테스트
pnpm test

# 프로덕션 빌드
pnpm build
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 접속할 수 있습니다.

## 프로젝트 구조

```
url.byb.kr/
├── docs/                  # 프로젝트 문서
│   ├── REQUIREMENTS.md    # 요구사항 정의
│   └── ARCHITECTURE.md    # 아키텍처 설계
├── public/                # 정적 파일
├── src/
│   ├── app/               # Next.js App Router 페이지
│   ├── components/        # 공통 UI 컴포넌트
│   │   ├── ui/            # shadcn/ui 기반 컴포넌트
│   │   ├── layout/        # 헤더, 푸터, 테마 토글
│   │   └── shared/        # 공유 컴포넌트 (복사 버튼 등)
│   ├── features/          # 기능별 모듈
│   │   ├── sites/         # 사이트 관리
│   │   ├── url-builder/   # URL 빌더
│   │   ├── presets/       # 프리셋 관리
│   │   └── favorites/     # 즐겨찾기
│   ├── lib/               # 유틸리티 및 설정
│   │   ├── db/            # IndexedDB 래퍼 및 Repository
│   │   └── providers/     # React Context Provider
│   └── types/             # 공통 타입 정의
├── biome.json             # Biome 설정
├── next.config.ts         # Next.js 설정 (output: "export")
└── tsconfig.json          # TypeScript 설정
```

## 라이선스

Private - All rights reserved

---

*Implemented by ybbarng & Claude*
