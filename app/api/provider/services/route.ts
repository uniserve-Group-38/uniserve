import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userId = session?.user?.id || "user_1"

  try {
    const body = await req.json()
    const { title, description, price, category } = body

    const service = await prisma.service.create({
      data: {
        title,
        description,
        price,
        category: category || "General",
        providerId: userId,
        status: "ACTIVE",
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
