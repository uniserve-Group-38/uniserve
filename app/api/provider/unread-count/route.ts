import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Count all unread messages where the user is the provider and NOT the sender
    const unreadCount = await prisma.message.count({
      where: {
        readAt: null,
        senderId: { not: userId },
        conversation: {
          booking: {
            providerId: userId,
          },
        },
      },
    });

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("PROVIDER_UNREAD_COUNT_GET_ERROR:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
