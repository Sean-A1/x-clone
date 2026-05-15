import { Composer } from "@/features/posts/components/composer"
import { PostCard } from "@/features/posts/components/post-card"
import { getPosts } from "@/features/posts/queries"

export default async function Home() {
  const posts = await getPosts()

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-md">
        <h1 className="text-xl font-bold">Home</h1>
      </header>
      <Composer />
      <div>
        {posts.map(({ post, author }) => (
          <PostCard key={post.id} post={post} author={author} />
        ))}
      </div>
    </>
  )
}
