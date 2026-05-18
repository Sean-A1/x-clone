import { formatDistanceToNow } from "date-fns"
import { MessageCircle, Repeat2, Share } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LikeButton } from "@/features/likes/components/like-button"
import type { Post } from "@/features/posts/schema"
import type { User } from "@/features/users/schema"

export function PostCard({
  post,
  author,
  likedByMe,
}: {
  post: Post
  author: User
  likedByMe: boolean
}) {
  return (
    <article className="hover:bg-muted/50 border-border flex gap-3 border-b px-4 py-3 transition-colors">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={author.avatar ?? undefined} alt={author.displayName} />
        <AvatarFallback>{author.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-1 text-sm">
          <span className="font-bold hover:underline">{author.displayName}</span>
          <span className="text-muted-foreground">@{author.username}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground hover:underline">
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </span>
        </div>
        <p className="text-[15px] leading-snug whitespace-pre-wrap">{post.content}</p>
        <div className="text-muted-foreground mt-2 flex max-w-md justify-between text-sm">
          <button
            type="button"
            className="group flex items-center gap-2 transition-colors hover:text-blue-400"
          >
            <span className="rounded-full p-1.5 transition-colors group-hover:bg-blue-400/10">
              <MessageCircle className="h-[18px] w-[18px]" />
            </span>
            <span>{post.replies}</span>
          </button>
          <button
            type="button"
            className="group flex items-center gap-2 transition-colors hover:text-green-400"
          >
            <span className="rounded-full p-1.5 transition-colors group-hover:bg-green-400/10">
              <Repeat2 className="h-[18px] w-[18px]" />
            </span>
            <span>{post.reposts}</span>
          </button>
          <LikeButton postId={post.id} liked={likedByMe} count={post.likes} />
          <button
            type="button"
            className="group flex items-center gap-2 transition-colors hover:text-blue-400"
          >
            <span className="rounded-full p-1.5 transition-colors group-hover:bg-blue-400/10">
              <Share className="h-[18px] w-[18px]" />
            </span>
          </button>
        </div>
      </div>
    </article>
  )
}
