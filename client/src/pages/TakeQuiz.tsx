import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle, XCircle, ChevronLeft, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { QuizItem } from "@shared/schema";

const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  np1:  { label: "NP I — Community Health Nursing",       emoji: "🌍", color: "text-red-600" },
  np2:  { label: "NP II — Care of Mother & Child",        emoji: "👶", color: "text-pink-600" },
  np3:  { label: "NP III — Physiologic Alterations A",    emoji: "🏥", color: "text-blue-600" },
  np4:  { label: "NP IV — Physiologic Alterations B",     emoji: "🩺", color: "text-green-600" },
  np5:  { label: "NP V — Psychosocial Alterations",       emoji: "🧠", color: "text-purple-600" },
  daily:{ label: "Daily Challenge",                        emoji: "⚡", color: "text-indigo-600" },
};

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function TakeQuiz() {
  const [, navigate] = useLocation();
  const [matchTake, paramsTake] = useRoute("/take-quiz/:category");
  const [matchQuiz, paramsQuiz] = useRoute("/quiz/:category");
  const category = (matchTake ? paramsTake?.category : paramsQuiz?.category) ?? "daily";
  const meta = CATEGORY_META[category] ?? { label: category, emoji: "📝", color: "text-gray-600" };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  const { data: items = [], isLoading } = useQuery<QuizItem[]>({
    queryKey: ["/api/quiz-items", category],
    queryFn: async () => {
      const url = category === "daily"
        ? "/api/quiz-items?limit=10"
        : `/api/quiz-items?subject_code=${category}&limit=10`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  useEffect(() => {
    if (completed || items.length === 0) return;
    if (timeLeft <= 0) { setCompleted(true); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, completed, items.length]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const currentItem = items[currentIndex];
  const choices: string[] = currentItem ? (currentItem.choices as string[]) : [];
  const progress = items.length ? ((currentIndex + (revealed ? 1 : 0)) / items.length) * 100 : 0;

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="text-4xl animate-bounce">{meta.emoji}</div>
        <p className="text-gray-500 text-sm">Loading questions…</p>
      </div>
    </div>
  );

  if (!isLoading && items.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <Card className="p-8 text-center max-w-sm w-full">
        <div className="text-5xl mb-4">🗂️</div>
        <h2 className="font-bold text-lg mb-2">No questions available</h2>
        <p className="text-sm text-gray-500 mb-6">No questions found for <strong>{meta.label}</strong> yet.</p>
        <Button className="w-full" onClick={() => navigate("/quizzes")}>← Back to Quizzes</Button>
      </Card>
    </div>
  );

  if (completed) {
    const pct = Math.round((score / items.length) * 100);
    const xp = score * 10 + (pct >= 80 ? 20 : 0);
    const emoji = pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪";
    const msg = pct >= 80 ? "Excellent work!" : pct >= 60 ? "Good job!" : "Keep practicing!";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="p-8 max-w-sm w-full text-center space-y-6">
          <div className="text-6xl">{emoji}</div>
          <div>
            <h2 className="text-2xl font-bold">{msg}</h2>
            <p className="text-gray-500 text-sm mt-1">{meta.emoji} {meta.label}</p>
          </div>
          <div className="flex justify-center gap-10">
            <div>
              <p className="text-4xl font-bold text-blue-600">{pct}%</p>
              <p className="text-xs text-gray-400 mt-0.5">Score</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-500">+{xp}</p>
              <p className="text-xs text-gray-400 mt-0.5">XP Earned</p>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle className="w-4 h-4" /><span>{score} correct</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-500">
              <XCircle className="w-4 h-4" /><span>{items.length - score} wrong</span>
            </div>
          </div>
          <div className="space-y-2">
            <Button className="w-full" onClick={() => navigate("/quizzes")}>Back to Quizzes</Button>
            <Button variant="outline" className="w-full" onClick={() => {
              setCurrentIndex(0); setSelectedIndex(null); setRevealed(false);
              setScore(0); setCompleted(false); setTimeLeft(600);
            }}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="px-4 py-3 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => navigate("/quizzes")} className="flex items-center gap-1 text-gray-500 text-sm hover:text-gray-800">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <span className={"text-sm font-semibold " + meta.color}>{meta.emoji} {meta.label}</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span className={timeLeft < 60 ? "text-red-500 font-bold" : ""}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-xs text-gray-400 whitespace-nowrap">{currentIndex + 1} / {items.length}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 max-w-md mx-auto w-full space-y-4">
        <Card className="p-5">
          {currentItem.topicName && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{currentItem.topicName}</p>
          )}
          <p className="text-base font-semibold text-gray-900 leading-relaxed">{currentItem.question}</p>
        </Card>

        <div className="space-y-2.5">
          {choices.map((choice, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrect = idx === currentItem.correctIndex;
            const isWrong = revealed && isSelected && !isCorrect;
            const isRight = revealed && isCorrect;
            let style = "border-gray-200 bg-white text-gray-800 hover:border-blue-400 hover:bg-blue-50";
            if (!revealed && isSelected) style = "border-blue-500 bg-blue-50 text-blue-800";
            if (isRight) style = "border-green-500 bg-green-50 text-green-800";
            if (isWrong) style = "border-red-400 bg-red-50 text-red-800";
            return (
              <button key={idx} onClick={() => { if (!revealed) setSelectedIndex(idx); }} disabled={revealed}
                className={"w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 " + style}>
                <span className={"flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 mt-0.5 " +
                  (isRight ? "bg-green-500 border-green-500 text-white" :
                   isWrong ? "bg-red-400 border-red-400 text-white" :
                   isSelected && !revealed ? "bg-blue-500 border-blue-500 text-white" :
                   "border-gray-300 text-gray-500")}>
                  {OPTION_LABELS[idx]}
                </span>
                <span className="text-sm leading-relaxed">{choice}</span>
                {isRight && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 ml-auto" />}
                {isWrong && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 ml-auto" />}
              </button>
            );
          })}
        </div>

        {revealed && currentItem.rationale && (
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Rationale</span>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">{currentItem.rationale}</p>
          </Card>
        )}

        {!revealed ? (
          <Button className="w-full h-12 text-sm font-bold" disabled={selectedIndex === null}
            onClick={() => { setRevealed(true); if (selectedIndex === currentItem.correctIndex) setScore(s => s + 1); }}>
            Confirm Answer
          </Button>
        ) : (
          <Button className="w-full h-12 text-sm font-bold" onClick={() => {
            if (currentIndex < items.length - 1) {
              setCurrentIndex(i => i + 1); setSelectedIndex(null); setRevealed(false);
            } else { setCompleted(true); }
          }}>
            {currentIndex < items.length - 1 ? "Next Question →" : "See Results 🎉"}
          </Button>
        )}
      </div>
    </div>
  );
}
