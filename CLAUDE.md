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
- Migration: `drizzle/` 디렉토리에 SQL 생성. 명령은 `pnpm db:generate` → `pnpm db:migrate` (alias는 `package.json`)
  - schema diff가 아닌 SQL(trigger 등)은 `pnpm db:generate --custom --name xxx`로 빈 파일 생성 후 직접 작성 — `meta/_journal.json`에 정식 등록되어 `db:migrate`가 결정적으로 적용
- drizzle-kit `schemaFilter: ["public"]` — `auth` 등 Supabase 소유 스키마는 drizzle-kit 비관리 (cross-schema FK 제약만 내보냄)
- Runtime client: `lib/db.ts` (`postgres()` + `drizzle()`, `prepare: false` 필수)
- Naming: TS camelCase ↔ DB snake_case (Drizzle 컬럼 `name("snake_case")` 인자로 명시)
- 환경변수 (`.env.local`):
  - `DATABASE_URL` — Supabase pooler 연결 (런타임 + drizzle-kit 둘 다 사용)
  - `DIRECT_URL` — direct connection (현재 미사용, 향후 마이그레이션용 보유)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Auth
- Supabase Auth + **Google OAuth** (F1.4~F1.5a, 도입 완료)
- `@supabase/ssr` 클라이언트는 용도별 3분리 (`lib/supabase/`):
  - `server.ts` — `createClient()` (async, `cookies()` 사용). Server Component / Server Action / Route Handler용
  - `client.ts` — `createClient()` (브라우저). Client Component용
  - `proxy.ts` — `updateSession()`. proxy(아래)에서 매 요청 세션 refresh
- **`proxy.ts`** (프로젝트 루트) — Next.js 16에서 `middleware.ts`가 `proxy.ts`로 rename됨. static/image 제외 전 경로에서 `updateSession()` 호출 (gotcha 참조)
- OAuth 흐름: `components/sign-in-with-google-button.tsx` → Google → `app/auth/callback/route.ts`가 code→session 교환 → `/`
- 로그인 페이지: `app/login/page.tsx` (이미 로그인 상태면 `/`로 redirect)
- **auth.users ↔ public.users = shared primary key**: `public.users.id`가 `auth.users(id)`에 대한 FK이자 PK (Supabase 표준 profiles 패턴). auth user가 곧 앱 user — 별도 매핑 컬럼 없음
- 자동 프로비저닝: signup(=`auth.users` INSERT) 시 Postgres trigger `handle_new_user()` (`SECURITY DEFINER`, `search_path=''`)가 `public.users` 프로필 row 생성. 위치: `drizzle/0002_user_trigger.sql`

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
- Plan mode를 큰 리팩토링이나 새 모듈 구조 도입 전에 사용. **Plan은 항상 검토 후 approve — 무조건 accept 금지**
- Claude Code는 **Context7 MCP + Explore 에이전트**로 라이브러리 docs·코드베이스 사실을 검증한 뒤 작성
- Diff 리뷰: VS Code Git Graph에서 ctrl+click 비교 또는 GitHub PR "Files changed"
- 모르는 패턴은 claude chat에 분석 요청 후 수용 (claude chat은 **Filesystem MCP**로 repo read-only 접근)
- Git: PR 단위 작업 → **squash merge only**. 머지 후 로컬 브랜치는 `git branch -D` (gotcha 참조)
- 커밋 메시지: **Conventional Commits** (`feat:` / `chore:` / `docs:` / `refactor:` / `style:`)

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
- `components/theme-provider.tsx` (next-themes Context provider)
- `components/sign-in-with-google-button.tsx` (`onClick` + `window.location.origin` + 브라우저 Supabase client)
- `features/posts/components/composer.tsx` (`useState` + `onChange`; 내부적으로 `ActiveComposer`/`GuestComposer`로 분리됐지만 같은 파일·같은 `"use client"`)
- `features/likes/components/like-button.tsx` (`useOptimistic` + `startTransition` + `onClick`)

그 외 author 작성 컴포넌트는 모두 Server. 새로 만들 때도 위 4가지 사유(훅/이벤트/브라우저 API/Context) 없으면 Server 유지.
> shadcn `components/ui/*` (avatar, dropdown-menu 등 Radix wrapper)는 본질적으로 client지만 vendored 코드라 이 목록의 추적 대상이 아님.

### Server Action 위치
- Server Component 내부 액션 → 그 안에 인라인 `"use server"` (예: `components/user-menu.tsx`의 `signOut`)
- Client Component가 호출하는 액션 → 별도 `features/*/actions.ts`, 파일 맨 위 `"use server"` (예: `composer.tsx` → `features/posts/actions.ts`의 `createPost`)

## Current state — Phase 1 MVP (v0.1.0, complete)
### Done
- Home timeline mock UI (LeftSidebar / Composer / PostCard / RightSidebar)
- Dark / Light / System theme toggle + semantic token migration
- Profile page (dynamic route `/profile/[username]`, async `params`, `notFound()`)
- Composer interactive (controlled `useState`, 280-char counter — 260+ 노란색 / 281+ destructive)
- Supabase Postgres + Drizzle ORM 셋업, `users`/`posts` schema + 첫 migration (`0000_red_corsair.sql`)
- **F1.2** mock 데이터 DB seed (seed script는 이후 trigger 도입으로 졸업·삭제)
- **F1.3** Read 통합 — mock 제거, `features/*/queries.ts` 도입
- **F1.4** Supabase Auth (Google OAuth) — `proxy.ts` 세션 refresh, OAuth 콜백, login 페이지, user menu
- **F1.5a** auth.users ↔ public.users 매핑 — shared PK FK + 자동 프로비저닝 trigger
- **F1.5b** Composer Server Action (`createPost`) — write 통합 완료, mock→DB 전환 종료
- **F1.6** Like 기능 — `likes` junction 테이블 + 카운트 trigger, `toggleLike` Server Action, `useOptimistic` 좋아요 버튼

