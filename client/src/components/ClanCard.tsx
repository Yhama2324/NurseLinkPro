import { Users, TrendingUp, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Clan } from "@shared/schema";

interface ClanCardProps {
  clan: Clan;
  isMember?: boolean;
  onJoin?: () => void;
  onView?: () => void;
}

export default function ClanCard({ clan, isMember, onJoin, onView }: ClanCardProps) {
  return (
    <Card className="p-4 space-y-4 hover-elevate" data-testid={`clan-${clan.id}`}>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-base line-clamp-1 flex items-center gap-2">
              {clan.name}
              {clan.rank <= 3 && <Crown className="w-4 h-4 text-chart-4" />}
            </h3>
            {clan.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {clan.description}
              </p>
            )}
          </div>
          {clan.rank && (
            <Badge variant="secondary" className="shrink-0">
              #{clan.rank}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{clan.memberCount} members</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>{clan.totalXp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {isMember ? (
          <Button onClick={onView} variant="secondary" className="flex-1" data-testid="button-view-clan">
            View Clan
          </Button>
        ) : (
          <Button onClick={onJoin} className="flex-1" data-testid="button-join-clan">
            Join Clan
          </Button>
        )}
      </div>
    </Card>
  );
}
