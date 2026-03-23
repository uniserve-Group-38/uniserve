import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    const { serviceId } = await params
    const body = await req.json()
    const { title, description, category, price, operatingHours, imageUrl } = body

    if (!serviceId) return new NextResponse("Service ID is required", { status: 400 })

    const service = await prisma.service.update({
      where: {
        id: serviceId,
        providerId: userId,
      },
      data: {
        title,
        description,
        category,
        price,
        operatingHours,
        imageUrl,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error("[SERVICE_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    const { serviceId } = await params
    if (!serviceId) return new NextResponse("Service ID is required", { status: 400 })

    const service = await prisma.service.delete({
      where: {
        id: serviceId,
        providerId: userId,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error("[SERVICE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
