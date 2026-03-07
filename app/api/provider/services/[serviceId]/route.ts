import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function PUT(req: Request, { params }: { params: Promise<{ serviceId: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userId = session?.user?.id || "user_1"
  const { serviceId } = await params

  try {
    const body = await req.json()
    const { title, description, price, category } = body

    const service = await prisma.service.update({
      where: {
        id: serviceId,
        providerId: userId,
      },
      data: {
        title,
        description,
        price,
        category,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ serviceId: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userId = session?.user?.id || "user_1"
  const { serviceId } = await params

  try {
    await prisma.service.delete({
      where: {
        id: serviceId,
        providerId: userId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
