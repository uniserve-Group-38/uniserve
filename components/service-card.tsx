
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

const categoryColors: Record<string, string> = {
    "Laundry Services": "bg-cyan-400",
    "Barbering And Salon Services": "bg-pink-400",
    "Tech Support": "bg-purple-400",
    "Food Delivery Services": "bg-orange-400",
    "Cleaning Services": "bg-lime-400",
    "Tutoring": "bg-yellow-400",
}

export function ServiceCard({ id, title, description, category, status, price, provider }: ServiceCardProps) {
    const categoryColor = categoryColors[category] || "bg-purple-200"
    const statusColor = status === "Available"
        ? "bg-green-300 text-black"
        : "bg-yellow-300 text-black"

    return (
        <Link href={`/services/${id}`}>
            <Card className="h-full cursor-pointer overflow-hidden group bg-white">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                        <Badge variant="outline" className={`${categoryColor} border-black font-black`}>
                            {category}
                        </Badge>
                        <Badge variant="outline" className={`${statusColor} border-black font-black`}>
                            {status}
                        </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-1 group-hover:text-pink-500 transition-colors">{title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                    <p className="text-muted-foreground text-sm font-bold line-clamp-2 min-h-[2.5rem]">
                        {description}
                    </p>
                    {price && (
                        <div className="mt-3 font-black text-foreground flex items-center gap-1">
                            <span className="inline-block bg-yellow-300 border-2 border-black px-2 py-0.5 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {price}
                            </span>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="pt-3 border-t-4 border-black bg-muted/30 flex justify-between items-center text-xs font-bold">
                    <div className="flex items-center gap-2">
                        <div className="font-black text-foreground">{provider.name}</div>
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
