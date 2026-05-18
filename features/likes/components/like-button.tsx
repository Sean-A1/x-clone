"use client"

import { Heart } from "lucide-react"
import { startTransition, useOptimistic } from "react"

import { toggleLike } from "@/features/likes/actions"

type LikeState = { liked: boolean; count: number }

// liked/count는 "initial"이 아니다 — useOptimistic의 base state로서 매 렌더 props에서
// 다시 읽히고, revalidate 후 서버 truth가 그대로 반영된다.
export function LikeButton({
  postId,
  liked,
  count,
}: {
  postId: string
  liked: boolean
  count: number
}) {
  const [optimistic, toggle] = useOptimistic<LikeState, void>(
    { liked, count },
    (state) => ({ liked: !state.liked, count: state.count + (state.liked ? -1 : 1) }),
  )

  const onClick = () =>
    startTransition(async () => {
      toggle() // 즉시 하트/카운트 반전
      await toggleLike(postId) // 백그라운드 서버 호출 → revalidate가 base state 동기화
    })

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-2 transition-colors hover:text-pink-400 ${
        optimistic.liked ? "text-pink-400" : ""
      }`}
    >
      <span className="rounded-full p-1.5 transition-colors group-hover:bg-pink-400/10">
        <Heart className="h-[18px] w-[18px]" fill={optimistic.liked ? "currentColor" : "none"} />
      </span>
      <span>{optimistic.count}</span>
    </button>
  )
}
