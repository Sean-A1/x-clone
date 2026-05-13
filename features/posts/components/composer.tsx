"use client"

import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const MAX_LENGTH = 280
const WARN_THRESHOLD = 260

export function Composer() {
  const [text, setText] = useState("")

  const length = text.length
  const isOver = length > MAX_LENGTH
  const isDisabled = text.trim().length === 0 || isOver

  const counterClass = isOver
    ? "text-destructive"
    : length >= WARN_THRESHOLD
      ? "text-yellow-500"
      : "text-muted-foreground"

  const handlePost = () => {
    console.log(text)
    setText("")
  }

  return (
    <div className="border-border flex gap-3 border-b px-4 py-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="me" />
        <AvatarFallback>SE</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What is happening?!"
          rows={2}
          className="text-foreground placeholder:text-muted-foreground min-h-[48px] w-full resize-none bg-transparent py-2 text-xl focus:outline-none"
        />
        <div className="border-border flex items-center justify-between border-t pt-3">
          <span className={`text-sm tabular-nums ${counterClass}`}>
            {length} / {MAX_LENGTH}
          </span>
          <button
            type="button"
            onClick={handlePost}
            disabled={isDisabled}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 py-1.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}
