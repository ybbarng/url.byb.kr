/** 프리셋: 특정 사이트에 대한 구성요소 선택 조합 */
export interface Preset {
  id: string;
  /** 연결된 사이트 ID */
  siteId: string;
  /** 프리셋 이름 */
  name: string;
  /** 선택된 프로토콜 UrlItem ID */
  selectedProtocolId: string;
  /** 선택된 서브도메인 UrlItem ID (null이면 서브도메인 없음) */
  selectedSubdomainId: string | null;
  /** 선택된 도메인 UrlItem ID */
  selectedDomainId: string;
  /** 선택된 경로 UrlItem ID (null이면 경로 없음) */
  selectedPathId: string | null;
  /** 선택된 쿼리 UrlItem ID 목록 */
  selectedQueryIds: string[];
  /** 즐겨찾기 여부 */
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
