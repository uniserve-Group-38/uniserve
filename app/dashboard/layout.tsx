import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth/sign-in")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!dbUser || (dbUser.role !== "PROVIDER" && dbUser.role !== "ADMIN")) {
    redirect("/")
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardSidebar />
      <SidebarInset className="bg-[radial-gradient(circle_at_top,#bef264_0,transparent_60%),linear-gradient(135deg,#ecfeff,#f5f5f4)] relative">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b-4 border-black bg-white px-4 md:px-10 sticky top-0 z-50">
          <SidebarTrigger className="h-10 w-10 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-lime-200 hover:-translate-y-0.5 transition-all text-black bg-white" />
          <h2 className="ml-2 font-black tracking-tight text-lg uppercase">Service Provider Portal</h2>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
