import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, ExternalLink, Mail } from "lucide-react";

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });

  if (!announcement || !announcement.isActive || !announcement.isVerified) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/announcements">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Announcements
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{announcement.category}</Badge>
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Official</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">{announcement.title}</h1>

          <time className="text-sm text-muted-foreground">
            Posted on {new Date(announcement.createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-base leading-relaxed">
              {announcement.content}
            </p>
          </div>

          {(announcement.externalLink || announcement.contactInfo) && (
            <div className="pt-4 border-t space-y-3">
              {announcement.externalLink && (
                <a href={announcement.externalLink} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full sm:w-auto">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </a>
              )}

              {announcement.contactInfo && (
                <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
                  <Mail className="w-5 h-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Contact Information</p>
                    <p className="text-sm text-muted-foreground">{announcement.contactInfo}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}