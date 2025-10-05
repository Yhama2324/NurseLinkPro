import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Settings, LogOut, Crown, Award, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import XPBar from "@/components/XPBar";
import StreakCounter from "@/components/StreakCounter";
import BadgeDisplay from "@/components/BadgeDisplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Badge as BadgeType, Post, User } from "@shared/schema";
import { RANK_LEVELS } from "@/lib/constants";

export default function Profile() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("stats");

  const { data: badges } = useQuery<BadgeType[]>({
    queryKey: ["/api/badges", user?.id],
    enabled: !!user,
  });

  const { data: userPosts } = useQuery<Post[]>({
    queryKey: ["/api/posts/user", user?.id],
    enabled: !!user,
  });

  const currentRank = RANK_LEVELS.find(
    (r) => (user?.xp || 0) >= r.min && (user?.xp || 0) <= r.max
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user.firstName?.[0] || user.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-xl font-bold">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "Nursing Student"}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="gap-1"
                  style={{ backgroundColor: `${currentRank?.color}20`, color: currentRank?.color }}
                >
                  <Crown className="w-3 h-3" />
                  {currentRank?.name}
                </Badge>
                <StreakCounter streak={user.streak || 0} />
              </div>
            </div>
          </div>

          <XPBar currentXP={user.xp || 0} nextLevelXP={100} level={Math.floor((user.xp || 0) / 100) + 1} />

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <TrendingUp className="w-4 h-4" />
                <p className="text-2xl font-bold">{user.xp || 0}</p>
              </div>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-chart-4 mb-1">
                <Award className="w-4 h-4" />
                <p className="text-2xl font-bold">{badges?.length || 0}</p>
              </div>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-foreground mb-1">{userPosts?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-2" data-testid="button-settings">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 text-destructive hover:bg-destructive/10"
            onClick={() => window.location.href = '/api/logout'}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="stats" data-testid="tab-stats">Stats</TabsTrigger>
            <TabsTrigger value="badges" data-testid="tab-badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4 mt-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Subscription</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium capitalize">{user.subscriptionTier || "Free"} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {user.subscriptionTier === "free" ? "Upgrade for more features" : "Active subscription"}
                  </p>
                </div>
                <Button size="sm" data-testid="button-upgrade">
                  {user.subscriptionTier === "free" ? "Upgrade" : "Manage"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {badges && badges.length > 0 ? (
                badges.map((badge) => (
                  <BadgeDisplay
                    key={badge.id}
                    name={badge.name}
                    description={badge.description || undefined}
                    isEarned={true}
                    earnedAt={badge.earnedAt}
                  />
                ))
              ) : (
                <Card className="col-span-2 p-8 text-center">
                  <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No badges earned yet. Keep learning!</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
