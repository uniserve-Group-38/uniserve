"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="mb-6">
                    <div className="text-6xl font-black mb-4">⚠️</div>
                    <h1 className="text-3xl font-black mb-2">Oops! Something went wrong</h1>
                    <p className="text-muted-foreground font-bold">
                        {error.message || "An unexpected error occurred"}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={reset}
                        className="bg-black text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                        Try Again
                    </Button>
                    
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="w-full font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            Go Home
                        </Button>
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-4 text-xs text-muted-foreground font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    )
}
