# SSR 어드민 → HOUME-ADMIN 이전 체크리스트

HOUME-SERVER의 SSR 어드민을 이 레포로 **전부** 옮기기 위한 체크리스트입니다. 화면 기준은 서버의 `houme-api/src/main/resources/templates/admin/dashboard.html`이고, API는 연동 가이드(Swagger 기준, PR #697 반영)를 따릅니다.

- 기준 커밋: HOUME-SERVER `develop` `6663a32` (2026-11-24)
- 대시보드 구조: 사이드바 탭 13개짜리 단일 페이지. 서버는 HTML만 내려주고, 데이터는 전부 JS가 JSON API를 직접 호출한다 → **SSR 전용 데이터는 없다**
- 화면을 옮기면 체크하고, `src/routes/adminMenu.ts`의 해당 메뉴에 `path`를 채운다

## 옮기지 않는 것

| 항목                                 | 이유                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `/admin/login` (SSR 로그인)          | 이 레포의 로그인 화면이 `POST /api/v1/admin/login`으로 대체               |
| `/admin/dashboard?token=`            | 토큰을 URL에 싣는 방식은 쓰지 않는다. `Authorization: Bearer` 헤더만 쓴다 |
| `signup.html`, `signup-success.html` | 서버에서 `/admin/register` API가 주석 처리돼 있어 동작하지 않는다         |

## 탭별 매핑

### 0. 공통

- [x] 로그인 — `POST /api/v1/admin/login`
- [x] 토큰 확인(보호 라우트) — `GET /api/v1/admin/test`
- [x] 세션 만료 처리 — 401 · 403 · `40002` · `40103` · `40104` → 로그인 화면
- [ ] 이미지 업로드 (아래 두 방식)
  - [x] 공통 (`useImageUploadMutation`, `ImageUploadField`): `POST .../image-upload-url?contentType=` + `{ imageExtension }` → `uploadUrl`에 PUT (Authorization 헤더 없이) → 생성·수정 API에 `publicUrl` 전달 — 배너·랜딩·스타일·도면
  - [ ] 예외: 등록 API 응답의 `presignedUrl`로 바로 PUT — 무드보드, 가구 프롬프트

### 1. 가구 관리

- [ ] 등록된 가구 목록 — `GET /api/v1/admin/furnitures`
- [ ] 신규 가구 등록 — `POST /api/v1/admin/furniture`
- [ ] 가구 정보 수정 — `PATCH /api/v1/admin/furniture`
- [ ] 가구 삭제 — `DELETE /api/v1/admin/furniture`
- [ ] 가구 프롬프트 등록 (이미지 포함, presignedUrl 방식) — `POST /api/v1/admin/furniture/prompt`
- [ ] 프롬프트 조회 — `GET /api/v1/admin/furniture/prompt`
- [ ] 가구 태그 삭제 — `DELETE /api/v1/admin/furniture/tag`
- [ ] 태그 드롭다운 — `GET /api/v1/admin/furniture/tags`
- [ ] [기획 의사결정용] 가구 제품 조회 — `GET /api/v1/generated-images/{tagId}/curations/products/{furnitureId}/for-plan`
- [ ] [기획 의사결정용 V2] mall/NPay 필터 — `GET .../for-plan/detail`
  - for-plan 2개는 가이드상 삭제 후보. 어드민 토큰으로 호출하면 `userName = null`

### 2. 가구 타입 관리

- [ ] 목록 — `GET /api/v1/admin/furniture/types`
- [ ] 등록 · 수정 · 삭제 — `POST` · `PATCH` · `DELETE /api/v1/admin/furniture/type`
- [ ] 타입별 하위 가구 — `GET /api/v1/admin/furniture/types/{furnitureTypeId}/furnitures`
- [ ] 타입별 furniture_tag — `GET /api/v1/admin/furniture/types/{furnitureTypeId}/tags`

### 3. 태그 관리 (스타일 태그)

- [ ] 목록 — `GET /api/v1/admin/tags`
- [ ] 생성 · 수정 · 삭제 — `POST` · `PATCH` · `DELETE /api/v1/admin/tag`

### 4. 무드보드 관리

- [ ] 이미지 업로드 (presignedUrl 방식) — `POST /api/v1/admin/moodboard`
- [ ] 전체 보기 — `GET /api/v1/admin/moodboards`
- [ ] 삭제 — `DELETE /api/v1/admin/moodboard`

### 5. RAW 상품 관리 (큐레이션 원본 상품) — 가장 복잡

- [ ] 목록 · 필터 — `GET /api/v1/admin/curation-raw-products`
- [ ] 상세 — `GET /api/v1/admin/curation-raw-products/{id}`
- [ ] 추가 · 수정 · 삭제 — `POST /api/v1/admin/curation-raw-products`, `PATCH` · `DELETE .../{id}`
- [ ] 노출 여부 일괄 수정 — `PATCH /api/v1/admin/curation-raw-products/exposure`
- [ ] 색상 옵션 — `GET /api/v1/admin/curation-raw-products/color-options`
- [ ] 가구 매핑 추가 · 교체 · 삭제 — `POST .../{id}/furniture-tags`, `PATCH` · `DELETE .../{id}/furniture-tags/{mappingId}`

### 6. 랜딩 관리 — ✅ 완료 (`/landings`)

- [x] 목록 — `GET /api/v1/admin/landings` (수정 폼은 목록 데이터로 채움. 상세 `GET .../{landingId}`는 쓰지 않음)
- [x] 등록 · 수정 · 삭제 — `POST /api/v1/admin/landings`, `PATCH` · `DELETE .../{landingId}`
- [x] 이미지 업로드 (공통 방식) — `POST /api/v1/admin/landings/image-upload-url`

### 7. 배너 관리 — ✅ 완료 (`/banners`)

- [x] 목록 — `GET /api/v1/admin/banners` (수정 폼은 SSR처럼 목록 데이터로 채움. 상세 `GET .../{bannerId}`는 쓰지 않음)
- [x] 등록 · 수정 · 삭제 — `POST /api/v1/admin/banners`, `PATCH` · `DELETE .../{bannerId}`
- [x] 이미지 업로드 (공통 방식) — `POST /api/v1/admin/banners/image-upload-url`
- [x] 스타일 답변 칩, 배너에 매핑된 가구 (RAW 상품 검색) — `GET /api/v1/admin/banners/raw-products/search`

### 8. 스타일로 시작하기 관리

- [ ] 목록 · 상세 — `GET /api/v1/admin/styles`, `GET .../{styleId}`
- [ ] 등록 · 수정 · 삭제 — `POST /api/v1/admin/styles`, `PATCH` · `DELETE .../{styleId}`
- [ ] 이미지 업로드 (공통 방식) — `POST /api/v1/admin/styles/image-upload-url`
- [ ] 스타일에 매핑된 가구 (RAW 상품 검색) — `GET /api/v1/admin/styles/raw-products/search`

### 9. 도면 관리 — ✅ 완료 (`/floor-plans`)

- [x] 목록 — `GET /api/v1/admin/floor-plans` (수정 폼은 목록 데이터로 채움. 상세 `GET .../{floorPlanId}`는 쓰지 않음)
- [x] 등록 · 수정 · 삭제 — `POST /api/v1/admin/floor-plans`, `PATCH` · `DELETE .../{floorPlanId}`
- [x] 이미지 업로드 (공통 방식, 여러 장 · view · 순서) — `POST /api/v1/admin/floor-plans/image-upload-url`
- SSR의 단일 필드 fallback(`form`·`structure`·`equilibrium`)은 옮기지 않음 — 서버 `AdminFloorPlanServiceImpl.toResponse()`가 JSON 다중 매핑이 비어 있으면 단일 컬럼 값으로 배열을 채워 내려준다 (이미지도 같은 방식). 응답에 단일 필드는 없다

### 10. 회원 크레딧 추가

- [ ] 회원 검색 (이메일 완전일치 · 닉네임 부분검색) — `GET /api/v1/admin/members`
- [ ] 크레딧 지급 — `POST /api/v1/admin/members/{memberId}/credits`

### 11. 가격비교 검색 (의사결정용) — prefix가 `/api/admin/v1`로 다름

- [ ] 자체 카탈로그 임베딩 배치 — `POST /api/admin/v1/compare/curation-embedding/trigger?limit=`
- [ ] 텍스트 검색 — `POST /api/admin/v1/compare/text-search`
- [ ] 이미지 검색 — `POST /api/admin/v1/compare/image-search`

### 12. 프리셋 관리

- [ ] 목록 · 등록 · 수정 · 삭제 — `GET` · `POST /api/admin/v1/compare/presets`, `PUT` · `DELETE .../{presetId}`
- [ ] 수정용 상세 조회 — `GET /api/v1/price-compare/presets/{presetId}` ⚠️ 아래 확인 필요 1

### 13. Gemini 검색어 검증

- [ ] 검색어 변환 테스트 — `POST /api/admin/v1/compare/keyword-check`

## 서버 팀에 확인할 것

1. **프리셋 상세 조회가 어드민 API가 아니다.** SSR은 수정 화면을 채울 때 `GET /api/v1/price-compare/presets/{presetId}`(공개 API, WhiteListConfig에 permitAll)를 토큰 없이 호출한다. 그대로 쓰면 되는지, 어드민용 상세 API가 따로 필요한지
2. **가이드에 있는데 SSR이 안 쓰는 API** — 화면에 넣을지
   - `POST /api/v1/admin/curations/soozip/raw` (Soozip 원본 수집 저장) — 크롤러·확장 프로그램 전용인지
3. **for-plan 2개**(가구 관리 탭) — 삭제 후보라는데 옮길지
4. **운영 도메인 CORS** — 배포 도메인이 정해지면 `SecurityConfig` `allowedOrigins`에 추가 요청
5. **PR #697 CodeRabbit 미해결 리뷰** — `isAdminToken`이 만료 처리 `try` 밖에 있어, 만료 토큰이 `40002`가 아닌 다른 형태(5xx 등)로 올 수 있는지
