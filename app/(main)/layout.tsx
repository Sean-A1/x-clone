import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1280px] justify-center">
      <LeftSidebar />
      <main className="w-full max-w-[600px] border-x border-border">{children}</main>
      <RightSidebar />
    </div>
  )
}
