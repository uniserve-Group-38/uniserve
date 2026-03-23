"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Redirects to /services when the user is logged in.
 * Used on the landing page so logged-in users go straight to the app.
 */
export function RedirectIfLoggedIn() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (session?.user) {
      router.replace("/services");
    }
  }, [session?.user, isPending, router]);

  return null;
}
