import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Retry getSession up to 3 times to handle Neon cold-start timeouts
    let session = null;
    let lastSessionError: unknown = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        session = await auth.api.getSession({ headers: await headers() });
        break; // success
      } catch (err) {
        lastSessionError = err;
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    if (lastSessionError && !session) {
      console.error("getSession failed after retries:", lastSessionError);
      return NextResponse.json(
        { error: "Database temporarily unavailable. Please retry." },
        { status: 503 }
      );
    }

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const application = await prisma.serviceProviderApplication.update({
      where: { id },
      data: { status },
      include: { user: true },
    });

    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: application.userId },
        data: { role: "PROVIDER" },
      });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
