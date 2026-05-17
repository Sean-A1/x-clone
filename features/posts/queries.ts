import { desc, eq } from "drizzle-orm"

import { posts, type Post } from "@/features/posts/schema"
import { getUser } from "@/features/users/queries"
import { users, type User } from "@/features/users/schema"
import { db } from "@/lib/db"

export type PostWithAuthor = { post: Post; author: User }

export async function getPosts(): Promise<PostWithAuthor[]> {
  return db
    .select({ post: posts, author: users })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt))
}

export async function getPostsByUsername(username: string): Promise<PostWithAuthor[]> {
  const user = await getUser(username)
  if (!user) return []
  return db
    .select({ post: posts, author: users })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.authorId, user.id))
    .orderBy(desc(posts.createdAt))
}
