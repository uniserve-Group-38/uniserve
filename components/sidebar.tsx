"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import {
    Home,
    Briefcase,
    Bell,
    LogOut,
    User as UserIcon,
    Settings,
    Map as MapIcon
} from "lucide-react"


import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/auth-client"

export function Sidebar() {
    const pathname = usePathname()
    // Using better-auth useSession
    const { data: session, isPending } = useSession()

    const navItems = [
        {
            title: "Home",
            href: "/",
            icon: Home,
            active: pathname === "/",
        },
        {
            title: "Services",
            href: "/services",
            icon: Briefcase,
            active: pathname.startsWith("/services"),
        },
        {
            title: "Announcements",
            href: "/announcements",
            icon: Bell,
            active: pathname.startsWith("/announcements"),
        },
    ]

    return (
        <aside className="w-56 border-r-4 border-black bg-white flex flex-col h-screen sticky top-0 hidden md:flex">
            {/* Logo */}
            <div className="p-6 border-b-4 border-black">
                <Link href="/" className="flex items-center gap-1">
                    <span className="font-black text-xl tracking-tight">
                        Campus<span className="text-pink-500">Services</span>
                    </span>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 font-bold text-sm transition-all border-2",
                            item.active
                                ? "bg-pink-100 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                                : "border-transparent text-muted-foreground hover:bg-gray-100 hover:text-black"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.title}
                    </Link>
                ))}
            </div>

            {/* Auth Section */}
            <div className="p-4 border-t-4 border-black bg-purple-50">
                {isPending ? (
                    <div className="h-12 flex items-center justify-center">
                        <span className="font-bold text-sm text-muted-foreground animate-pulse">Loading...</span>
                    </div>
                ) : session?.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full h-auto flex items-center justify-start gap-3 p-2 hover:bg-purple-200 border-2 border-transparent hover:border-black transition-all"
                            >
                                <Avatar className="h-9 w-9 border-2 border-black">
                                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                                    <AvatarFallback className="bg-yellow-300 font-bold">
                                        {session.user.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start overflow-hidden flex-1">
                                    <span className="text-sm font-black truncate w-full text-left">
                                        {session.user.name}
                                    </span>
                                    <span className="text-xs font-bold text-muted-foreground truncate w-full text-left">
                                        {session.user.email}
                                    </span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none" align="end" forceMount>
                            <DropdownMenuLabel className="font-black">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-black" />
                            <DropdownMenuItem asChild className="font-bold cursor-pointer focus:bg-cyan-100 py-2">
                                <Link href="/dashboard#map">
                                    <MapIcon className="mr-2 h-4 w-4" />
                                    <span>Map</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="font-bold cursor-pointer focus:bg-pink-100 py-2">
                                <Link href="/account">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="font-bold text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2"
                                onClick={async () => {
                                    await signOut({
                                        fetchOptions: {
                                            onSuccess: () => {
                                                window.location.href = "/" // Redirect to home after logout
                                            }
                                        }
                                    })
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex flex-col gap-2">
                        <Link href="/auth/sign-in" className="w-full">
                            <Button variant="outline" className="w-full font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/auth/sign-up" className="w-full">
                            <Button className="w-full bg-black text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    )
}
