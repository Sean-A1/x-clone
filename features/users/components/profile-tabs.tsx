const TABS = ["Posts", "Replies", "Highlights", "Articles", "Media", "Likes"] as const
const ACTIVE_TAB = "Posts"

export function ProfileTabs() {
  return (
    <nav className="flex border-b border-border" role="tablist">
      {TABS.map((tab) => {
        const isActive = tab === ACTIVE_TAB
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={
              isActive
                ? "relative flex-1 px-4 py-4 text-sm font-bold transition-colors hover:bg-accent/50"
                : "relative flex-1 px-4 py-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50"
            }
          >
            <span className="relative inline-block">
              {tab}
              {isActive && (
                <span className="absolute -bottom-4 left-0 right-0 h-1 rounded-full bg-primary" />
              )}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
