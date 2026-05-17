import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { PostCard } from "@/features/posts/components/post-card"
import { getPostsByUsername } from "@/features/posts/queries"
import { ProfileHeader } from "@/features/users/components/profile-header"
import { ProfileTabs } from "@/features/users/components/profile-tabs"
import { getUser } from "@/features/users/queries"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const user = await getUser(username)

  if (!user) {
    notFound()
  }

  const posts = await getPostsByUsername(username)

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center gap-6 border-b border-border bg-background/70 px-4 py-2 backdrop-blur-md">
        <button
          type="button"
          aria-label="Back"
          className="rounded-full p-2 transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold">{user.displayName}</span>
          <span className="text-xs text-muted-foreground">
            {user.postsCount.toLocaleString()} posts
          </span>
        </div>
      </header>
      <ProfileHeader user={user} />
      <ProfileTabs />
      <div>
        {posts.map(({ post, author }) => (
          <PostCard key={post.id} post={post} author={author} />
        ))}
      </div>
    </>
  )
}
