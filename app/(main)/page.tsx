import { Composer } from "@/features/posts/components/composer"
import { PostCard } from "@/features/posts/components/post-card"
import { getPosts } from "@/features/posts/queries"
import { getUserById } from "@/features/users/queries"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()
  const user = authUser ? await getUserById(authUser.id) : null

  const posts = await getPosts(authUser?.id ?? null)

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-md">
        <h1 className="text-xl font-bold">Home</h1>
      </header>
      <Composer user={user} />
      <div>
        {posts.map(({ post, author, likedByMe }) => (
          <PostCard key={post.id} post={post} author={author} likedByMe={likedByMe} />
        ))}
      </div>
    </>
  )
}
