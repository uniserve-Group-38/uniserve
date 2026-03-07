"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "@/lib/auth-client"
import { DashboardSidebar, type DashboardTab } from "@/components/dashboard-sidebar"
import { ProviderBookings } from "@/components/provider-bookings"
import { ProviderServices } from "@/app/dashboard/provider-services"
import { ProviderLocation } from "@/components/provider-location"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { ArrowRightLeft, MessageCircle, Moon, Sun, User, Shield, LogOut } from "lucide-react"

interface DashboardClientProps {
    initialBookings: any[]
    initialServices: any[]
}

export function DashboardClient({ initialBookings, initialServices }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard")
    const { data: session, isPending } = useSession()
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const handleFocus = () => {
            setActiveTab("map")
        }
        window.addEventListener("focus-booking", handleFocus)
        return () => window.removeEventListener("focus-booking", handleFocus)
    }, [])

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fafaf9]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 animate-spin rounded-full border-8 border-black border-t-lime-400 shadow-[4px_4px_0_0_#000]" />
                    <p className="font-black uppercase tracking-widest animate-pulse">Syncing vibes...</p>
                </div>
            </div>
        )
    }

    const pendingBookings = initialBookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED")
    const completedBookings = initialBookings.filter(b => b.status === "ATTENDED" || b.status === "CANCELLED")

    return (
        <div className={cn("flex min-h-screen transition-colors duration-500", isDarkMode ? "bg-zinc-950 text-white" : "bg-[#fafaf9] text-black")}>
            <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 ml-20 transition-all duration-300 overflow-y-auto relative">
                <div className="px-4 py-8 md:px-16 md:py-16 max-w-7xl mx-auto">

                    {/* Dashboard / Summary View */}
                    {activeTab === "dashboard" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <header className={cn(
                                "relative overflow-hidden rounded-[3rem] border-[6px] border-black bg-lime-300 px-10 py-12 shadow-[16px_16px_0_0_#000] md:px-16 md:py-16", 
                                isDarkMode && "bg-lime-800 border-white shadow-[16px_16px_0_0_#fff]"
                            )}>
                                <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.1)_0,rgba(0,0,0,0.1)_2px,transparent_2px,transparent_6px)] opacity-30" />
                                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                    <div className="max-w-2xl">
                                        <h1 className="text-5xl font-black uppercase tracking-tighter md:text-8xl text-black leading-none">
                                            {session?.user?.name ? (
                                                <>HOLLA,<br />{session?.user?.name.split(" ")[0]}!</>
                                            ) : (
                                                "PROVIDER DASHBOARD"
                                            )}
                                        </h1>
                                        <p className="mt-6 text-2xl font-black text-black/80 uppercase tracking-tight italic">
                                            Ready to secure the bag today?
                                        </p>
                                    </div>
                                    <div className="hidden lg:block h-32 w-32 border-[6px] border-black bg-white rounded-full flex items-center justify-center -rotate-12 shadow-[8px_8px_0_0_#000] text-6xl">
                                        🚀
                                    </div>
                                </div>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className={cn("p-6 neo-border bg-white neo-shadow-sm", isDarkMode && "bg-zinc-900 border-white neo-shadow-sm-white")}>
                                    <h3 className="font-black uppercase text-xs mb-2">Total Revenue</h3>
                                    <p className="text-4xl font-black">GH₵ {(initialBookings.length * 45).toLocaleString()}</p>
                                </div>
                                <div className={cn("p-6 neo-border bg-white neo-shadow-sm", isDarkMode && "bg-zinc-900 border-white neo-shadow-sm-white")}>
                                    <h3 className="font-black uppercase text-xs mb-2">Active Bookings</h3>
                                    <p className="text-4xl font-black">{pendingBookings.length}</p>
                                </div>
                                <div className={cn("p-6 neo-border bg-white neo-shadow-sm", isDarkMode && "bg-zinc-900 border-white neo-shadow-sm-white")}>
                                    <h3 className="font-black uppercase text-xs mb-2">Completed</h3>
                                    <p className="text-4xl font-black">{completedBookings.length}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bookings View */}
                    {activeTab === "bookings" && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Manage Bookings</h2>
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase mb-4 text-pink-600">Pending & Confirmed</h3>
                                <ProviderBookings bookings={pendingBookings} />
                            </div>
                            <div className="pt-8 opacity-75">
                                <h3 className="text-xl font-black uppercase mb-4 text-muted-foreground">History / Completed</h3>
                                <ProviderBookings bookings={completedBookings} />
                            </div>
                        </div>
                    )}

                    {/* Services View */}
                    {activeTab === "services" && (
                        <div className="space-y-6">
                            <ProviderServices services={initialServices} />
                        </div>
                    )}

                    {/* Map View */}
                    {activeTab === "map" && (
                        <div className="space-y-6 h-[75vh]">
                            <h2 className="text-3xl font-black uppercase">Service Area Live Map</h2>
                            <ProviderLocation bookings={pendingBookings} />
                        </div>
                    )}

                    {/* Transactions Placeholder */}
                    {activeTab === "transactions" && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                            <div className="w-24 h-24 bg-cyan-100 border-4 border-black flex items-center justify-center rotate-3 shadow-[8px_8px_0_0_#000]">
                                <ArrowRightLeft className="h-12 w-12 text-black" />
                            </div>
                            <h2 className="text-3xl font-black uppercase">Transaction History</h2>
                            <p className="font-bold text-muted-foreground max-w-md">Payments and financial logs are currently being integrated with the Stripe and MoMo APIs. Check back soon!</p>
                        </div>
                    )}

                    {/* Chats Placeholder */}
                    {activeTab === "chats" && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                            <div className="w-24 h-24 bg-purple-100 border-4 border-black flex items-center justify-center -rotate-3 shadow-[8px_8px_0_0_#000]">
                                <MessageCircle className="h-12 w-12 text-black" />
                            </div>
                            <h2 className="text-3xl font-black uppercase">Message Center</h2>
                            <p className="font-bold text-muted-foreground max-w-md">Real-time chat with students will be available here. Use the 'Open Conversation' button on active bookings for direct links.</p>
                        </div>
                    )}

                    {/* Settings View */}
                    {activeTab === "settings" && (
                        <div className="space-y-8 max-w-3xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 bg-yellow-300 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_0_#000]">
                                    <User className="h-8 w-8 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase">Account Management</h2>
                                    <p className="font-bold opacity-60 uppercase text-xs">Provider Profile v2.0</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <section className={cn("space-y-4 p-8 neo-border bg-white neo-shadow-sm", isDarkMode && "bg-zinc-900 border-white shadow-[6px_6px_0_0_#fff]")}>
                                    <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-4 flex items-center gap-2">
                                        <User className="h-5 w-5" /> Profile info
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase opacity-50">Full Name</label>
                                            <Input defaultValue={session?.user?.name || ""} className="neo-border font-bold bg-gray-50 text-black" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase opacity-50">Email Address</label>
                                            <Input disabled defaultValue={session?.user?.email || ""} className="neo-border font-bold bg-gray-100 text-black cursor-not-allowed" />
                                        </div>
                                    </div>
                                    <Button className="w-full neo-border bg-black text-white font-black uppercase mt-4">Save Changes</Button>
                                </section>

                                <section className={cn("space-y-4 p-8 neo-border bg-yellow-50 neo-shadow-sm", isDarkMode && "bg-zinc-800 border-white text-white")}>
                                    <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-4 flex items-center gap-2 text-black">
                                        <Sun className="h-5 w-5" /> Appearance
                                    </h3>
                                    <div className="flex items-center justify-between gap-4 p-4 border-4 border-black bg-white rounded-xl shadow-[4px_4px_0_0_#000]">
                                        <div className="flex items-center gap-3">
                                            {isDarkMode ? <Moon className="h-6 w-6 text-black" /> : <Sun className="h-6 w-6 text-black" />}
                                            <span className="font-black text-sm uppercase text-black">{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                            className="neo-border-thin font-black uppercase text-xs bg-black text-white px-4"
                                        >
                                            Toggle
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 p-4 border-4 border-black bg-white rounded-xl shadow-[4px_4px_0_0_#000] mt-4">
                                        <div className="flex items-center gap-3">
                                            <Shield className="h-6 w-6 text-black" />
                                            <span className="font-black text-sm uppercase text-black">Security</span>
                                        </div>
                                        <Button variant="outline" className="neo-border-thin font-black uppercase text-xs bg-lime-300 text-black">Reset Password</Button>
                                    </div>
                                </section>
                            </div>

                            <Button
                                variant="destructive"
                                className="w-full neo-border font-black uppercase py-8 h-auto text-xl neo-shadow-sm flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
                                onClick={async () => {
                                    await signOut({
                                        fetchOptions: {
                                            onSuccess: () => { window.location.href = "/" }
                                        }
                                    })
                                }}
                            >
                                <LogOut className="h-6 w-6" /> Terminate Session
                            </Button>
                        </div>
                    )}

                </div>
            </main>
        </div>
    )
}
