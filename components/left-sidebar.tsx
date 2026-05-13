import type { LucideIcon } from "lucide-react"
import { Bell, Bookmark, Home as HomeIcon, Mail, Search, User } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export function LeftSidebar() {
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
