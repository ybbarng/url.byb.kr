/** 사이트: URL 템플릿의 최상위 단위 */
export interface Site {
  id: string;
  /** 사용자가 지정한 사이트 이름 */
  name: string;
  /** 사이트 설명 */
  description: string;
  createdAt: string;
  updatedAt: string;
}
