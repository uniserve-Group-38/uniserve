import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { DashboardClient } from "@/components/dashboard-client"

export const dynamic = "force-dynamic"

export default async function ProviderDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userId = session?.user?.id || "user_1"
  
  const bookings = await prisma.booking.findMany({
    where: {
      providerId: userId,
    },
    include: { 
        student: true, 
        service: true 
    },
    orderBy: { bookedAt: "desc" },
  })

  const services = await prisma.service.findMany({
    where: {
      providerId: userId,
    },
    orderBy: { createdAt: "desc" },
  })

  return <DashboardClient initialBookings={bookings} initialServices={services} />
}
