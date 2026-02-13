
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
    categories: string[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentCategory = searchParams.get("category")

    const handleSelect = (category: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (category) {
            params.set("category", category)
        } else {
            params.delete("category")
        }
        router.push(`/services?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            <Button
                variant={currentCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelect(null)}
                className={cn(
                    "rounded-full transition-all",
                    currentCategory === null
                        ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                        : "hover:border-primary/50 hover:bg-primary/5 text-muted-foreground"
                )}
            >
                All
            </Button>
            {categories.map((category) => (
                <Button
                    key={category}
                    variant={currentCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelect(category)}
                    className={cn(
                        "rounded-full transition-all whitespace-nowrap",
                        currentCategory === category
                            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                            : "hover:border-primary/50 hover:bg-primary/5 text-muted-foreground"
                    )}
                >
                    {category}
                </Button>
            ))}
        </div>
    )
}
