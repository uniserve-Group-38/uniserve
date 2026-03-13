import { headers } from "next/headers"
import { auth } from "@/lib/auth"

import { prisma } from "@/lib/prisma"
import type { Prisma, Service } from "@/lib/generated/prisma/client"
import { BookingStatus, Role as RoleEnum } from "@/lib/generated/prisma/enums"

export const dynamic = "force-dynamic"

export default async function ProviderDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) return null

  const bookings = await prisma.booking.findMany({
    where: {
      providerId: session.user.id,
      status: BookingStatus.PENDING,
    },
    include: { student: true, service: true },
    orderBy: { bookedAt: "desc" },
  })


  return (
    <main className="px-4 py-6 md:px-10 md:py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-2xl border-4 border-black bg-lime-100 px-6 py-5 shadow-[8px_8px_0_0_#000] md:px-8 md:py-6">
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_2px,transparent_2px,transparent_6px)]" />
          <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60">
                Service Provider Console
              </p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                Active bookings
                <span className="ml-3 inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-lime-300">
                  {bookings.length} open
                </span>
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium text-foreground/70">
                Manage students who have booked your services, chat with them, and mark
                services as completed
              </p>
            </div>
            <div className="mt-3 flex gap-2 md:mt-0">
              <div className="flex flex-col items-end gap-1 text-xs font-semibold uppercase tracking-[0.16em]">
              </div>
            </div>
          </div>
        </header>

      </section>
    </main>
  )
}
