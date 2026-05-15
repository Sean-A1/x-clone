import { config } from "dotenv"

config({ path: ".env.local" })

if (process.env.NODE_ENV === "production") {
  console.error("✗ Refusing to run seed in production")
  process.exit(1)
}

async function main() {
  const { db } = await import("@/lib/db")
  const { users } = await import("@/features/users/schema")
  const { posts } = await import("@/features/posts/schema")
  const { MOCK_USERS } = await import("@/features/users/mock")
  const { MOCK_POSTS } = await import("@/features/posts/mock")

  await db.delete(posts)
  await db.delete(users)

  const userRows = Object.values(MOCK_USERS).map((u) => ({
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

  const postRows = MOCK_POSTS.map((p) => {
    const authorId = idByUsername.get(p.handle)
    if (!authorId) throw new Error(`Unknown handle in mock posts: ${p.handle}`)
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
