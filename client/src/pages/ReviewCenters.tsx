import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Globe, Award } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ReviewCenter } from "@shared/schema";

export default function ReviewCenters() {
  const { data: centers } = useQuery<ReviewCenter[]>({
    queryKey: ["/api/review-centers"],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="Review Centers" showSearch />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <h3 className="font-bold mb-2">List Your Review Center</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Reach thousands of nursing students. ₱2,000 for 40 days of visibility.
          </p>
          <Button className="w-full" data-testid="button-list-center">
            List Your Center
          </Button>
        </Card>

        <div className="space-y-4">
          {centers && centers.length > 0 ? (
            centers.map((center) => (
              <Card key={center.id} className="p-6 space-y-4 hover-elevate" data-testid={`center-${center.id}`}>
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
            ))
          ) : (
            <Card className="p-8 text-center">
              <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No review centers listed yet</p>
            </Card>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
