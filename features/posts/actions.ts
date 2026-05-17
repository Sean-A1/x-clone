"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { posts } from "@/features/posts/schema"
import { db } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

// composer.tsx의 MAX_LENGTH와 동일한 서버측 상한 — 클라 disabled 검증의 2차 방어선.
const MAX_LENGTH = 280

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const raw = formData.get("content")
  const content = (typeof raw === "string" ? raw : "").trim()
  // 클라가 이미 막지만, 우회 제출 시 조용히 무시한다(throw/redirect 안 함).
  if (content.length === 0 || content.length > MAX_LENGTH) return

  // authorId는 auth user id — F1.5a 공유 PK라 곧 public.users.id다.
  await db.insert(posts).values({ authorId: user.id, content })
  revalidatePath("/")
}
