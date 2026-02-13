
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Phone } from "lucide-react"

interface ContactProviderProps {
    phoneNumber: string | null
    location: string | null
}

export function ContactProvider({ phoneNumber, location }: ContactProviderProps) {
    const [isRevealed, setIsRevealed] = useState(false)

    if (!phoneNumber && !location) {
        return null
    }

    return (
        <div className="pt-4 space-y-4">
            {!isRevealed ? (
                <Button
                    className="w-full text-lg py-6"
                    size="lg"
                    onClick={() => setIsRevealed(true)}
                >
                    Contact Provider
                </Button>
            ) : (
                <div className="space-y-3 p-4 border rounded-md bg-muted/20 animate-in fade-in slide-in-from-top-2">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Contact Details</div>
                    {phoneNumber && (
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Phone className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Phone</div>
                                <a href={`tel:${phoneNumber}`} className="text-lg font-semibold hover:underline">
                                    {phoneNumber}
                                </a>
                            </div>
                        </div>
                    )}

                    {location && (
                        <div className="flex items-center gap-3 pt-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Location</div>
                                <div className="font-medium">{location}</div>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 text-muted-foreground"
                        onClick={() => setIsRevealed(false)}
                    >
                        Hide Details
                    </Button>
                </div>
            )}
        </div>
    )
}
