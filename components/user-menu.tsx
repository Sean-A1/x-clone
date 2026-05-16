import { LogIn } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

async function signOut() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function UserMenu() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-3 rounded-full p-3 transition-colors hover:bg-accent"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
          <LogIn className="h-5 w-5" />
        </span>
        <span className="text-sm font-bold">Sign in</span>
      </Link>
    )
  }

  const name =
    user.user_metadata.full_name ?? user.user_metadata.name ?? user.email ?? "User"
  const avatar = user.user_metadata.avatar_url ?? user.user_metadata.picture
  const initials = String(name).slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-3 rounded-full p-3 transition-colors hover:bg-accent"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar ?? undefined} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm leading-tight">
            <span className="font-bold">{name}</span>
            <span className="text-muted-foreground">{user.email}</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <form action={signOut}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full cursor-pointer">
              Log out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
