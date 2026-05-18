import { sql } from "drizzle-orm"
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core"

import { posts } from "@/features/posts/schema"
import { users } from "@/features/users/schema"

export const likes = pgTable(
  "likes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  // composite PK — 한 사용자가 한 글에 좋아요 단 한 번을 DB가 강제.
  (t) => [primaryKey({ columns: [t.userId, t.postId] })],
)

export type Like = typeof likes.$inferSelect
export type NewLike = typeof likes.$inferInsert
