import { desc, eq, sql } from "drizzle-orm"

import { likes } from "@/features/likes/schema"
import { posts, type Post } from "@/features/posts/schema"
import { getUser } from "@/features/users/queries"
import { users, type User } from "@/features/users/schema"
import { db } from "@/lib/db"

export type PostWithAuthor = { post: Post; author: User; likedByMe: boolean }

// 현재 사용자가 이 글에 좋아요를 눌렀는지 — EXISTS 상관 subquery.
// currentUserId가 null/undefined면 `= null` → 매치 0행 → 항상 false(비로그인 자연 처리).
function likedByMeExpr(currentUserId: string | null | undefined) {
  return sql<boolean>`EXISTS (
    SELECT 1 FROM ${likes}
    WHERE ${likes.postId} = ${posts.id}
      AND ${likes.userId} = ${currentUserId ?? null}
  )`
}

export async function getPosts(currentUserId?: string | null): Promise<PostWithAuthor[]> {
  return db
    .select({ post: posts, author: users, likedByMe: likedByMeExpr(currentUserId) })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt))
}

export async function getPostsByUsername(
  username: string,
  currentUserId?: string | null,
): Promise<PostWithAuthor[]> {
  const user = await getUser(username)
  if (!user) return []
  return db
    .select({ post: posts, author: users, likedByMe: likedByMeExpr(currentUserId) })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.authorId, user.id))
    .orderBy(desc(posts.createdAt))
}
