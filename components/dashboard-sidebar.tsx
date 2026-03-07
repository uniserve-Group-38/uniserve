"use client"

import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    CalendarDays,
    Briefcase,
    Map as MapIcon,
    ArrowRightLeft,
    MessageCircle,
    Settings,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export type DashboardTab = "dashboard" | "bookings" | "services" | "map" | "transactions" | "chats" | "settings"

interface DashboardSidebarProps {
    activeTab: DashboardTab
    onTabChange: (tab: DashboardTab) => void
}

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "bg-lime-300" },
        { id: "bookings", label: "Bookings", icon: CalendarDays, color: "bg-pink-300" },
        { id: "services", label: "Services", icon: Briefcase, color: "bg-cyan-300" },
        { id: "map", label: "Map", icon: MapIcon, color: "bg-yellow-300" },
        { id: "transactions", label: "Transactions", icon: ArrowRightLeft, color: "bg-orange-300" },
        { id: "chats", label: "Chats", icon: MessageCircle, color: "bg-purple-300" },
        { id: "settings", label: "Settings", icon: Settings, color: "bg-gray-300" },
    ]

    return (
        <aside
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
            className={cn(
                "fixed left-0 top-0 z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-r-4 border-black bg-white shadow-[8px_0px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-8",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex items-center justify-center mb-6 px-4">
                <div className={cn("h-10 w-10 border-4 border-black bg-black flex items-center justify-center transition-all duration-500", !isCollapsed && "rotate-12")}>
                    <span className="text-white font-black text-xl">U</span>
                </div>
                {!isCollapsed && (
                    <span className="ml-2 font-black text-lg uppercase tracking-tighter animate-in fade-in slide-in-from-left-2 transition-all">
                        Uni<span className="text-lime-500">Serve</span>
                    </span>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-2 custom-scrollbar">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id as DashboardTab)}
                        className={cn(
                            "group w-full flex items-center gap-3 px-3 py-3 font-black uppercase tracking-tighter transition-all relative overflow-hidden shrink-0",
                            activeTab === item.id
                                ? cn("border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1", item.color)
                                : "text-black/60 hover:text-black hover:bg-gray-50 bg-transparent"
                        )}
                        title={item.label}
                    >
                        <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300", activeTab === item.id && "scale-110")} />
                        {!isCollapsed && (
                            <span className="text-xs truncate animate-in fade-in slide-in-from-left-4 duration-300">
                                {item.label}
                            </span>
                        )}
                        
                        {/* Status Dot for active tab when collapsed */}
                        {isCollapsed && activeTab === item.id && (
                            <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-black animate-ping" />
                        )}
                    </button>
                ))}
            </nav>
            
            <div className="p-4 border-t-4 border-black bg-black text-white">
                 <div className="flex items-center justify-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
                    {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Online</span>}
                 </div>
            </div>
        </aside>
    )
}
