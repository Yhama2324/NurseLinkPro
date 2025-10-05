import { useEffect, useState } from "react";
import { WEEKLY_CHALLENGE } from "@/../../shared/config/challenge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChallengeProgress {
  goal: number;
  answered: number;
  correct: number;
  streakWeeks: number;
}

export default function WeeklyChallengeCard() {
  const [state, setState] = useState<ChallengeProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/weekly-challenge/me", { credentials: "include" })
      .then(r => r.json())
      .then(setState)
      .catch(console.error);
  }, []);

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/weekly-challenge/finalize", {
        method: "POST",
        credentials: "include"
      });
      const data = await response.json();
      
      toast({
        title: data.completed ? "Week Completed!" : "Keep Going!",
        description: data.completed 
          ? `You earned ${data.score} points and ${data.streakWeeks} week streak!`
          : `Complete ${WEEKLY_CHALLENGE.weeklyGoal} questions to earn your badge`,
      });

      fetch("/api/weekly-challenge/me", { credentials: "include" })
        .then(r => r.json())
        .then(setState);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to finalize week",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state) return null;

  const pct = Math.min(100, Math.round((state.answered / state.goal) * 100));

  return (
    <Card data-testid="card-weekly-challenge">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Weekly 1-100 Challenge
        </CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Flame className="h-4 w-4" />
          <span data-testid="text-streak">{state.streakWeeks}w</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-3 bg-primary transition-all duration-300" 
            style={{ width: `${pct}%` }}
            data-testid="progress-bar"
          />
        </div>

        <div className="text-sm text-muted-foreground" data-testid="text-progress">
          {state.answered}/{state.goal} answered • {state.correct} correct
        </div>

        <Button
          onClick={handleFinalize}
          disabled={loading}
          className="w-full"
          data-testid="button-finalize"
        >
          {loading ? "Processing..." : "Finalize Week & Claim Badge"}
        </Button>

        <p className="text-xs text-muted-foreground">
          Pro & Elite only. Complete 100 MCQs/week to earn badges and ranking XP.
        </p>
      </CardContent>
    </Card>
  );
}
