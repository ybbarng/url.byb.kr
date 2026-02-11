/** 옵션 항목의 공통 구조 (서브도메인, 경로 세그먼트, 쿼리 파라미터에서 공유) */
export interface Option {
  id: string;
  label: string;
  value: string;
}

/** 경로 세그먼트: 정적(고정값) 또는 동적(여러 옵션 중 선택) */
export interface PathSegment {
  id: string;
  type: "static" | "dynamic";
  /** 표시 이름 (예: "게시물 slug", "팀") */
  label: string;
  /** 정적 세그먼트일 때의 고정 값 */
  value?: string;
  /** 동적 세그먼트일 때의 선택 옵션 목록 */
  options?: Option[];
}

/** 쿼리 파라미터 템플릿 */
export interface QueryParamTemplate {
  id: string;
  /** URL 쿼리 키 (예: "lang", "view") */
  key: string;
  /** 표시 이름 (예: "언어", "보기 방식") */
  label: string;
  /** 미리 정의된 값 옵션 목록. 비어있으면 자유 입력 */
  options?: Option[];
}

/** 사이트: URL 템플릿의 최상위 단위 */
export interface Site {
  id: string;
  /** 사용자가 지정한 사이트 이름 (식별자 역할) */
  name: string;
  protocol: "http" | "https";
  /** 기본 도메인 (예: "example.com", "localhost:3000") */
  domain: string;
  /** 선택 가능한 서브도메인 목록 */
  subdomains: Option[];
  /** 경로 세그먼트 (순서 유지) */
  pathSegments: PathSegment[];
  /** 쿼리 파라미터 템플릿 */
  queryParams: QueryParamTemplate[];
  createdAt: string;
  updatedAt: string;
}
