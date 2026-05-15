import { eq } from "drizzle-orm"

import { users, type User } from "@/features/users/schema"
import { db } from "@/lib/db"

export async function getUser(username: string): Promise<User | null> {
  const rows = await db.select().from(users).where(eq(users.username, username)).limit(1)
  return rows[0] ?? null
}
