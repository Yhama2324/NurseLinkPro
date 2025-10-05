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

const SAMPLE_ADS: Advertisement[] = [
  {
    id: 1,
    title: "Professional Nursing Uniforms - 20% Off",
    description: "Get premium quality nursing scrubs and uniforms. Free shipping on orders over ₱2,000. Limited time offer!",
    imageUrl: null,
    category: "education",
    tier: "featured",
    price: 3000,
    duration: 60,
    impressions: 1250,
    clicks: 85,
    isActive: true,
    expiresAt: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "NCLEX Study Materials Bundle",
    description: "Complete NCLEX review package with practice questions, flashcards, and video lectures. Pass guaranteed!",
    imageUrl: null,
    category: "education",
    tier: "featured",
    price: 3000,
    duration: 60,
    impressions: 980,
    clicks: 62,
    isActive: true,
    expiresAt: new Date(Date.now() + 48 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "Nursing Jobs in Canada - Apply Now",
    description: "Exciting opportunities for Filipino nurses in Canada. Competitive salary, relocation assistance, and visa support.",
    imageUrl: null,
    category: "career",
    tier: "basic",
    price: 1000,
    duration: 30,
    impressions: 520,
    clicks: 45,
    isActive: true,
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: "Medical Equipment Store - Student Discounts",
    description: "Stethoscopes, BP apparatus, and nursing kits at student-friendly prices. Visit our store or order online.",
    imageUrl: null,
    category: "education",
    tier: "basic",
    price: 1000,
    duration: 30,
    impressions: 450,
    clicks: 28,
    isActive: true,
    expiresAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    title: "Healthcare Insurance for Nurses",
    description: "Comprehensive health coverage tailored for healthcare professionals. Affordable premiums and extensive benefits.",
    imageUrl: null,
    category: "career",
    tier: "basic",
    price: 1000,
    duration: 30,
    impressions: 380,
    clicks: 19,
    isActive: true,
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
];

export default function AdSpace() {
  const { data: ads } = useQuery<Advertisement[]>({
    queryKey: ["/api/advertisements"],
  });

  const displayAds = ads && ads.length > 0 ? ads : SAMPLE_ADS;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="AdSpace" showSearch />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-secondary/20 card-reveal shimmer">
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
            {displayAds.map((ad, index) => (
                <Card
                  key={ad.id}
                  className={`overflow-hidden hover-elevate  card-reveal stagger-${Math.min(index + 1, 5)}`}
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
              ))}
          </TabsContent>

          <TabsContent value="education" className="space-y-4 mt-4">
            {displayAds
              .filter((ad) => ad.category === "education")
              .map((ad, index) => (
                <Card
                  key={ad.id}
                  className={`overflow-hidden hover-elevate  card-reveal stagger-${Math.min(index + 1, 5)}`}
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
              ))}
            {displayAds.filter((ad) => ad.category === "education").length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No education ads yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="career" className="space-y-4 mt-4">
            {displayAds
              .filter((ad) => ad.category === "career")
              .map((ad, index) => (
                <Card
                  key={ad.id}
                  className={`overflow-hidden hover-elevate  card-reveal stagger-${Math.min(index + 1, 5)}`}
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
              ))}
            {displayAds.filter((ad) => ad.category === "career").length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No career ads yet</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
