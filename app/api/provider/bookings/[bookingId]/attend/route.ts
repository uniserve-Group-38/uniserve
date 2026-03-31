import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BookingStatus } from "@/lib/generated/prisma/client"

interface RouteParams {
  params: Promise<{ bookingId: string }>
}

export async function POST(req: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // TODO: Re-enable role check when database is ready
  // if ((session.user as { role?: string }).role !== RoleEnum.PROVIDER) {
  //   return new NextResponse("Forbidden", { status: 403 })
  // }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  })

  if (!booking) {
    return new NextResponse("Not found", { status: 404 })
  }

  if (booking.providerId !== session.user.id) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.ATTENDED },
  })

  revalidatePath("/bookings")
  revalidatePath("/dashboard/bookings")

  return NextResponse.json(updated)
}

