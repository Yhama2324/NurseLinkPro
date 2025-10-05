import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export default function StreakCounter({ streak, size = "md" }: StreakCounterProps) {
  const sizes = {
    sm: "w-4 h-4 text-sm",
    md: "w-5 h-5 text-base",
    lg: "w-6 h-6 text-lg"
  };

  return (
    <div className="flex items-center gap-1.5" data-testid="streak-counter">
      <Flame className={cn(sizes[size], streak > 0 ? "text-chart-4 fill-chart-4" : "text-muted-foreground")} />
      <span className={cn("font-semibold", sizes[size], streak > 0 ? "text-chart-4" : "text-muted-foreground")}>
        {streak}
      </span>
    </div>
  );
}
