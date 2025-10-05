import { useQuery } from "@tanstack/react-query";
import { Megaphone, ExternalLink } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Advertisement } from "@shared/schema";
import { AD_CATEGORIES } from "@/lib/constants";

export default function AdSpace() {
  const { data: ads } = useQuery<Advertisement[]>({
    queryKey: ["/api/advertisements"],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="AdSpace" showSearch />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-secondary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-bold">Advertise Your Brand</h3>
              <p className="text-sm text-muted-foreground">Reach nursing students nationwide</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-sm"><strong>Basic:</strong> ₱1,000 for 30 days</p>
            <p className="text-sm"><strong>Featured:</strong> ₱3,000 for 60 days</p>
          </div>
          <Button className="w-full" data-testid="button-advertise">
            Start Advertising
          </Button>
        </Card>

        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all" data-testid="tab-all-ads">All</TabsTrigger>
            <TabsTrigger value="education" data-testid="tab-education">Education</TabsTrigger>
            <TabsTrigger value="career" data-testid="tab-career">Career</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {ads && ads.length > 0 ? (
              ads.map((ad) => (
                <Card
                  key={ad.id}
                  className="overflow-hidden hover-elevate"
                  data-testid={`ad-${ad.id}`}
                >
                  {ad.imageUrl && (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{ad.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{ad.description}</p>
                      </div>
                      {ad.tier === "featured" && (
                        <Badge className="bg-chart-4 shrink-0">Featured</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {ad.category}
                      </Badge>
                    </div>

                    <Button variant="secondary" className="w-full gap-2" data-testid="button-view-ad">
                      Learn More
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Megaphone className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No advertisements yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="education" className="space-y-4 mt-4">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No education ads yet</p>
            </Card>
          </TabsContent>

          <TabsContent value="career" className="space-y-4 mt-4">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No career ads yet</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
