import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { LucideIcon } from "lucide-react"
import {
  Bell,
  Bookmark,
  Heart,
  Home as HomeIcon,
  Mail,
  MessageCircle,
  Repeat2,
  Search,
  Share,
  User,
} from "lucide-react"

type Post = {
  id: string
  name: string
  handle: string
  avatar: string
  time: string
  content: string
  replies: number
  reposts: number
  likes: number
}

type Trend = {
  category: string
  title: string
  posts: string
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    name: "Sean",
    handle: "sean_dev",
    avatar: "https://i.pravatar.cc/150?img=12",
    time: "2h",
    content:
      "Next.js 16 + Tailwind v4 조합으로 X 클론 시작. 풀스택 학습이 목표라 일부러 빠른 길보다 현업스러운 길을 골라봄.",
    replies: 4,
    reposts: 1,
    likes: 23,
  },
  {
    id: "2",
    name: "Mina Park",
    handle: "minacodes",
    avatar: "https://i.pravatar.cc/150?img=47",
    time: "5h",
    content:
      "타임라인 pull model로 먼저 만들어보고 나중에 push fanout으로 마이그레이션하는 게 학습 가치 면에서 훨씬 좋다. 결과만 보면 push가 정답인데, 왜 그게 정답인지는 pull을 직접 굴려봐야 안다.",
    replies: 12,
    reposts: 8,
    likes: 142,
  },
  {
    id: "3",
    name: "Hyunwoo",
    handle: "hwlog",
    avatar: "https://i.pravatar.cc/150?img=33",
    time: "1d",
    content:
      "Shadcn Nova preset 색감이 생각보다 X 분위기랑 잘 맞는다. 다크 모드 기본 + zinc 계열 구분선.",
    replies: 2,
    reposts: 0,
    likes: 17,
  },
  {
    id: "4",
    name: "Jules",
    handle: "jules",
    avatar: "https://i.pravatar.cc/150?img=5",
    time: "1d",
    content:
      "오늘의 교훈: Tailwind v4는 tailwind.config.js 없다. CSS-first config 적응되니까 오히려 깔끔함.",
    replies: 6,
    reposts: 3,
    likes: 58,
  },
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

const NAV_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: HomeIcon, label: "Home" },
  { icon: Search, label: "Explore" },
  { icon: Bell, label: "Notifications" },
  { icon: Mail, label: "Messages" },
  { icon: Bookmark, label: "Bookmarks" },
  { icon: User, label: "Profile" },
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
          className="mt-2 w-full rounded-full bg-primary px-4 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
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
          className="flex items-center gap-3 rounded-full p-3 transition-colors hover:bg-accent"
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

function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={post.avatar} alt={post.name} />
        <AvatarFallback>{post.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-1 text-sm">
          <span className="font-bold hover:underline">{post.name}</span>
          <span className="text-muted-foreground">@{post.handle}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground hover:underline">{post.time}</span>
        </div>
        <p className="text-[15px] leading-snug whitespace-pre-wrap">{post.content}</p>
        <div className="mt-2 flex max-w-md justify-between text-sm text-muted-foreground">
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
          <button
            type="button"
            className="group flex items-center gap-2 transition-colors hover:text-pink-400"
          >
            <span className="rounded-full p-1.5 transition-colors group-hover:bg-pink-400/10">
              <Heart className="h-[18px] w-[18px]" />
            </span>
            <span>{post.likes}</span>
          </button>
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

function RightSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[350px] shrink-0 px-6 py-3 lg:block">
      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-full border border-transparent bg-muted py-2.5 pr-4 pl-11 text-sm placeholder:text-muted-foreground focus:border-blue-500 focus:bg-background focus:outline-none"
        />
      </div>
      <div className="rounded-2xl bg-muted">
        <h2 className="px-4 py-3 text-xl font-bold">Trends for you</h2>
        {MOCK_TRENDS.map((trend) => (
          <button
            key={trend.title}
            type="button"
            className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors hover:bg-accent/80"
          >
            <span className="text-xs text-muted-foreground">{trend.category}</span>
            <span className="font-bold">{trend.title}</span>
            <span className="text-xs text-muted-foreground">{trend.posts}</span>
          </button>
        ))}
        <button
          type="button"
          className="w-full rounded-b-2xl px-4 py-3 text-left text-sm text-blue-400 transition-colors hover:bg-accent/80"
        >
          Show more
        </button>
      </div>
    </aside>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1280px] justify-center">
        <LeftSidebar />
        <main className="w-full max-w-[600px] border-x border-border">
          <header className="sticky top-0 z-10 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-md">
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
