/// <reference types="vite/client" />

/**
 * 코드에서 쓰는 `import.meta.env.VITE_*`를 전부 여기에 선언한다.
 *
 * 여기에 없는 이름은 Vite가 기본 제공하는 `[key: string]: any` 인덱스 시그니처로
 * 떨어진다. 그러면 이름을 오타 내도 컴파일이 통과하고 런타임에 undefined가 된다.
 */
interface ImportMetaEnv {
  /** API 서버 주소. HOUME-CLIENT와 같은 값 */
  readonly VITE_API_BASE_URL?: string;
}
