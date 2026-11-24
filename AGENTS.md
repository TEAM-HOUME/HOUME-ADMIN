# AGENTS.md

HOUME 백오피스(어드민) 클라이언트에서 작업할 때 참고하는 지침입니다. **AI 에이전트와 사람이 같이 읽습니다.**

HOUME-SERVER의 SSR 어드민(`templates/admin/dashboard.html`)을 React로 옮기고, 서버의 어드민 JSON API(`/api/v1/admin/**`, `/api/admin/v1/compare/**`)에 연동하는 레포입니다. 옮기는 진행 상황은 [docs/migration-checklist.md](docs/migration-checklist.md)에서 관리합니다.

## 컨벤션

**코드 컨벤션은 HOUME-CLIENT와 같습니다.** 원본(SSOT)은 HOUME-CLIENT의 `docs/conventions.md`이고, ESLint·tsconfig·Prettier 설정도 그 레포에서 가져왔습니다. 규칙이 바뀌면 그쪽을 기준으로 맞춥니다.

요약 체크리스트 (상세는 위 문서):

- **네이밍** — 폴더 camelCase / 컴포넌트 `PascalCase.tsx` / 스타일 `PascalCase.css.ts` / 페이지 `{Feature}Page` / 쿼리 훅 `use{Subject}Query` / mutation 훅 `use{Subject}Mutation` / API 함수 `{httpMethod}{Subject}` / 상수 UPPER_SNAKE_CASE
- **API** — 모든 호출은 `request<T>()` 경유(axiosInstance 직접 사용 금지). 쿼리 키는 `queryKeys` factory. 1파일 = 1 API 작업(bare 함수 + 훅 colocate)
- **경로** — `navigate()`·`<Navigate>`는 `ROUTES` 상수(`@routes/paths`). 하드코딩 금지
- **스타일** — 폰트는 `fontVars`, 색상은 `colorVars` (토큰은 HOUME-CLIENT에서 복사)
- **Export** — 컴포넌트는 default, 훅·유틸·상수·타입은 named
- **Provider** — `src/main.tsx`에서만 추가
- **[도구]** import 경로(최단 alias, barrel 금지), 페이지 간 import 금지, 환경변수는 `src/vite-env.d.ts`에 선언

## 웹(HOUME-CLIENT)과 다른 점 — 인증

- 로그인: `POST /api/v1/admin/login` (`email` 필드 = 어드민 **아이디**) → `accessToken` (24시간)
- **리프레시 토큰이 없습니다.** 웹의 `/reissue` 재발급 로직을 가져오지 않습니다. `withCredentials`도 쓰지 않습니다
- 401 · 403 · 코드 `40002`(만료, HTTP 400으로 옴) · `40103` · `40104` → 토큰 삭제 후 로그인 화면 (`src/shared/apis/config/axiosInstance.ts`)
- 403은 응답 바디가 없습니다. 에러 메시지 키는 `msg`/`message` 두 가지라 `getApiErrorMessage()`로 읽습니다
- 로그인 실패(404 `40401`)는 로그인 화면에서 메시지로 보여줍니다 — 위의 로그인 이동 대상에서 제외

## 개발 명령어

```bash
pnpm dev              # 개발 서버 — 포트 5175 고정 (서버 CORS가 이 포트만 허용)
pnpm build            # 프로덕션 빌드
pnpm typecheck        # 타입 검사만
pnpm lint             # ESLint
pnpm format           # Prettier
pnpm api:generate     # .env의 SWAGGER_URL로 src/shared/apis/__generated__ 타입 생성
```

CI가 머지 전에 돌리는 것: `pnpm lint:ci`, `pnpm format:check`, `pnpm knip:ci`, `pnpm build`

## 건드리면 안 되는 것

- `src/shared/apis/__generated__/` — Swagger에서 생성. 직접 고치지 말고 `pnpm api:generate`로 다시 만든다
- 서버 레포(HOUME-SERVER) — 이 레포 작업 중에는 읽기만 한다. API가 부족하면 서버 팀에 요청한다

## Git 워크플로우

- 브랜치: `develop`에서 분기 → `develop`으로 merge
- 브랜치 이름: `type/description/#issue-number` (예: `feat/banner/#12`)
- 커밋: `type: 제목` (한국어). types: `feat` `fix` `refactor` `style` `design` `chore` `docs` `test` `rename` `remove`
