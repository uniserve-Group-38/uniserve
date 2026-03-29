import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminMobileNav } from "@/components/admin-mobile-nav"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Server-side auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Redirect if not logged in
  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/admin")
  }

  // Redirect if not admin
  if (session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminMobileNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
