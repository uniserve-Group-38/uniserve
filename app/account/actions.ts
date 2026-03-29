"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string, bio: string, phoneNumber: string, location: string, image: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        bio: data.bio,
        phoneNumber: data.phoneNumber,
        location: data.location,
        image: data.image,
      },
    });

    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR:", error);
    return { error: "Failed to update profile" };
  }
}

export async function deleteAccount() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return { success: true };
  } catch (error) {
    console.error("DELETE_ACCOUNT_ERROR:", error);
    return { error: "Failed to delete account" };
  }
}
