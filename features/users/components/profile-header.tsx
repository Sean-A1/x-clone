import { Calendar, MapPin } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/features/users/types"

export function ProfileHeader({ user }: { user: User }) {
  return (
    <section className="border-b border-border px-4 pt-4 pb-4">
      <div className="flex items-start justify-between">
        <Avatar className="h-32 w-32 border-4 border-background">
          <AvatarImage src={user.avatar} alt={user.displayName} />
          <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Button variant="outline" className="mt-2 rounded-full font-bold">
          Edit profile
        </Button>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-bold">{user.displayName}</span>
          <span className="text-muted-foreground">@{user.username}</span>
        </div>
        <p className="text-[15px] leading-snug whitespace-pre-wrap">{user.bio}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {user.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {user.joinedAt}
          </span>
        </div>
        <div className="flex gap-4 text-sm">
          <span>
            <span className="font-bold text-foreground">{user.following.toLocaleString()}</span>{" "}
            <span className="text-muted-foreground">Following</span>
          </span>
          <span>
            <span className="font-bold text-foreground">{user.followers.toLocaleString()}</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </span>
        </div>
      </div>
    </section>
  )
}
