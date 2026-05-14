import { sql } from "drizzle-orm"
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
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
