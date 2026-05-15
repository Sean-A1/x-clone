import { config } from "dotenv"

config({ path: ".env.local" })

if (process.env.NODE_ENV === "production") {
  console.error("✗ Refusing to run seed in production")
  process.exit(1)
}

type SeedUser = {
  username: string
  displayName: string
  avatar: string
  bio: string
  location: string
  following: number
  followers: number
  postsCount: number
}

type SeedPost = {
  handle: string
  content: string
  replies: number
  reposts: number
  likes: number
}

const SEED_USERS: SeedUser[] = [
  {
    username: "sean_dev",
    displayName: "Sean",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "풀스택 + DevOps 학습 중. X 클론 만들면서 현업스러운 길로 우회하는 게 취미.\n잡담은 환영, 코드 리뷰는 더 환영.",
    location: "Seoul, South Korea",
    following: 184,
    followers: 312,
    postsCount: 342,
  },
  {
    username: "minacodes",
    displayName: "Mina Park",
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "Backend engineer. 분산 시스템, 데이터베이스 내부, 그리고 가끔은 카페인.",
    location: "Busan, South Korea",
    following: 421,
    followers: 1843,
    postsCount: 89,
  },
  {
    username: "hwlog",
    displayName: "Hyunwoo",
    avatar: "https://i.pravatar.cc/150?img=33",
    bio: "Frontend developer. UI 디테일에 진심. React / Tailwind / 빨간 줄 안 보이게 만드는 사람.",
    location: "Pangyo",
    following: 267,
    followers: 894,
    postsCount: 215,
  },
  {
    username: "jules",
    displayName: "Jules",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Product designer. 글보다 인터페이스로 말하는 편.",
    location: "Berlin",
    following: 52,
    followers: 138,
    postsCount: 17,
  },
]

const SEED_POSTS: SeedPost[] = [
  {
    handle: "sean_dev",
    content:
      "Next.js 16 + Tailwind v4 조합으로 X 클론 시작. 풀스택 학습이 목표라 일부러 빠른 길보다 현업스러운 길을 골라봄.",
    replies: 4,
    reposts: 1,
    likes: 23,
  },
  {
    handle: "minacodes",
    content:
      "타임라인 pull model로 먼저 만들어보고 나중에 push fanout으로 마이그레이션하는 게 학습 가치 면에서 훨씬 좋다. 결과만 보면 push가 정답인데, 왜 그게 정답인지는 pull을 직접 굴려봐야 안다.",
    replies: 12,
    reposts: 8,
    likes: 142,
  },
  {
    handle: "hwlog",
    content:
      "Shadcn Nova preset 색감이 생각보다 X 분위기랑 잘 맞는다. 다크 모드 기본 + zinc 계열 구분선.",
    replies: 2,
    reposts: 0,
    likes: 17,
  },
  {
    handle: "jules",
    content:
      "오늘의 교훈: Tailwind v4는 tailwind.config.js 없다. CSS-first config 적응되니까 오히려 깔끔함.",
    replies: 6,
    reposts: 3,
    likes: 58,
  },
]

async function main() {
  const { db } = await import("@/lib/db")
  const { users } = await import("@/features/users/schema")
  const { posts } = await import("@/features/posts/schema")

  await db.delete(posts)
  await db.delete(users)

  const userRows = SEED_USERS.map((u) => ({
    username: u.username,
    displayName: u.displayName,
    avatar: u.avatar,
    bio: u.bio,
    location: u.location,
    followingCount: u.following,
    followersCount: u.followers,
    postsCount: u.postsCount,
  }))

  const inserted = await db
    .insert(users)
    .values(userRows)
    .returning({ id: users.id, username: users.username })

  const idByUsername = new Map(inserted.map((r) => [r.username, r.id]))

  const postRows = SEED_POSTS.map((p) => {
    const authorId = idByUsername.get(p.handle)
    if (!authorId) throw new Error(`Unknown handle in seed posts: ${p.handle}`)
    return {
      authorId,
      content: p.content,
      replies: p.replies,
      reposts: p.reposts,
      likes: p.likes,
    }
  })

  await db.insert(posts).values(postRows)

  console.log(`✓ ${inserted.length} users inserted`)
  console.log(`✓ ${postRows.length} posts inserted`)
  console.log("Run `pnpm db:studio` or check Supabase Studio to verify.")

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
