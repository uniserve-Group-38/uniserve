import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Redirect if not logged in
  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/dashboard")
  }

  // Redirect if not provider or admin
  if (session.user.role !== "PROVIDER" && session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardSidebar />
      <SidebarInset className="bg-[radial-gradient(circle_at_top,#bef264_0,transparent_60%),linear-gradient(135deg,#ecfeff,#f5f5f4)] relative">
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b-4 border-black bg-white px-3 sm:px-4 md:px-10 sticky top-0 z-50 min-w-0">
          <SidebarTrigger className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-lime-200 hover:-translate-y-0.5 transition-all text-black bg-white shrink-0" />
          <h2 className="ml-1 sm:ml-2 font-black tracking-tight text-sm sm:text-base md:text-lg uppercase truncate">Service Provider Portal</h2>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
