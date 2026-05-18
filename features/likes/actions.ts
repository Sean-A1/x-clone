"use server"

import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { likes } from "@/features/likes/schema"
import { db } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const existing = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, user.id), eq(likes.postId, postId)))
    .limit(1)

  if (existing.length > 0) {
    await db.delete(likes).where(and(eq(likes.userId, user.id), eq(likes.postId, postId)))
  } else {
    await db.insert(likes).values({ userId: user.id, postId })
  }

  // posts.likes 카운트는 건드리지 않는다 — trigger가 자동 관리(단일 진실원천).
  // "layout"으로 홈+프로필을 모두 갱신 — useOptimistic base state가 stale props로
  // 되돌아가 하트가 revert되는 걸 막는다.
  revalidatePath("/", "layout")
}
