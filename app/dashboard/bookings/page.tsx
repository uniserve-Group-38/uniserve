import { prisma } from "@/lib/prisma"
import { ProviderBookings } from "@/components/provider-bookings"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export default async function BookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) return null

  const bookings = await prisma.booking.findMany({
    where: {
      providerId: session.user.id,
    },
    include: { student: true, service: true },
    orderBy: [
      { status: "desc" }, // PENDING will come before ATTENDED
      { bookedAt: "desc" }
    ],
  })

  return (
    <main className="px-4 py-6 md:px-10 md:py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-2xl border-4 border-black bg-white px-6 py-5 shadow-[8px_8px_0_0_#000] md:px-8 md:py-6">
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_2px,transparent_2px,transparent_6px)]" />
          <h1 className="relative text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            All Bookings
          </h1>
          <p className="relative mt-2 max-w-xl text-sm font-medium text-foreground/70">
            View pending and completed bookings from your students
          </p>
        </header>

        <ProviderBookings bookings={bookings as any} />
      </section>
    </main>
  )
}
