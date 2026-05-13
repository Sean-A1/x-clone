import { Composer } from "@/features/posts/components/composer"
import { PostCard } from "@/features/posts/components/post-card"
import { MOCK_POSTS } from "@/features/posts/mock"

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
