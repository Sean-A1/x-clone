import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

import { SignInWithGoogleButton } from "@/components/sign-in-with-google-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/")
  }

  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center gap-2 text-center">
          <span className="text-3xl font-bold">𝕏</span>
          <CardTitle className="text-xl">Sign in to X</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-destructive">
              로그인에 실패했어요. 다시 시도해 주세요.
            </p>
          )}
          <SignInWithGoogleButton />
        </CardContent>
      </Card>
    </div>
  )
}
