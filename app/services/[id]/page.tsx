
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Phone, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { ContactProvider } from "@/components/contact-provider"

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ServiceDetailsPage({ params }: PageProps) {
    const { id } = await params

    const service = await prisma.service.findUnique({
        where: { id },
        include: { provider: true },
    })

    if (!service) {
        notFound()
    }

    // Determine status color
    const statusColor = service.status === "Available" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"

    return (
        <div className="container py-8 max-w-4xl mx-auto px-4 md:px-6">
            <div className="mb-6">
                <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1">
                    &larr; Back to Services
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 w-1 h-full bg-primary/20 rounded-full" />
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="outline" className="text-base px-3 py-1 bg-primary/5 text-primary border-primary/20">
                                {service.category}
                            </Badge>
                            <Badge variant="secondary" className={`${statusColor} text-base px-3 py-1`}>
                                {service.status}
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                            {service.title}
                        </h1>
                        <div className="flex flex-col gap-3 mb-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                            {service.price && (
                                <div className="text-2xl font-bold text-primary flex items-center gap-2">
                                    {service.price}
                                    <span className="text-sm font-normal text-muted-foreground ml-2">starting price</span>
                                </div>
                            )}
                            {service.operatingHours && (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Clock className="h-4 w-4 text-primary/70" />
                                    <span>{service.operatingHours}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {service.description}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Provider Info */}
                <div className="space-y-6">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle className="text-lg">About the Provider</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border">
                                    <AvatarImage src={service.provider.image || ""} alt={service.provider.name} />
                                    <AvatarFallback>
                                        <UserIcon className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold">{service.provider.name}</div>
                                    <div className="text-xs text-muted-foreground">Joined {service.provider.createdAt.toLocaleDateString()}</div>
                                </div>
                            </div>

                            {service.provider.bio && (
                                <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t">
                                    {service.provider.bio}
                                </p>
                            )}

                            <div className="space-y-3 pt-2 border-t">
                                <ContactProvider
                                    phoneNumber={service.provider.phoneNumber}
                                    location={service.provider.location}
                                />
                            </div>
                        </CardContent>

                    </Card>
                </div>
            </div>
        </div>
    )
}
