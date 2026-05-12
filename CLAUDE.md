@AGENTS.md

# x-clone

@AGENTS.md

## Project context
X (Twitter) 클론. Solo learning project.
풀스택 + DevOps 학습이 목표. 현업 가까운 방식이 우선이고, 빠른 결과보다 학습 가치를 우선함.

## Stack
- Next.js 16 (App Router, **no src/**, Turbopack)
- TypeScript, ESLint
- Tailwind CSS v4 (CSS-first config in `app/globals.css`, no `tailwind.config.js`)
- Shadcn/ui (Nova preset, Lucide icons, Geist font)
- pnpm

## Path conventions
- 라우트: `app/` (App Router)
- 컴포넌트: `components/` (Shadcn은 `components/ui/`)
- 유틸: `lib/utils.ts` (`cn()` 헬퍼)
- Import alias: `@/*` → 프로젝트 루트 (not `src/`)
- 자동 import는 non-relative (`@/components/...`)

## Code style
- Prettier: `semi: false`, `singleQuote: false`, width 100
- Tailwind 클래스 auto-sort (prettier-plugin-tailwindcss)
- ESLint auto-fix on save
- Save 시 `source.organizeImports` 실행

## Current state — Phase 1 (MVP, in progress)
- Post CRUD
- Follow / Unfollow
- Home timeline (pull model)
- Like / Repost

### Held decisions (re-suggest 금지)
- Timeline은 **pull model** 먼저. push로의 마이그레이션은 의도된 학습 경험.
- DB는 **Supabase** 결정됨. 단, Phase 1 초반은 in-component mock 데이터로 시작.
- Auth는 **Supabase Auth** (DB 통합 시점에 도입).

## Architecture intent (Phase 1 후반부터 적용)
Feature-based modules:
    features/
    posts/      (components/, actions.ts, queries.ts, types.ts)
    follow/
    timeline/
    likes/
    reposts/

- 각 feature는 다른 feature의 internal import 금지
- Cross-feature는 public API (`actions.ts`, `queries.ts`)로만

## Out of scope (지금 도입 X)
- **Tests**: Phase 1 기능 완성 후 도입
- **AI features** (추천 피드, semantic search, agent reply): Phase 3+
- **DevOps 고급** (Oracle Cloud / AWS 일부 마이그레이션): Phase 3

## Future tooling notes
- **Claude Design**: Phase 1 MVP 완료 후 검토. 특히 프로필 페이지 같은 디자인 탐색 작업부터. Phase 1 중에는 도입 X — 현재 학습 목표가 hands-on Tailwind/React 익히기.
- 호스팅 전략: 현재 Vercel + Supabase (Phase 1). Phase 3에서 일부 워크로드를 Oracle Cloud / AWS로 이전해 DevOps 경험 추가.

## Known gotchas
- Tailwind v4 IntelliSense는 `app/globals.css`의 `@import "tailwindcss"` 로 활성화 (v3의 `tailwind.config.js` 방식 아님)
- Squash merge 후 로컬 브랜치는 항상 `git branch -D` (소문자 `-d`는 거부됨, SHA 불일치 때문)