
import { prisma } from "@/lib/prisma"
import { ServiceCard } from "@/components/service-card"
import { ServiceSearch } from "@/components/service-search"
import { CategoryFilter } from "@/components/category-filter"
import { Prisma } from "@prisma/client"

export const dynamic = 'force-dynamic'

interface SearchParams {
    q?: string
    category?: string
}

export default async function ServicesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams
    const query = params.q
    const category = params.category

    // 1. Fetch distinct categories
    const categoriesData = await prisma.service.findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
    })
    const categories = categoriesData.map(c => c.category)

    // 2. Build filter conditions
    const where: Prisma.ServiceWhereInput = {
        AND: [
            // Search Filter
            query ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ]
            } : {},
            // Category Filter
            category ? { category: { equals: category } } : {},
        ]
    }

    // 3. Fetch filtered services
    const services = await prisma.service.findMany({
        where,
        include: {
            provider: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return (
        <div className="container py-8 max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                    <p className="text-muted-foreground">
                        Browse available services from verified providers in your area.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <ServiceSearch />
                </div>

                <CategoryFilter categories={categories} />
            </div>

            {services.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10">
                    <p className="text-muted-foreground mb-2">No services found.</p>
                    <p className="text-sm text-muted-foreground/80">
                        {query || category
                            ? "Try adjusting your search or filters."
                            : "Check back later for new listings."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            id={service.id}
                            title={service.title}
                            description={service.description}
                            category={service.category}
                            status={service.status}
                            price={service.price}
                            provider={{
                                name: service.provider.name,
                                image: service.provider.image,
                                location: service.provider.location,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
