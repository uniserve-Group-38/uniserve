import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const CATEGORIES = ["All", "Events", "Internships", "Academic", "Campus News"];

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function AnnouncementsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const activeCategory = category || "All";

  const announcements = await prisma.announcement.findMany({
    where: {
      isActive: true,
      isVerified: true,
      ...(activeCategory !== "All" && { category: activeCategory }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Campus Announcements</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest events, internships, and campus news
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/announcements" : `/announcements?category=${cat}`}
          >
            <Badge
              variant={activeCategory === cat ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {cat}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {announcements.length} announcement{announcements.length !== 1 ? "s" : ""} found
        {activeCategory !== "All" && ` in ${activeCategory}`}
      </p>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No announcements found {activeCategory !== "All" && `in ${activeCategory}`}. Check back soon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Link
              key={announcement.id}
              href={`/announcements/${announcement.id}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{announcement.category}</Badge>
                        {announcement.isVerified && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                    </div>
                    <time className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  {announcement.summary && (
                    <CardDescription className="mt-2 line-clamp-2">
                      {announcement.summary}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div> 
  );
}