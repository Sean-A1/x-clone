import { sql } from "drizzle-orm"
import { integer, pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

// Supabase가 소유·관리하는 `auth` 스키마. `users.id`가 타입이 있는 FK를
// 걸 수 있도록 `auth.users`의 얇은 stub만 선언한다. drizzle-kit은 이 테이블을
// 관리하지 않는다(drizzle.config.ts의 schemaFilter=["public"]) — FK 제약만
// 생성하고 auth.users에 대한 CREATE TABLE은 내보내지 않는다.
const authSchema = pgSchema("auth")
const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
})

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  bio: text("bio").notNull().default(""),
  location: text("location"),
  joinedAt: timestamp("joined_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  postsCount: integer("posts_count").notNull().default(0),
  followingCount: integer("following_count").notNull().default(0),
  followersCount: integer("followers_count").notNull().default(0),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
