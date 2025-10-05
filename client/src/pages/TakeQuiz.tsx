import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Clock, CheckCircle, XCircle, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  rationale: string;
}

export default function TakeQuiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Mock questions
  const questions: Question[] = [
    {
      id: 1,
      questionText: "What is the normal range for adult blood pressure?",
      options: ["90/60 to 120/80 mmHg", "100/70 to 140/90 mmHg", "80/50 to 110/70 mmHg", "110/80 to 150/100 mmHg"],
      correctAnswer: "90/60 to 120/80 mmHg",
      rationale: "Normal blood pressure for adults is typically between 90/60 mmHg and 120/80 mmHg. Values outside this range may indicate hypertension or hypotension."
    }
  ];

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitAnswer = () => {
    const correct = selectedAnswer === currentQ.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const xpEarned = score * 10;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="p-8 max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <Award className="w-12 h-12 text-primary" />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground">Great job on completing the quiz</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{percentage}%</p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-chart-4">+{xpEarned}</p>
                <p className="text-sm text-muted-foreground">XP</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-chart-3" />
                <span>{score} Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <span>{questions.length - score} Wrong</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => setLocation("/quizzes")}
              data-testid="button-back-quizzes"
            >
              Back to Quizzes
            </Button>
            <Button
              variant="outline"
              className="w-full"
              data-testid="button-review-answers"
            >
              Review Answers
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border z-10">
        <div className="px-4 py-3 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-semibold tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" data-testid="quiz-progress" />
        </div>
      </div>

      {/* Question */}
      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold leading-relaxed mb-6">
            {currentQ.questionText}
          </h2>

          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={showResult}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate"
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        {/* Result Feedback */}
        {showResult && (
          <Card className={`p-6 ${isCorrect ? 'bg-chart-3/10' : 'bg-destructive/10'}`}>
            <div className="flex items-center gap-3 mb-3">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 text-chart-3" />
                  <h3 className="font-semibold text-chart-3">Correct!</h3>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-destructive" />
                  <h3 className="font-semibold text-destructive">Incorrect</h3>
                </>
              )}
            </div>
            <p className="text-sm leading-relaxed">{currentQ.rationale}</p>
          </Card>
        )}

        {/* Action Button */}
        {!showResult ? (
          <Button
            className="w-full h-12"
            disabled={!selectedAnswer}
            onClick={handleSubmitAnswer}
            data-testid="button-submit-answer"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            className="w-full h-12"
            onClick={handleNext}
            data-testid="button-next-question"
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Quiz"}
          </Button>
        )}
      </div>
    </div>
  );
}
