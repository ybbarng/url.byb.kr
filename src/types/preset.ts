/** 프리셋: 특정 사이트에 대한 구성요소 선택 조합 */
export interface Preset {
  id: string;
  /** 연결된 사이트 ID */
  siteId: string;
  /** 프리셋 이름 (예: "FE 웹앱 로그인버그 보드뷰") */
  name: string;
  /** 선택된 서브도메인 옵션 ID (null이면 서브도메인 없음) */
  selectedSubdomainId: string | null;
  /** 경로 세그먼트별 선택값: { segmentId: optionId 또는 직접 입력값 } */
  selectedPathValues: Record<string, string>;
  /** 쿼리 파라미터별 선택값: { paramId: optionId 또는 직접 입력값 } */
  selectedQueryValues: Record<string, string>;
  /** 즐겨찾기 여부 */
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
