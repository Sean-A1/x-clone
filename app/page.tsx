import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">X clone — setup test</h1>
      <p className="text-muted-foreground">Shadcn Nova preset, Lucide icons, Geist font</p>

      <Avatar className="w-16 h-16">
        <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="user" />
        <AvatarFallback>HS</AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>
  )
}