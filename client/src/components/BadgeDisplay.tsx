import { Award, Check, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BadgeProps {
  name: string;
  description?: string;
  isEarned: boolean;
  earnedAt?: Date;
}

export default function BadgeDisplay({ name, description, isEarned, earnedAt }: BadgeProps) {
  return (
    <Card
      className={cn(
        "p-4 text-center space-y-2 transition-all",
        isEarned ? "hover-elevate" : "opacity-50"
      )}
      data-testid={`badge-${name.toLowerCase().replace(/\s/g, "-")}`}
    >
      <div className="relative w-16 h-16 mx-auto">
        <div
          className={cn(
            "w-full h-full rounded-full flex items-center justify-center",
            isEarned ? "bg-primary/10" : "bg-muted"
          )}
        >
          {isEarned ? (
            <Award className="w-8 h-8 text-primary" />
          ) : (
            <Lock className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        {isEarned && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-chart-3 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-sm">{name}</h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {isEarned && earnedAt && (
          <p className="text-xs text-primary font-medium mt-1">
            Earned {new Date(earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  );
}
