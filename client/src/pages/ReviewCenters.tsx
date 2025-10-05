import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Globe, Award } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ReviewCenter } from "@shared/schema";

const SAMPLE_CENTERS: ReviewCenter[] = [
  {
    id: 1,
    name: "Kaplan NCLEX Review Center",
    description: "Premier NCLEX review center with proven track record. Comprehensive materials, expert instructors, and personalized coaching.",
    price: 25000,
    duration: 60,
    topnotchers: ["Maria Santos - 99th percentile", "Juan Dela Cruz - Top 10", "Sofia Garcia - Passed on first take"],
    website: "https://example.com/kaplan",
    contactInfo: "+63 917 123 4567",
    isActive: true,
    expiresAt: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    name: "PNLE Success Review Hub",
    description: "Specialized PNLE preparation with updated curriculum. Small class sizes for focused learning and high pass rates.",
    price: 18000,
    duration: 45,
    topnotchers: ["Anna Reyes - Top 5 Passer", "Carlos Martinez - 95th percentile"],
    website: "https://example.com/pnle-success",
    contactInfo: "+63 918 234 5678",
    isActive: true,
    expiresAt: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    name: "Manila Review Center for Nurses",
    description: "Established review center with 20+ years of experience. Comprehensive review materials and mock exams.",
    price: 22000,
    duration: 50,
    topnotchers: ["Gabriela Santos - Top 20", "Miguel Torres - 90th percentile"],
    website: "https://example.com/manila-review",
    contactInfo: "+63 919 345 6789",
    isActive: true,
    expiresAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    name: "Excellence Nursing Review",
    description: "Online and in-person classes available. Flexible schedules to accommodate working professionals.",
    price: 16000,
    duration: 40,
    topnotchers: ["Lisa Fernandez - Passed first try"],
    website: "https://example.com/excellence",
    contactInfo: "+63 920 456 7890",
    isActive: true,
    expiresAt: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
];

export default function ReviewCenters() {
  const { data: centers } = useQuery<ReviewCenter[]>({
    queryKey: ["/api/review-centers"],
  });

  const displayCenters = centers && centers.length > 0 ? centers : SAMPLE_CENTERS;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="Review Centers" showSearch />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 card-reveal shimmer">
          <h3 className="font-bold mb-2">List Your Review Center</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Reach thousands of nursing students. ₱2,000 for 40 days of visibility.
          </p>
          <Button className="w-full" data-testid="button-list-center">
            List Your Center
          </Button>
        </Card>

        <div className="space-y-4">
          {displayCenters.map((center, index) => (
            <Card key={center.id} className={`p-6 space-y-4 hover-elevate scale-on-hover card-reveal stagger-${Math.min(index + 1, 5)}`} data-testid={`center-${center.id}`}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg">{center.name}</h3>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{center.description}</p>
                </div>

                {center.topnotchers && Array.isArray(center.topnotchers) && center.topnotchers.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Award className="w-4 h-4 text-chart-4" />
                      <span>Top Achievers</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {center.topnotchers.slice(0, 3).map((name: any, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {typeof name === 'string' ? name : name.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  {center.contactInfo && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{center.contactInfo}</span>
                    </div>
                  )}
                  {center.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <a href={center.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                <Button variant="secondary" className="w-full" data-testid="button-contact-center">
                  Contact Center
                </Button>
              </Card>
            ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
