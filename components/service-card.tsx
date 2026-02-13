
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone } from "lucide-react"

// Define Service type locally or import from Prisma client/types
// For now, inline interface based on schema
interface ServiceCardProps {
    id: string
    title: string
    description: string
    category: string
    status: string
    price: string | null
    provider: {
        name: string
        image: string | null
        location: string | null
    }
}

export function ServiceCard({ id, title, description, category, status, price, provider }: ServiceCardProps) {
    // Determine status color
    const statusColor = status === "Available" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"

    return (
        <Link href={`/services/${id}`}>
            <Card className="h-full hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm group">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                        <Badge variant="outline" className="text-primary bg-primary/5 border-primary/20 font-medium mb-2 group-hover:bg-primary/10 transition-colors">
                            {category}
                        </Badge>
                        <Badge variant="secondary" className={statusColor}>
                            {status}
                        </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">{title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                    <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
                        {description}
                    </p>
                    {price && (
                        <div className="mt-3 font-semibold text-foreground flex items-center gap-1">
                            <span className="text-primary">●</span> {price}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="pt-3 border-t bg-muted/30 flex justify-between items-center text-xs text-muted-foreground group-hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                        {/* Use Avatar if available, or just name */}
                        <div className="font-medium text-foreground">{provider.name}</div>
                    </div>
                    {provider.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[100px]">{provider.location}</span>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </Link>
    )
}
