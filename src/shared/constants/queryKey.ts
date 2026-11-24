/**
 * 쿼리 키 factory. 도메인을 옮길 때마다 여기에 추가한다.
 * 키를 한곳에서 만들어야 invalidate할 때 오타로 캐시가 안 지워지는 일이 없다.
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    check: () => [...queryKeys.auth.all, 'check'] as const,
  },
  banner: {
    all: ['banner'] as const,
    list: () => [...queryKeys.banner.all, 'list'] as const,
    rawProductSearch: (keyword: string, size: number) =>
      [...queryKeys.banner.all, 'rawProductSearch', keyword, size] as const,
  },
} as const;
