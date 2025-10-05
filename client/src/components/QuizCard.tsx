import { Clock, Award, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Quiz } from "@shared/schema";

interface QuizCardProps {
  quiz: Quiz & { questionCount?: number };
  onStart?: () => void;
}

export default function QuizCard({ quiz, onStart }: QuizCardProps) {
  const difficultyColors = {
    easy: "bg-chart-3 text-white",
    medium: "bg-chart-4 text-white",
    hard: "bg-destructive text-destructive-foreground"
  };

  return (
    <Card className="p-4 space-y-4 hover-elevate" data-testid={`quiz-${quiz.id}`}>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-base line-clamp-2">{quiz.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{quiz.topic}</p>
          </div>
          {quiz.isDaily && (
            <Badge variant="default" className="shrink-0">
              Daily
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{quiz.questionCount || 10} questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span className="capitalize">{quiz.difficulty}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>+50 XP</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge className={difficultyColors[quiz.difficulty as keyof typeof difficultyColors] || difficultyColors.medium}>
          {quiz.category}
        </Badge>
        <Button
          onClick={onStart}
          className="ml-auto"
          size="sm"
          data-testid="button-start-quiz"
        >
          Start Quiz
        </Button>
      </div>
    </Card>
  );
}
