"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, MessageSquare, Briefcase, CreditCard, Settings, ArrowLeft } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: Briefcase,
  },
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: CreditCard,
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" className="border-r-4 border-black font-semibold">
      <SidebarContent>
        <SidebarGroup>
          <div className="p-4 py-6 font-black tracking-tighter text-2xl">
            Service <span className="text-lime-500">Provider Panel</span>
          </div>
          <SidebarGroupLabel className="font-bold text-black/60">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className={pathname === item.url ? "bg-lime-200 text-black border-2 border-black font-bold shadow-[2px_2px_0px_0px_#000]" : "hover:bg-lime-100 font-bold"}>
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5 mr-1" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Link href="/">
            <div className="flex items-center justify-center gap-2 w-full bg-cyan-200 text-black border-4 border-black p-3 font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <ArrowLeft className="w-5 h-5" />
              <span>Explore Marketplace</span>
            </div>
          </Link>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
