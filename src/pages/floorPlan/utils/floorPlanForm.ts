import type {
  AdminFloorPlanCreateRequest,
  AdminFloorPlanResponse,
} from '@apis/__generated__/data-contracts';

export type FloorPlanFormType = AdminFloorPlanCreateRequest['forms'][number];
export type FloorPlanStructure =
  AdminFloorPlanCreateRequest['structures'][number];
export type FloorPlanEquilibrium =
  AdminFloorPlanCreateRequest['equilibriums'][number];

export interface Option<T extends string> {
  value: T;
  label: string;
}

/** 선택지와 표시 이름. 순서·문구는 SSR 대시보드 FLOOR_PLAN_*_LABELS와 같다 */
export const FORM_OPTIONS: Option<FloorPlanFormType>[] = [
  { value: 'OFFICETEL', label: '오피스텔' },
  { value: 'VILLA', label: '빌라/다세대' },
  { value: 'APARTMENT', label: '아파트' },
  { value: 'ETC', label: '그 외' },
];

export const STRUCTURE_OPTIONS: Option<FloorPlanStructure>[] = [
  { value: 'OPEN_ONE_ROOM', label: '오픈형 원룸' },
  { value: 'SEPARATED_ONE_ROOM', label: '분리형 원룸' },
  { value: 'DUPLEX', label: '복층형' },
  { value: 'TWO_ROOM', label: '투룸' },
  { value: 'THREE_ROOM_OVER', label: '쓰리룸+' },
];

export const EQUILIBRIUM_OPTIONS: Option<FloorPlanEquilibrium>[] = [
  { value: 'UNDER_5', label: '5평 이하' },
  { value: 'BETWEEN_6_10', label: '6~10평' },
  { value: 'BETWEEN_11_15', label: '11~15평' },
  { value: 'OVER_16', label: '16평 이상' },
];

/** 값 목록을 표시 이름으로 바꾼다. 비어 있으면 '-' */
export const formatOptionLabels = <T extends string>(
  values: T[] | undefined,
  options: Option<T>[]
) => {
  if (!values || values.length === 0) return '-';
  return values
    .map(
      (value) =>
        options.find((option) => option.value === value)?.label ?? value
    )
    .join(', ');
};

/** 폼에서 다루는 도면 이미지 한 장. 순서는 배열 순서가 곧 sortOrder다 */
export interface FloorPlanImageItem {
  url: string;
  filename: string;
  originalFilename: string;
  fileExtension: string;
  view: string;
}

export interface FloorPlanFormValues {
  name: string;
  forms: FloorPlanFormType[];
  structures: FloorPlanStructure[];
  equilibriums: FloorPlanEquilibrium[];
  floorPlanPrompt: string;
  images: FloorPlanImageItem[];
}

export const createEmptyFloorPlanForm = (): FloorPlanFormValues => ({
  name: '',
  forms: [],
  structures: [],
  equilibriums: [],
  floorPlanPrompt: '',
  images: [],
});

/** URL 경로의 마지막 조각 = S3에 저장된 파일 이름 (SSR extractFilenameFromUrl) */
export const extractFilenameFromUrl = (url: string) => {
  try {
    return new URL(url).pathname.split('/').filter(Boolean).pop() ?? '';
  } catch {
    return url.split('/').filter(Boolean).pop() ?? '';
  }
};

/** 목록의 도면을 수정 폼 값으로 바꾼다. 이미지는 sortOrder 순으로 정렬한다 */
export const floorPlanToFormValues = (
  floorPlan: AdminFloorPlanResponse
): FloorPlanFormValues => ({
  name: floorPlan.name ?? '',
  forms: floorPlan.forms ?? [],
  structures: floorPlan.structures ?? [],
  equilibriums: floorPlan.equilibriums ?? [],
  floorPlanPrompt: floorPlan.floorPlanPrompt ?? '',
  images: [...(floorPlan.images ?? [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .filter((image) => image.url)
    .map((image) => ({
      url: image.url ?? '',
      filename: image.filename ?? extractFilenameFromUrl(image.url ?? ''),
      originalFilename: image.originalFilename ?? '',
      fileExtension: image.fileExtension ?? '',
      view: image.view ?? '',
    })),
});

/**
 * 폼 값을 생성·수정 요청 body로 바꾼다. 잘못된 값이면 화면에 보여줄 메시지로 Error를 던진다.
 * 규칙은 SSR buildFloorPlanPayload와 같다: 이미지 1장 이상, 나머지 항목 모두 필수.
 */
export const buildFloorPlanPayload = (
  values: FloorPlanFormValues
): AdminFloorPlanCreateRequest => {
  if (values.images.length === 0) {
    throw new Error('최소 1개의 도면 이미지를 등록해주세요.');
  }

  const name = values.name.trim();
  const floorPlanPrompt = values.floorPlanPrompt.trim();

  if (
    !name ||
    values.forms.length === 0 ||
    values.structures.length === 0 ||
    values.equilibriums.length === 0 ||
    !floorPlanPrompt
  ) {
    throw new Error(
      '도면 이름, 주거형태, 구조, 평형, 도면 프롬프트를 모두 입력해주세요.'
    );
  }

  return {
    name,
    forms: values.forms,
    structures: values.structures,
    equilibriums: values.equilibriums,
    floorPlanPrompt,
    images: values.images.map((image, index) => ({
      url: image.url,
      filename: image.filename,
      originalFilename: image.originalFilename,
      fileExtension: image.fileExtension,
      sortOrder: index + 1,
      view: image.view.trim() || undefined,
    })),
  };
};
