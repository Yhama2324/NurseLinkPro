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
import type { Clan, Leaderboard, Party } from "@shared/schema";

const SAMPLE_CLANS: Clan[] = [
  {
    id: 1,
    name: "NCLEX Warriors",
    description: "Dedicated group preparing for NCLEX. Daily quizzes and study sessions!",
    creatorId: "user-1",
    memberCount: 156,
    totalXp: 45890,
    rank: 1,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    name: "Future Nurse Leaders",
    description: "Building the next generation of compassionate healthcare providers.",
    creatorId: "user-2",
    memberCount: 142,
    totalXp: 42150,
    rank: 2,
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    name: "Med-Surg Masters",
    description: "Focused on mastering medical-surgical nursing concepts.",
    creatorId: "user-3",
    memberCount: 128,
    totalXp: 38920,
    rank: 3,
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    name: "PNLE Achievers",
    description: "Filipino nurses preparing for the Philippine Nursing Licensure Exam.",
    creatorId: "user-4",
    memberCount: 98,
    totalXp: 29340,
    rank: 4,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    name: "Cardiac Care Experts",
    description: "Specializing in cardiovascular nursing and critical care.",
    creatorId: "user-5",
    memberCount: 87,
    totalXp: 26100,
    rank: 5,
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
  },
];

const SAMPLE_PARTIES: Party[] = [
  {
    id: 1,
    name: "Pharmacology Study Group",
    description: "Weekly sessions focusing on drug classifications and mechanisms",
    creatorId: "user-1",
    memberCount: 4,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    name: "Night Shift Study Crew",
    description: "Study together during late night hours",
    creatorId: "user-2",
    memberCount: 3,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    name: "Maternal Health Focus",
    description: "Preparing for OB/GYN nursing topics",
    creatorId: "user-3",
    memberCount: 5,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    name: "Pediatrics Champions",
    description: "Mastering pediatric nursing care",
    creatorId: "user-4",
    memberCount: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const SAMPLE_LEADERBOARD_ENTRIES = [
  {
    rank: 1,
    user: {
      id: "user-1",
      firstName: "Maria",
      lastName: "Santos",
      profileImageUrl: null,
    },
    score: 2850,
  },
  {
    rank: 2,
    user: {
      id: "user-2",
      firstName: "Juan",
      lastName: "Cruz",
      profileImageUrl: null,
    },
    score: 2420,
  },
  {
    rank: 3,
    user: {
      id: "user-3",
      firstName: "Ana",
      lastName: "Reyes",
      profileImageUrl: null,
    },
    score: 2180,
  },
];

export default function Clans() {
  const [selectedTab, setSelectedTab] = useState("clans");

  const { data: clans } = useQuery<Clan[]>({
    queryKey: ["/api/clans"],
  });

  const { data: parties } = useQuery<Party[]>({
    queryKey: ["/api/parties"],
  });

  const { data: leaderboard } = useQuery<Leaderboard[]>({
    queryKey: ["/api/leaderboard"],
  });

  const displayClans = clans && clans.length > 0 ? clans : SAMPLE_CLANS;
  const displayParties = parties && parties.length > 0 ? parties : SAMPLE_PARTIES;
  const displayLeaderboard = leaderboard && leaderboard.length > 0 ? leaderboard : SAMPLE_LEADERBOARD_ENTRIES;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="Clans & Leaderboards" showSearch />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Daily Challenge Leaderboard */}
        <Card className="p-6 bg-gradient-to-br from-chart-4/10 to-chart-3/10 card-reveal shimmer">
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
            {displayLeaderboard?.slice(0, 3).map((entry, index) => (
              <div key={entry.rank} className={`card-reveal stagger-${index + 1}`}>
                <LeaderboardCard entry={entry} />
              </div>
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
            <Button className="w-full gap-2 card-reveal" data-testid="button-create-clan">
              <Plus className="w-4 h-4" />
              Create Clan
            </Button>

            {displayClans.map((clan, index) => (
              <div key={clan.id} className={`card-reveal stagger-${Math.min(index + 1, 5)}`}>
                <ClanCard clan={clan} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="parties" className="space-y-4 mt-4">
            <Button className="w-full gap-2 card-reveal" data-testid="button-create-party">
              <Plus className="w-4 h-4" />
              Create Party
            </Button>

            {displayParties.map((party, index) => (
              <Card key={party.id} className={`p-4 hover-elevate card-reveal stagger-${Math.min(index + 1, 5)}`} data-testid={`party-${party.id}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{party.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{party.memberCount} members</span>
                  </div>
                </div>
                {party.description && (
                  <p className="text-sm text-muted-foreground mb-3">{party.description}</p>
                )}
                <Button size="sm" className="w-full" data-testid={`button-join-party-${party.id}`}>
                  Join Party
                </Button>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
