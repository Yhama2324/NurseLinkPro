import { TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface XPBarProps {
  currentXP: number;
  nextLevelXP?: number;
  level?: number;
}

export default function XPBar({ currentXP, nextLevelXP = 100, level = 1 }: XPBarProps) {
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <TrendingUp className="w-4 h-4" />
          <span>Level {level}</span>
        </div>
        <span className="text-muted-foreground">
          {currentXP} / {nextLevelXP} XP
        </span>
      </div>
      <Progress value={progress} className="h-2" data-testid="xp-progress" />
    </div>
  );
}
