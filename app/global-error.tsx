"use client"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div style={{ 
                    minHeight: "100vh", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    padding: "20px"
                }}>
                    <div style={{ 
                        maxWidth: "500px", 
                        textAlign: "center",
                        border: "4px solid black",
                        padding: "40px",
                        backgroundColor: "white"
                    }}>
                        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</h1>
                        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
                            Something went wrong!
                        </h2>
                        <p style={{ marginBottom: "20px" }}>
                            {error.message || "An unexpected error occurred"}
                        </p>
                        <button
                            onClick={reset}
                            style={{
                                padding: "10px 20px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                border: "2px solid black",
                                backgroundColor: "black",
                                color: "white",
                                cursor: "pointer"
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
