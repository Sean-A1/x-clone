import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { PostCard } from "@/features/posts/components/post-card"
import { MOCK_POSTS } from "@/features/posts/mock"

function Composer() {
  return (
    <div className="flex gap-3 border-b border-border px-4 py-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="me" />
        <AvatarFallback>SE</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-3">
        <div className="min-h-[48px] py-2 text-xl text-muted-foreground">What is happening?!</div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">0 / 280</span>
          <button
            type="button"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-md">
        <h1 className="text-xl font-bold">Home</h1>
      </header>
      <Composer />
      <div>
        {MOCK_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  )
}
