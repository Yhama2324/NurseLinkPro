import { useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CATEGORY_LABELS: Record<string, string> = {
  np1: "NP I — Community Health",
  np2: "NP II — Care of Mother & Child",
  np3: "NP III — Physiologic Alterations A",
  np4: "NP IV — Physiologic Alterations B",
  np5: "NP V — Psychosocial Alterations",
  fundamentals: "Fundamentals",
  maternal: "Maternal & Child",
  medsurg: "Med-Surg",
  psychiatric: "Psychiatric",
  pharmacology: "Pharmacology",
  community: "Community Health",
};

const CATEGORY_COLORS: Record<string, string> = {
  fundamentals: "bg-blue-500",
  maternal: "bg-pink-500",
  medsurg: "bg-green-500",
  psychiatric: "bg-purple-500",
  pharmacology: "bg-yellow-500",
  community: "bg-red-500",
};

interface QuizItem {
  id: number;
  question: string;
  choices: string[] | string;
  correctIndex: number;
  rationale: string;
  difficulty: string;
  topicName: string;
}

export default function QuizPage({ category }: { category: string }) {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0); // 0 = questions 1-10, 1 = 11-20, etc.
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [wrongItems, setWrongItems] = useState<QuizItem[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const { data: questions = [], isLoading } = useQuery<QuizItem[]>({
    queryKey: ["/api/quiz-items", category, page],
    queryFn: async () => {
      const offset = page * 10;
      const res = await fetch(
        `/api/quiz-items?subject_code=${category}&limit=10&offset=${offset}`,
        { credentials: "include" },
      );
      return res.json();
    },
  });

  // Save wrong answers mutation
  const saveWrongMutation = useMutation({
    mutationFn: async (items: QuizItem[]) => {
      await fetch("/api/wrong-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, category }),
        credentials: "include",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopHeader title={CATEGORY_LABELS[category] || category} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 mb-2">
            {page === 0
              ? "No questions available yet."
              : "No more questions for this level!"}
          </p>
          {page > 0 && (
            <p className="text-sm text-gray-400 mb-4">
              You've completed all available questions in this category. More
              coming soon!
            </p>
          )}
          <Button onClick={() => navigate("/quizzes")}>Back to Quizzes</Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const q = questions[current];
  const choices: string[] = Array.isArray(q.choices)
    ? q.choices
    : JSON.parse(q.choices as string);
  const total = questions.length;
  const level = page + 1;
  const globalQuestion = page * 10 + current + 1;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowRationale(true);
    const isCorrect = idx === q.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      setTotalCorrect((t) => t + 1);
    } else {
      setWrongItems((w) => [...w, q]);
    }
    setAnswers((a) => [...a, isCorrect]);
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      // Save wrong answers
      if (wrongItems.length > 0) {
        saveWrongMutation.mutate(wrongItems);
      }
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowRationale(false);
    }
  };

  const handleNextLevel = () => {
    setPage((p) => p + 1);
    setCurrent(0);
    setSelected(null);
    setShowRationale(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
    setWrongItems([]);
    queryClient.invalidateQueries({
      queryKey: ["/api/quiz-items", category, page + 1],
    });
  };

  const handleTryAgain = () => {
    setCurrent(0);
    setSelected(null);
    setShowRationale(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
    setWrongItems([]);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 75;

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/quizzes")}>
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold">{CATEGORY_LABELS[category]}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl mb-3">
            {pct >= 90 ? "🎉" : pct >= 75 ? "👏" : pct >= 50 ? "💪" : "📚"}
          </div>

          <h2 className="text-2xl font-bold mb-1">Level {level} Complete!</h2>
          <p className="text-gray-500 text-sm mb-4">
            Questions {page * 10 + 1}–{page * 10 + total}
          </p>

          {/* Score */}
          <div className="flex gap-6 mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{pct}%</p>
              <p className="text-xs text-gray-500">Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{score}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">{total - score}</p>
              <p className="text-xs text-gray-500">Wrong</p>
            </div>
          </div>

          {/* Answer dots */}
          <div className="flex flex-wrap justify-center gap-2 mb-5 max-w-xs">
            {answers.map((correct, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${correct ? "bg-green-500" : "bg-red-400"}`}
              >
                {page * 10 + i + 1}
              </div>
            ))}
          </div>

          {passed ? (
            <p className="text-green-600 font-semibold text-sm mb-4">
              ✅ Passed! You can proceed to the next level.
            </p>
          ) : (
            <p className="text-orange-500 font-semibold text-sm mb-4">
              ⚠️ Score below 75%. Review wrong answers before proceeding.
            </p>
          )}

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              onClick={handleNextLevel}
              className="w-full bg-blue-500 hover:bg-blue-600 font-semibold"
            >
              🚀 Next Level (Q{page * 10 + 11}–{page * 10 + 20})
            </Button>

            {wrongItems.length > 0 && (
              <Button
                variant="outline"
                onClick={() => navigate("/wrong-answers")}
                className="w-full border-red-300 text-red-500 hover:bg-red-50"
              >
                📝 Review {wrongItems.length} Wrong Answers
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleTryAgain}
              className="w-full"
            >
              🔄 Try Again (Level {level})
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate("/quizzes")}
              className="w-full text-gray-500"
            >
              Back to Quizzes
            </Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with progress */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/quizzes")}>
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold truncate">
                {CATEGORY_LABELS[category]}
              </p>
              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                Q{globalQuestion} • Lvl {level}
              </span>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${CATEGORY_COLORS[category] || "bg-blue-500"}`}
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">
            {current}/{total} this level
          </span>
          <Badge variant="outline" className="text-xs">
            {q.difficulty || "medium"}
          </Badge>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        <Card className="p-4 mb-4 shadow-sm">
          {q.topicName && (
            <p className="text-xs text-blue-500 font-medium mb-2 uppercase tracking-wide">
              {q.topicName}
            </p>
          )}
          <p className="text-base font-medium leading-relaxed text-gray-800">
            {q.question}
          </p>
        </Card>

        {/* Choices A-D */}
        <div className="space-y-3">
          {choices.slice(0, 4).map((choice, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === q.correctIndex;

            let cls =
              "w-full p-3.5 rounded-xl border-2 text-left transition-all ";
            if (selected === null) {
              cls += "border-gray-200 bg-white active:scale-98";
            } else if (isCorrect) {
              cls += "border-green-400 bg-green-50";
            } else if (isSelected && !isCorrect) {
              cls += "border-red-400 bg-red-50";
            } else {
              cls += "border-gray-100 bg-gray-50 opacity-60";
            }

            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`font-bold text-sm min-w-[22px] mt-0.5 ${
                      selected !== null && isCorrect
                        ? "text-green-600"
                        : selected !== null && isSelected
                          ? "text-red-500"
                          : "text-gray-400"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span
                    className={`flex-1 text-sm leading-relaxed ${
                      selected !== null && isCorrect
                        ? "text-green-800 font-medium"
                        : selected !== null && isSelected
                          ? "text-red-700"
                          : "text-gray-700"
                    }`}
                  >
                    {choice}
                  </span>
                  {selected !== null && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  )}
                  {selected !== null && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Rationale */}
        {showRationale && q.rationale && (
          <Card className="mt-4 p-4 bg-blue-50 border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                Rationale
              </p>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              {q.rationale}
            </p>
          </Card>
        )}

        {/* Next button */}
        {selected !== null && (
          <Button
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 font-semibold py-3"
            onClick={handleNext}
          >
            {current + 1 >= total ? "See Results 📊" : `Next Question →`}
          </Button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
