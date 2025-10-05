import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardEntry {
  id: number;
  weekStart: Date;
  userId: string;
  score: number;
  rank: number | null;
  createdAt: Date;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
}

export default function WeeklyLeaderboard() {
  const { data, isLoading } = useQuery<{ rows: LeaderboardEntry[] }>({
    queryKey: ["/api/leaderboard/weekly"],
  });

  if (isLoading) {
    return (
      <Card data-testid="card-weekly-leaderboard">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Weekly Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!data?.rows || data.rows.length === 0) {
    return (
      <Card data-testid="card-weekly-leaderboard">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Weekly Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No rankings yet this week</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-weekly-leaderboard">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Weekly Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {data.rows.map((entry) => {
            const displayName = entry.user?.firstName && entry.user?.lastName
              ? `${entry.user.firstName} ${entry.user.lastName}`
              : "Anonymous";
            
            const rankIcon = entry.rank === 1 ? (
              <Medal className="h-5 w-5 text-yellow-500" />
            ) : entry.rank === 2 ? (
              <Medal className="h-5 w-5 text-gray-400" />
            ) : entry.rank === 3 ? (
              <Medal className="h-5 w-5 text-amber-600" />
            ) : null;

            return (
              <li 
                key={entry.userId} 
                className="flex items-center justify-between gap-3"
                data-testid={`leaderboard-entry-${entry.userId}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {rankIcon || (
                      <span className="text-sm font-medium text-muted-foreground w-5 text-center">
                        {entry.rank}
                      </span>
                    )}
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.user?.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {displayName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="font-medium truncate text-sm" data-testid={`text-name-${entry.userId}`}>
                    {displayName}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground font-medium" data-testid={`text-score-${entry.userId}`}>
                  {entry.score} pts
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
