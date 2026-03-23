import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await req.json();
    if (!conversationId || typeof conversationId !== "string") {
      return NextResponse.json(
        { error: "conversationId required" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { booking: { select: { studentId: true, providerId: true } } },
    });

    if (!conversation?.booking) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const { studentId, providerId } = conversation.booking;
    const userId = session.user.id;
    const isParticipant = userId === studentId || userId === providerId;
    if (!isParticipant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    // Mark all unread messages EXCEPT those sent by the current user as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        NOT: {
          senderId: userId,
        },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    const readAt = new Date().toISOString();
    await pusherServer.trigger(conversationId, "messages-read", { readAt });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("MARK_READ_ERROR:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
