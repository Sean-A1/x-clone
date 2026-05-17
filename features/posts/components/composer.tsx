"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { createPost } from "@/features/posts/actions"
import type { User } from "@/features/users/schema"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const MAX_LENGTH = 280
const WARN_THRESHOLD = 260

const textareaClass =
  "text-foreground placeholder:text-muted-foreground min-h-[48px] w-full resize-none bg-transparent py-2 text-xl focus:outline-none"
const buttonClass =
  "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 py-1.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"

export function Composer({ user }: { user: User | null }) {
  return user ? <ActiveComposer user={user} /> : <GuestComposer />
}

function ActiveComposer({ user }: { user: User }) {
  const [text, setText] = useState("")

  const length = text.length
  const isOver = length > MAX_LENGTH
  const isDisabled = text.trim().length === 0 || isOver

  const counterClass = isOver
    ? "text-destructive"
    : length >= WARN_THRESHOLD
      ? "text-yellow-500"
      : "text-muted-foreground"

  return (
    <form
      action={async (formData) => {
        await createPost(formData)
        // controlled textarea라 form reset 영향을 안 받음 — state를 직접 비운다.
        setText("")
      }}
      className="border-border flex gap-3 border-b px-4 py-3"
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={user.avatar ?? undefined} alt={user.displayName} />
        <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-3">
        <textarea
          name="content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What is happening?!"
          rows={2}
          className={textareaClass}
        />
        <div className="border-border flex items-center justify-between border-t pt-3">
          <span className={`text-sm tabular-nums ${counterClass}`}>
            {length} / {MAX_LENGTH}
          </span>
          <button type="submit" disabled={isDisabled} className={buttonClass}>
            Post
          </button>
        </div>
      </div>
    </form>
  )
}

function GuestComposer() {
  const router = useRouter()
  const goLogin = () => router.push("/login")

  return (
    <div className="border-border flex gap-3 border-b px-4 py-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-3">
        <textarea
          readOnly
          onClick={goLogin}
          onFocus={goLogin}
          placeholder="What is happening?!"
          rows={2}
          className={`${textareaClass} cursor-pointer`}
        />
        <div className="border-border flex items-center justify-between border-t pt-3">
          <span className="text-muted-foreground text-sm tabular-nums">0 / {MAX_LENGTH}</span>
          <button type="button" onClick={goLogin} className={buttonClass}>
            Post
          </button>
        </div>
      </div>
    </div>
  )
}
