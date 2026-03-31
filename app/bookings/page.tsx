import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { StudentBookings } from "@/components/student-bookings"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function StudentBookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  const userId = session.user.id

  // Fetch bookings where user is the STUDENT only
  const bookings = await prisma.booking.findMany({
    where: {
      studentId: userId,  // Only bookings where I'm the student
    },
    include: {
      student: true,
      service: true,
      provider: true,
      conversation: { select: { id: true } },
      transactions: true,
    },
    orderBy: [
      { status: "desc" },
      { bookedAt: "desc" },
    ],
  })

  return (
    <main className="px-4 py-6 md:px-10 md:py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="mb-2">
          <Link href="/services">
            <Button variant="outline" className="border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-yellow-100 transition-all text-sm h-10 w-fit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Explore More Services
            </Button>
          </Link>
        </div>
        <header className="relative overflow-hidden rounded-2xl border-4 border-black bg-white px-6 py-5 shadow-[8px_8px_0_0_#000] md:px-8 md:py-6">
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_2px,transparent_2px,transparent_6px)]" />
          <h1 className="relative text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            My Bookings
          </h1>
          <p className="relative mt-2 max-w-xl text-sm font-medium text-foreground/70">
            View your service bookings and make payments
          </p>
        </header>
        <StudentBookings bookings={bookings as any} currentUserId={userId} />
      </section>
    </main>
  )
}