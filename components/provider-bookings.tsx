"use client"

import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"
import { MessageCircle, CheckCircle2, Clock3, MapPin } from "lucide-react"


import { BookingStatus } from "@/lib/generated/prisma/enums"
import type { Prisma } from "@/lib/generated/prisma/client"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { student: true; service: true }
}>

interface ProviderBookingsProps {
  bookings: BookingWithRelations[]
}

export function ProviderBookings({ bookings: initial }: ProviderBookingsProps) {
  const [bookings, setBookings] = useState(initial)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleMarkAttended = async (id: string) => {
    try {
      setLoadingId(id)
      const res = await fetch(`/api/provider/bookings/${id}/attend`, {
        method: "POST",
      })
      if (!res.ok) {
        // soft error – future devs can plug in toast system if needed
        console.error("Failed to mark booking as attended")
        return
      }
      setBookings((prev) => prev.filter((b) => b.id !== id))
    } finally {
      setLoadingId(null)
    }
  }

  if (!bookings.length) {
    return (
      <section className="rounded-2xl border-4 border-dashed border-black bg-white/70 p-6 text-center shadow-[6px_6px_0_0_#000]">
        <h2 className="text-xl font-extrabold uppercase tracking-[0.18em]">
          No active bookings
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          When students book your services, they&apos;ll show up here ready to be served.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {bookings.map((booking, index) => (
          <article
            key={booking.id}
            className={cn(
              "group relative overflow-hidden rounded-2xl border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_#000] transition-transform hover:-translate-y-1",
              index % 2 === 0 ? "bg-emerald-50" : "bg-amber-50",
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.04)_0,rgba(0,0,0,0.04)_2px,transparent_2px,transparent_6px)] opacity-70" />
            <div className="relative flex flex-col gap-3">
              <header className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold uppercase tracking-[0.15em]">
                    {booking.service.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-foreground/70">
                    Student:{" "}
                    <span className="font-semibold">{booking.student.name}</span>
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-2 border-black bg-yellow-200 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]"
                >
                  <Clock3 className="h-3 w-3" />
                  {booking.status === BookingStatus.PENDING ? "Pending" : "Attended"}
                </Badge>
              </header>

              <div className="flex items-center justify-between text-xs font-medium text-foreground/70">
                <div className="flex flex-col">
                  <span className="uppercase tracking-[0.16em]">Booked on</span>
                  <span className="font-semibold">
                    {format(new Date(booking.bookedAt), "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/conversations/${booking.id}`}
                    className="flex flex-1 items-center justify-between rounded-xl border-2 border-black bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] shadow-[4px_4px_0_0_#000] transition-transform group-hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] text-lime-300">
                        {booking.student.name.charAt(0).toUpperCase()}
                      </span>
                      Open conversation
                    </span>
                    <MessageCircle className="h-4 w-4" />
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-2 border-black bg-cyan-200 shadow-[4px_4px_0_0_#000] hover:bg-cyan-300 transition-all hover:-translate-y-0.5"
                    title="View on Map"
                    onClick={() => {
                        window.location.hash = "map";
                        window.dispatchEvent(new CustomEvent("focus-booking", { detail: booking.id }));
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>


                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="border-2 border-black bg-red-500 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.16em] shadow-[4px_4px_0_0_#000]"
                      disabled={loadingId === booking.id}
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {loadingId === booking.id ? "Updating..." : "Mark attended"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-4 border-black bg-amber-50 shadow-[8px_8px_0_0_#000]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-extrabold uppercase tracking-[0.2em]">
                        Confirm completion
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm font-medium text-foreground">
                        You&apos;re about to mark{" "}
                        <span className="font-semibold">
                          {booking.service.title}
                        </span>{" "}
                        for{" "}
                        <span className="font-semibold">
                          {booking.student.name}
                        </span>{" "}
                        as <span className="underline">attended</span>. This will remove the
                        booking from your active list, but it will remain stored safely in the
                        system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-2 border-black bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] shadow-[3px_3px_0_0_#000]">
                        Keep as pending
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="border-2 border-black bg-green-500 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-black shadow-[3px_3px_0_0_#000] hover:bg-green-400"
                        onClick={() => handleMarkAttended(booking.id)}
                      >
                        Yes, mark attended
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

