import { Trophy, Medal, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  };
  score: number;
}

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

export default function LeaderboardCard({ entry, isCurrentUser }: LeaderboardCardProps) {
  const { rank, user, score } = entry;
  
  const getRankIcon = () => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-chart-4 fill-chart-4" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400 fill-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-600 fill-orange-600" />;
    return null;
  };

  const rankBg = {
    1: "bg-chart-4/10",
    2: "bg-gray-100 dark:bg-gray-800",
    3: "bg-orange-100 dark:bg-orange-900/20"
  }[rank];

  return (
    <Card
      className={cn(
        "p-4 flex items-center gap-4",
        rankBg,
        isCurrentUser && "ring-2 ring-primary"
      )}
      data-testid={`leaderboard-${rank}`}
    >
      <div className="flex items-center justify-center w-10 h-10 shrink-0">
        {getRankIcon() || (
          <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
        )}
      </div>

      <Avatar className="w-10 h-10">
        <AvatarImage src={user.profileImageUrl || undefined} />
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          {user.firstName?.[0] || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">
          {user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : "Anonymous"}
        </p>
        {isCurrentUser && (
          <p className="text-xs text-primary font-medium">You</p>
        )}
      </div>

      <div className="text-right shrink-0">
        <p className="text-lg font-bold">{score}</p>
        <p className="text-xs text-muted-foreground">points</p>
      </div>
    </Card>
  );
}
