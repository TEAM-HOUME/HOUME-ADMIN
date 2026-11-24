# HOUME-ADMIN

하우미 백오피스(어드민) 클라이언트입니다. HOUME-SERVER에 SSR로 있던 어드민 대시보드를 분리해 React로 옮기고 있습니다.

## 시작하기

```bash
cp .env.example .env   # VITE_API_BASE_URL, SWAGGER_URL 채우기
pnpm install
pnpm api:generate      # 서버 Swagger에서 API 타입 생성
pnpm dev               # http://localhost:5175
```

- 스택: Vite · React 19 · TypeScript · TanStack Query · react-router · axios · vanilla-extract (HOUME-CLIENT와 동일)
- 작업 지침: [AGENTS.md](AGENTS.md)
- 이전 진행 상황: [docs/migration-checklist.md](docs/migration-checklist.md)