### Next — Phase 2 (미정)
Phase 1 MVP 완료. Phase 2 범위는 본인 결정 후 채움.

후보:
- Follow / Like / Repost (X 핵심 인터랙션)
- Optimistic update / `useActionState` (mutation UX 개선)
- `users.postsCount` 자동 증가 (Postgres trigger 또는 application 측)
- Username 충돌 dedupe + 직접 선택 onboarding
- Tests 도입 (Phase 1 완료, 시점 본인 판단)
- Phase 3 미리보기: Oracle Cloud / AWS 마이그레이션, AI features (추천 / semantic search / agent reply)

### Held decisions (re-suggest 금지)
- Timeline은 **pull model** 먼저. push로의 마이그레이션은 의도된 학습 경험.
- DB는 **Supabase**, ORM은 **Drizzle**. (in-component mock으로 시작하는 단계는 졸업)
- Auth는 **Supabase Auth (Google OAuth)** — 도입 완료.
- `auth.users.id` = `public.users.id` (**shared primary key**) — auth user가 곧 앱 user.
- 비로그인도 타임라인·프로필 **자유 열람**. 강제 redirect 없음 — mutation 시점(글쓰기 등)에만 `/login`으로 유도.
- 인게이지먼트 브랜드 컬러(blue / green / pink)는 **theme-independent** — semantic token 아닌 고정 Tailwind 팔레트. 의도된 예외.

## Architecture intent (현재 적용 중)
Feature-based modules:
    features/
      posts/    — components/, schema.ts, queries.ts, actions.ts   (mock 졸업, 진화 4단계 완주)
      users/    — components/, schema.ts, queries.ts               (write는 auth trigger가 처리 → actions.ts 없음)
      likes/    — components/, schema.ts, actions.ts                (read는 posts/queries.ts가 likedByMe EXISTS subquery로 흡수 → 자체 queries.ts 없음)
      follow/   — 미생성
      timeline/ — 미생성
      reposts/  — 미생성

- 각 feature는 다른 feature의 internal import 금지
- Cross-feature는 public API (`queries.ts`, `actions.ts`) + export된 컴포넌트로만 (예: `like-button.tsx`를 `post-card.tsx`가 사용)

Feature 진화 단계:
1. `mock.ts`    — in-memory mock으로 UI 골격 확정
2. `schema.ts`  — Drizzle 테이블 정의
3. `queries.ts` — Read 통합 (mock 제거 트리거)
4. `actions.ts` — Write 통합 (Server Action)
→ `posts`는 4단계 완주. `users`는 write를 trigger가 대신해 `actions.ts` 불필요.

## Out of scope (지금 도입 X)
- **Tests**: Phase 1 기능 완성 후 도입 — Phase 1 MVP가 완료됐으므로 도입 시점은 본인 판단
- **AI features** (추천 피드, semantic search, agent reply): Phase 3+
- **DevOps 고급** (Oracle Cloud / AWS 일부 마이그레이션): Phase 3
- **ESLint `import/order` 플러그인**: 도입 X. 수동 정리 + `organizeImports`로 충분
- **Rich text editor / contentEditable**: 도입 X. textarea + plain text가 final form
- **`useActionState` pending UI**: 도입 X. Composer는 plain form action. (`useOptimistic`은 F1.6 Like에서 도입 — 좋아요 즉시 반응)
- **카운터 자동 증가**: `posts.likes`는 F1.6에서 Postgres trigger로 자동 관리. `users.postsCount` 등 나머지 카운터는 여전히 도입 X
- **Username 충돌 dedupe**: 도입 X. email local-part 그대로 사용 (solo project라 허용)
- **Username 직접 선택 onboarding 흐름**: 도입 X. trigger가 email local-part로 자동 생성

## Future tooling notes
- **Claude Design**: Phase 1 MVP 완료 — 프로필 페이지 같은 디자인 탐색 작업부터 검토 가능.
- 호스팅 전략: 현재 Vercel + Supabase (Phase 1). Phase 3에서 일부 워크로드를 Oracle Cloud / AWS로 이전.

## Known gotchas
- Tailwind v4 IntelliSense는 `app/globals.css`의 `@import "tailwindcss"` 로 활성화 (v3의 `tailwind.config.js` 방식 아님)
- Squash merge 후 로컬 브랜치는 항상 `git branch -D` (소문자 `-d`는 SHA 불일치로 거부됨)
- Tailwind v4 권고: `w-[275px]` 같은 arbitrary value는 `w-68.75` 같은 canonical class로도 가능. 둘 다 동일 동작.
- Supabase + WSL: direct connection은 IPv6-only라 WSL에서 hang됨. `drizzle.config.ts`도 pooler(`DATABASE_URL`) 사용
- postgres.js + Supabase pooler: `prepare: false` 필수 (pooler가 prepared statements 미지원)
- Supabase 콘솔이 주는 connection string의 `[YOUR-PASSWORD]`는 **대괄호 포함**해서 통째로 교체
- **Next.js 16: `middleware.ts` → `proxy.ts`로 rename**됨 (export 함수명도 `proxy`). AGENTS.md "NOT the Next.js you know"의 실제 사례
- PL/pgSQL 등 Postgres-특화 SQL은 일반 SQL formatter(adpyke 등)가 미지원 — `drizzle/*.sql` trigger 파일은 자동 정렬 안 됨, 수동 유지
- 브라우저 확장(password manager, Grammarly 등)이 dev 중 hydration warning을 유발할 수 있음 — 시크릿 모드에서 격리 진단
