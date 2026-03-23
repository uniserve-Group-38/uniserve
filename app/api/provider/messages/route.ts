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

    // Find all conversations where the user is the provider
    const conversations = await prisma.conversation.findMany({
      where: {
        booking: {
          providerId: userId,
        },
      },
      include: {
        booking: {
          include: {
            student: {
              select: { id: true, name: true, image: true },
            },
            service: {
              select: { title: true },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 50, // Get recent messages for an overview
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Format the response to highlight unread messages and partner details
    const result = conversations.map((conv) => {
      const unreadCount = conv.messages.filter(
        (m) => m.senderId !== userId && m.readAt === null
      ).length;

      return {
        id: conv.id,
        bookingId: conv.bookingId,
        student: conv.booking.student,
        serviceTitle: conv.booking.service.title,
        latestMessage: conv.messages[0] || null,
        unreadCount,
        updatedAt: conv.updatedAt,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("PROVIDER_MESSAGES_GET_ERROR:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
