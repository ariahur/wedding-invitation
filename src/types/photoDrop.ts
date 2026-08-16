/** 수하물 카운터 운영 상태 */
export type CounterStatus = 'closed' | 'open' | 'archived';

/** 사진 접수 후 발급되는 수하물 태그 (로컬 스토리지 저장) */
export interface BagTag {
  /** 태그 번호 (예: DA206-0431) */
  tagNo: string;
  name: string;
  /** 지금까지 이 기기에서 부친 총 사진 수 */
  photoCount: number;
  /** 최초 접수 시각 (ISO) */
  acceptedAt: string;
}

export type PhotoItemStatus = 'pending' | 'uploading' | 'done' | 'error';

/** 접수 대기 중인 사진 한 장 */
export interface PhotoItem {
  id: string;
  file: File;
  previewUrl: string;
  status: PhotoItemStatus;
}
