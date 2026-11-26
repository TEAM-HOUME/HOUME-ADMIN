/**
 * 응답 데이터 안의 null을 undefined(키 없음)로 바꾼다.
 *
 * 서버는 비어 있는 필드를 null로 내려준다 (`@JsonInclude(NON_NULL)`이 공통 응답 껍데기
 * ApiResponse에만 있고, 안쪽 DTO에는 없다). 반면 Swagger 생성 타입은 그런 필드를
 * `field?: T`(undefined)로만 표현한다. 둘이 어긋나면 `value === undefined` 검사를
 * null이 통과해 `null.toLocaleString()` 같은 런타임 에러가 난다.
 * 응답을 받는 한곳에서 맞춰 두면 화면 코드는 생성 타입만 믿으면 된다.
 *
 * 배열 안의 null은 길이를 지키기 위해 undefined로만 바꾼다.
 */
export const nullToUndefined = <T>(value: T): T => {
  if (value === null) return undefined as T;
  if (Array.isArray(value)) {
    return value.map((item: unknown) => nullToUndefined(item)) as T;
  }
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entry]) => entry !== null)
        .map(([key, entry]) => [key, nullToUndefined(entry)])
    ) as T;
  }
  return value;
};
