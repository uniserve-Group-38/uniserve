import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { CartClient } from "./cart-client"

export const dynamic = "force-dynamic"

export default async function CartPage() {
  // Server-side auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/cart")
  }

  return <CartClient userId={session.user.id} />
}
