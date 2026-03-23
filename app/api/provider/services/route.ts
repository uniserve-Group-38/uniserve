import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()
    const { title, description, category, price, operatingHours, imageUrl } = body

    if (!title || !description || !category) {
      return new NextResponse("Title, description, and category are required", { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        category,
        price,
        operatingHours,
        imageUrl,
        status: "Available",
        providerId: userId,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error("[SERVICES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
