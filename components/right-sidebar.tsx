import { Search } from "lucide-react"

type Trend = {
  category: string
  title: string
  posts: string
}

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

export function RightSidebar() {
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
