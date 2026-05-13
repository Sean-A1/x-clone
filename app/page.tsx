import type { LucideIcon } from "lucide-react"
import {
  Bell,
  Bookmark,
  Home as HomeIcon,
  Mail,
  Search,
  User,
} from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { PostCard } from "@/features/posts/components/post-card"
import { MOCK_POSTS } from "@/features/posts/mock"

type Trend = {
  category: string
  title: string
  posts: string
}

const NAV_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: HomeIcon, label: "Home" },
  { icon: Search, label: "Explore" },
  { icon: Bell, label: "Notifications" },
  { icon: Mail, label: "Messages" },
  { icon: Bookmark, label: "Bookmarks" },
  { icon: User, label: "Profile" },
]

const MOCK_TRENDS: Trend[] = [
  {
    category: "Technology · Trending",
    title: "Next.js 16",
    posts: "12.4K posts",
  },
  {
    category: "Trending in South Korea",
    title: "Tailwind v4",
    posts: "5,231 posts",
  },
  {
    category: "Trending",
    title: "Supabase",
    posts: "8,902 posts",
  },
]

function NavItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-full px-4 py-3 text-xl transition-colors hover:bg-accent"
    >
      <Icon className="h-6 w-6" strokeWidth={2} />
      <span>{label}</span>
    </button>
  )
}

function LeftSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[275px] shrink-0 flex-col justify-between px-2 py-3 sm:flex">
      <div className="flex flex-col gap-1">
        <div className="px-4 py-2">
          <span className="text-2xl font-bold">𝕏</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} icon={item.icon} label={item.label} />
          ))}
        </nav>
        <button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 w-full rounded-full px-4 py-3 text-base font-bold transition-colors"
        >
          Post
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="px-3">
          <ModeToggle />
        </div>
        <button
          type="button"
          className="hover:bg-accent flex items-center gap-3 rounded-full p-3 transition-colors"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="me" />
            <AvatarFallback>SE</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm leading-tight">
            <span className="font-bold">Sean</span>
            <span className="text-muted-foreground">@sean_dev</span>
          </div>
        </button>
      </div>
    </aside>
  )
}

function Composer() {
  return (
    <div className="border-border flex gap-3 border-b px-4 py-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="me" />
        <AvatarFallback>SE</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-3">
        <div className="text-muted-foreground min-h-[48px] py-2 text-xl">What is happening?!</div>
        <div className="border-border flex items-center justify-between border-t pt-3">
          <span className="text-muted-foreground text-sm">0 / 280</span>
          <button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 py-1.5 text-sm font-bold transition-colors"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

function RightSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[350px] shrink-0 px-6 py-3 lg:block">
      <div className="relative mb-4">
        <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search"
          className="bg-muted placeholder:text-muted-foreground focus:bg-background w-full rounded-full border border-transparent py-2.5 pr-4 pl-11 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="bg-muted rounded-2xl">
        <h2 className="px-4 py-3 text-xl font-bold">Trends for you</h2>
        {MOCK_TRENDS.map((trend) => (
          <button
            key={trend.title}
            type="button"
            className="hover:bg-accent/80 flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors"
          >
            <span className="text-muted-foreground text-xs">{trend.category}</span>
            <span className="font-bold">{trend.title}</span>
            <span className="text-muted-foreground text-xs">{trend.posts}</span>
          </button>
        ))}
        <button
          type="button"
          className="hover:bg-accent/80 w-full rounded-b-2xl px-4 py-3 text-left text-sm text-blue-400 transition-colors"
        >
          Show more
        </button>
      </div>
    </aside>
  )
}

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex max-w-[1280px] justify-center">
        <LeftSidebar />
        <main className="border-border w-full max-w-[600px] border-x">
          <header className="border-border bg-background/70 sticky top-0 z-10 border-b px-4 py-3 backdrop-blur-md">
            <h1 className="text-xl font-bold">Home</h1>
          </header>
          <Composer />
          <div>
            {MOCK_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}
