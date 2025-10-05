import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trophy, Users } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import ClanCard from "@/components/ClanCard";
import LeaderboardCard from "@/components/LeaderboardCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Clan, Leaderboard } from "@shared/schema";

export default function Clans() {
  const [selectedTab, setSelectedTab] = useState("clans");

  const { data: clans } = useQuery<Clan[]>({
    queryKey: ["/api/clans"],
  });

  const { data: leaderboard } = useQuery<Leaderboard[]>({
    queryKey: ["/api/leaderboard"],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="Clans & Leaderboards" showSearch />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Daily Challenge Leaderboard */}
        <Card className="p-6 bg-gradient-to-br from-chart-4/10 to-chart-3/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-chart-4" />
              <h3 className="font-bold">Daily Challenge</h3>
            </div>
            <Button size="sm" variant="secondary" data-testid="button-view-leaderboard">
              View All
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Top 3 today</p>
          <div className="space-y-2">
            {leaderboard?.slice(0, 3).map((entry) => (
              <LeaderboardCard
                key={entry.id}
                entry={entry as any}
              />
            ))}
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="clans" data-testid="tab-clans">
              <Users className="w-4 h-4 mr-2" />
              Clans
            </TabsTrigger>
            <TabsTrigger value="parties" data-testid="tab-parties">
              <Users className="w-4 h-4 mr-2" />
              Parties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clans" className="space-y-4 mt-4">
            <Button className="w-full gap-2" data-testid="button-create-clan">
              <Plus className="w-4 h-4" />
              Create Clan
            </Button>

            {clans && clans.length > 0 ? (
              clans.map((clan) => <ClanCard key={clan.id} clan={clan} />)
            ) : (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No clans available yet</p>
                <Button size="sm" data-testid="button-create-first-clan">
                  Create the First Clan
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="parties" className="space-y-4 mt-4">
            <Button className="w-full gap-2" data-testid="button-create-party">
              <Plus className="w-4 h-4" />
              Create Party
            </Button>

            <Card className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No parties yet. Create a small study group!</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
