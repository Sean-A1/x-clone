@AGENTS.md

# x-clone

## Project context
X (Twitter) 클론. Solo learning project.
풀스택 + DevOps 학습이 목표. 현업 가까운 방식이 우선이고, 빠른 결과보다 학습 가치를 우선함.

## Stack
- Next.js 16 (App Router, **no src/**, Turbopack)
- TypeScript, ESLint
- Tailwind CSS v4 (CSS-first config in `app/globals.css`, no `tailwind.config.js`)
- Shadcn/ui (Nova preset, Lucide icons, Geist font)
- pnpm

## Database
- Provider: Supabase (managed Postgres, Seoul region)
- ORM: Drizzle (postgres.js driver)
- Schema 위치: `features/*/schema.ts` — 각 feature가 자체 테이블 정의 소유
- Migration: `drizzle/` 디렉토리에 SQL 생성. 명령은 `pnpm db:generate` → `pnpm db:migrate` (alias는 `package.json`에서 정의)
- Runtime client: `lib/db.ts` (`postgres()` + `drizzle()`, `prepare: false` 필수)
- Naming: TS camelCase ↔ DB snake_case (Drizzle 컬럼 `name("snake_case")` 인자로 명시)
- 환경변수 (`.env.local`):
  - `DATABASE_URL` — Supabase pooler 연결 (런타임 + drizzle-kit 둘 다 사용)
  - `DIRECT_URL` — direct connection (현재 미사용, 향후 마이그레이션용 보유)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Path conventions
- 라우트: `app/` (App Router)
- 컴포넌트: `components/` (Shadcn은 `components/ui/`)
- 유틸: `lib/utils.ts` (`cn()` 헬퍼)
- Import alias: `@/*` → 프로젝트 루트 (not `src/`)
- 자동 import는 non-relative (`@/components/...`)
- DB schema: `features/*/schema.ts` (각 feature가 자체 테이블 정의 소유)

## Code style
- Prettier: `semi: false`, `singleQuote: false`, width 100
- Tailwind 클래스 auto-sort (prettier-plugin-tailwindcss)
- ESLint auto-fix on save
- Save 시 `source.organizeImports` 실행

## Workflow
- 코드는 Claude Code가 작성. human은 **의도/결정/diff 리뷰** 책임
- Plan mode를 큰 리팩토링이나 새 모듈 구조 도입 전에 사용
- Diff 리뷰: VS Code Git Graph에서 ctrl+click 비교 또는 GitHub PR "Files changed"
- 모르는 패턴은 claude chat에 분석 요청 후 수용 — 무조건 accept 금지
- claude chat은 **Filesystem MCP**로 repo에 read-only 접근 (코드 인용·근거 기반 답변 가능)

## Server vs Client Components
- App Router 기본은 Server Component
- `"use client"` 디렉티브가 필요한 경우:
  - React 훅 사용 (useState, useEffect, useTheme 등)
  - 이벤트 핸들러 (onClick, onChange)
  - 브라우저 API (localStorage, window)
  - React Context 생성
- Secret/환경변수는 절대 Client Component에 두지 않음 (브라우저에 노출됨)

### 현재 Client Component
- `components/mode-toggle.tsx` (`useTheme`)
- `features/posts/components/composer.tsx` (`useState` + `onChange` + `onClick`)

그 외 모든 컴포넌트는 Server. 새로 만들 때도 위 4가지 사유(훅/이벤트/브라우저 API/Context) 없으면 Server 유지.

## Current state — Phase 1 (MVP, in progress)
### Done
- Home timeline mock UI (LeftSidebar / Composer / PostCard / RightSidebar)
- Dark / Light / System theme toggle
- Semantic token migration
- Profile page (dynamic route `/profile/[username]`, async `params`, `notFound()`)
- Composer interactive (useState, controlled component, 280-char counter, 260+ 노란색 / 281+ destructive)
- Supabase Postgres + Drizzle ORM 셋업
- `users` / `posts` schema + 첫 migration (`drizzle/0000_red_corsair.sql`)

### Next
- **F1.2** mock → DB seed
- **F1.3** Read 통합 (mock 제거, `queries.ts` 도입) — 이 단계에서 naming drift reconcile: `User.following/followers` ↔ `usersTable.followingCount/followersCount` 합치기
- **F1.4** Supabase Auth (Google OAuth)
- **F1.5** Write 통합 (Server Action via `actions.ts`)

### Held decisions (re-suggest 금지)
- Timeline은 **pull model** 먼저. push로의 마이그레이션은 의도된 학습 경험.
- DB는 **Supabase** 결정됨. 단, Phase 1 초반은 in-component mock 데이터로 시작.
- Auth는 **Supabase Auth** (DB 통합 시점에 도입).
- ORM은 **Drizzle**.

## Architecture intent (Phase 1 후반부터 적용)
Feature-based modules:
    features/
      posts/      (components/, schema.ts, mock.ts, actions.ts, queries.ts, types.ts)
      users/
      follow/
      timeline/
      likes/
      reposts/

- 각 feature는 다른 feature의 internal import 금지
- Cross-feature는 public API (`actions.ts`, `queries.ts`)로만

Feature 진화 단계 (Phase 1 동안):
1. `mock.ts`    — in-memory mock으로 UI 골격 확정
2. `schema.ts`  — Drizzle 테이블 정의
3. `queries.ts` — Read 통합 (mock 제거 트리거)
4. `actions.ts` — Write 통합 (Server Action)

## Out of scope (지금 도입 X)
- **Tests**: Phase 1 기능 완성 후 도입
- **AI features** (추천 피드, semantic search, agent reply): Phase 3+
- **DevOps 고급** (Oracle Cloud / AWS 일부 마이그레이션): Phase 3
- **ESLint `import/order` 플러그인**: 도입 X. 수동 정리로 충분
- **Rich text editor / contentEditable**: 도입 X. textarea + plain text가 final form

## Future tooling notes
- **Claude Design**: Phase 1 MVP 완료 후 검토. 특히 프로필 페이지 같은 디자인 탐색 작업부터.
- 호스팅 전략: 현재 Vercel + Supabase (Phase 1). Phase 3에서 일부 워크로드를 Oracle Cloud / AWS로 이전.

## Known gotchas
- Tailwind v4 IntelliSense는 `app/globals.css`의 `@import "tailwindcss"` 로 활성화 (v3의 `tailwind.config.js` 방식 아님)
- Squash merge 후 로컬 브랜치는 항상 `git branch -D` (소문자 `-d`는 SHA 불일치로 거부됨)
- Tailwind v4 권고: `w-[275px]` 같은 arbitrary value는 `w-68.75` 같은 canonical class로도 가능. 둘 다 동일 동작.
- Supabase + WSL: direct connection은 IPv6-only라 WSL에서 hang됨. `drizzle.config.ts`도 pooler(`DATABASE_URL`) 사용
- postgres.js + Supabase pooler: `prepare: false` 필수 (pooler가 prepared statements 미지원)
- Supabase 콘솔이 주는 connection string의 `[YOUR-PASSWORD]`는 **대괄호 포함**해서 통째로 교체
