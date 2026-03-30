
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowRight, Check, MapPin } from "lucide-react"
import { DEFAULT_CATEGORY_IMAGES, ServiceCategory } from "@/lib/categories"

interface ServiceCardProps {
    id: string
    title: string
    description: string
    category: string
    status: string
    price: string | null
    imageUrl?: string | null
    index?: number
    provider: {
        name: string
        image: string | null
        location: string | null
    }
}

const categoryColors: Record<string, string> = {
    "Laundry": "bg-cyan-300",
    "Grooming": "bg-pink-300",
    "Tech Support": "bg-purple-300",
    "Food Delivery": "bg-orange-300",
    "Coffee Run": "bg-lime-300",
    "Tutoring": "bg-yellow-300",
}

export function ServiceCard({ id, title, description, category, status, price, imageUrl, provider, index = 0 }: ServiceCardProps) {
    const categoryBg = categoryColors[category] || "bg-pink-300"
    const displayImage = imageUrl || DEFAULT_CATEGORY_IMAGES[category as ServiceCategory] || DEFAULT_CATEGORY_IMAGES["Other"];

    // Alternating rotation based on index: odd index rotates anticlockwise (-15deg), even index rotates clockwise (10deg)
    const rotationClass = index !== undefined && index % 2 === 0
        ? "rotate-[1deg]"
        : "rotate-[-1deg]";

    return (
        <Link href={`/services/${id}`} className="block h-full cursor-pointer focus:outline-none rounded-none">
        <article className={`group relative border-4 border-black bg-white shadow-[8px_8px_0_0_#000] hover:translate-x-[-4px] hover:translate-y-[-4px]
         hover:shadow-[12px_12px_0_0_#000] transition-all duration-300 transform-gpu overflow-hidden flex flex-col h-full hover:scale-105 hover:rotate-0 ${rotationClass}`}>

            {/* Front Side: Default View (Hidden on hover) */}
            <div className="flex flex-col h-full transition-opacity duration-300 group-hover:opacity-0">
                {/* Header with image - Now Rectangular */}
                <div className="relative aspect-video w-full border-b-4 border-black bg-slate-50 overflow-hidden">
                    <Image
                        src={displayImage}
                        alt={title}
                        fill
                        className="object-cover"
                    />

                    {/* Tilted Verified Badge Overlay */}
                    <div className="absolute top-3 right-3 bg-[#86efac] border-[3px] border-black px-3 py-1 shadow-[4px_4px_0_0_#000] flex items-center gap-1.5 -rotate-2 z-10">
                        <Check className="w-4 h-4 text-black stroke-[4px]" />
                        <span className="text-xs font-black uppercase tracking-tight text-black">Verified</span>
                    </div>
                </div>

                {/* Content Body */}
                <CardContent className={`${categoryBg} p-5 grow flex flex-col gap-3`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
                        {category}
                    </span>

                    <h3 className="text-xl font-black uppercase leading-tight tracking-tight text-black line-clamp-2">
                        {title}
                    </h3>

                    <div className="flex items-center justify-between mt-auto pt-1">
                        {/* Rating Box */}
                        <div className="bg-yellow-400 border-2 border-black px-2 py-0.5 flex items-center gap-1.5 shadow-[2px_2px_0_0_#000]">
                            <Star className="w-3.5 h-3.5 fill-black text-black" />
                            <span className="font-black text-xs">4.6</span>
                        </div>

                        {/* Price */}
                        <div className="text-xl font-black tracking-tighter text-black">
                            {price || "FREE"}
                        </div>
                    </div>
                </CardContent>

                {/* Footer */}
                <div className="bg-black py-3 border-t-[3px] border-black flex items-center justify-center">
                    <span className="text-white text-xs font-black uppercase tracking-widest">
                        View Details →
                    </span>
                </div>
            </div>

            {/* Hover overlay with description */}
            <div className="absolute inset-0 bg-black/95 flex flex-col justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-20">
                <div className="p-6 flex flex-col grow">
                    <div className="text-[10px] font-black tracking-widest mb-2 text-cyan-300">{category.toUpperCase()}</div>
                    <h3 className="text-2xl font-black mb-4 line-clamp-2 leading-tight">{title}</h3>
                    <p className="font-bold mb-4 leading-relaxed text-sm line-clamp-4 text-white/90">{description}</p>
                    
                    <div className="flex items-end justify-between mt-auto mb-4 gap-2">
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 bg-yellow-300 text-black border-2 border-white px-2 py-1">
                            <Star className="w-3.5 h-3.5 fill-black text-black" />
                            <span className="font-black text-xs">4.6</span>
                            <span className="font-bold text-[10px]">(92)</span>
                        </div>
                        
                        {/* Price */}
                        <div className="font-black text-xl text-cyan-300 flex-shrink-0">
                            {price || "FREE"}
                        </div>
                    </div>

                   
                </div>

                {/* Bottom CTA strip */}
                <div className="block w-full">
                    <div className="bg-black text-white px-5 py-4 text-center font-black text-sm tracking-widest border-t-2 border-white/20 group-hover:bg-yellow-300 group-hover:text-black group-hover:border-black transition-colors">
                        VIEW DETAILS →
                    </div>
                </div>
            </div>
        </article>
        </Link>
    )
}
