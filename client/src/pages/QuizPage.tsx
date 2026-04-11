import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  np1: "bg-red-500",
  np2: "bg-pink-500",
  np3: "bg-blue-500",
  np4: "bg-green-500",
  np5: "bg-purple-500",
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
  correct_index: number;
  rationale: string;
  difficulty: string;
  topicName: string;
  topic_name: string;
  subjectCode: string;
  subject_code: string;
}

export default function QuizPage({ category }: { category: string }) {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [wrongItems, setWrongItems] = useState<QuizItem[]>([]);

  // Load saved progress
  const { data: savedProgress } = useQuery({
    queryKey: ["/api/quiz-progress", category],
    queryFn: async () => {
      const res = await fetch(`/api/quiz-progress/${category}`, {
        credentials: "include",
      });
      return res.json();
    },
  });

  // Set page from saved progress
  useEffect(() => {
    if (savedProgress !== undefined && page === null) {
      setPage(savedProgress.currentLevel || 0);
    }
  }, [savedProgress]);

  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async (data: {
      currentLevel: number;
      totalCorrect: number;
      totalAnswered: number;
    }) => {
      await fetch("/api/quiz-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectCode: category, ...data }),
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/quiz-progress", category],
      });
    },
  });

  // Save wrong answers
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

  const { data: questions = [], isLoading } = useQuery<QuizItem[]>({
    queryKey: ["/api/quiz-items", category, page],
    queryFn: async () => {
      const offset = (page || 0) * 10;
      const res = await fetch(
        `/api/quiz-items?subject_code=${category}&limit=10&offset=${offset}`,
        { credentials: "include" },
      );
      return res.json();
    },
    enabled: page !== null,
  });

  if (page === null || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/quizzes")}>
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold">
            {CATEGORY_LABELS[category] || category}
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="font-bold text-xl mb-2">All questions completed!</h3>
          <p className="text-gray-500 text-sm mb-4">
            You've gone through all available questions. More coming soon!
          </p>
          <Button
            onClick={() => {
              setPage(0);
              saveProgressMutation.mutate({
                currentLevel: 0,
                totalCorrect: 0,
                totalAnswered: 0,
              });
            }}
          >
            Start Over
          </Button>
          <Button
            variant="ghost"
            className="mt-2"
            onClick={() => navigate("/quizzes")}
          >
            Back to Quizzes
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const q = questions[current];
  const correctIdx = q.correctIndex ?? q.correct_index ?? 0;
  const topicName = q.topicName || q.topic_name || "";
  const choices: string[] = Array.isArray(q.choices)
    ? q.choices
    : JSON.parse(q.choices as string);
  const total = questions.length;
  const level = (page || 0) + 1;
  const globalQuestion = (page || 0) * 10 + current + 1;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowRationale(true);
    const isCorrect = idx === correctIdx;
    if (isCorrect) setScore((s) => s + 1);
    else setWrongItems((w) => [...w, q]);
    setAnswers((a) => [...a, isCorrect]);
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      // Save wrong answers
      if (wrongItems.length > 0) saveWrongMutation.mutate(wrongItems);
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowRationale(false);
    }
  };

  const handleNextLevel = async () => {
    const nextPage = (page || 0) + 1;
    // Save progress first - wait for it
    try {
      await fetch("/api/quiz-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subjectCode: category, 
          currentLevel: nextPage, 
          totalCorrect: score, 
          totalAnswered: total 
        }),
        credentials: "include",
      });
      console.log('[QuizPage] Progress saved! Level:', nextPage);
    } catch(e) {
      console.error('[QuizPage] Save failed:', e);
    }
    setPage(nextPage);
    setCurrent(0);
    setSelected(null);
    setShowRationale(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
    setWrongItems([]);
    queryClient.invalidateQueries({ queryKey: ["/api/quiz-progress", category] });
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

  // Results screen
  if (finished) {
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 90;
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/quizzes")}>
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold">
            {CATEGORY_LABELS[category] || category}
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl mb-3">
            {pct >= 90 ? "🎉" : pct >= 75 ? "👏" : pct >= 50 ? "💪" : "📚"}
          </div>
          <h2 className="text-2xl font-bold mb-1">Level {level} Complete!</h2>
          <p className="text-gray-500 text-sm mb-4">
            Questions {(page || 0) * 10 + 1}–{(page || 0) * 10 + total}
          </p>
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
          <div className="flex flex-wrap justify-center gap-2 mb-5 max-w-xs">
            {answers.map((correct, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${correct ? "bg-green-500" : "bg-red-400"}`}
              >
                {(page || 0) * 10 + i + 1}
              </div>
            ))}
          </div>
          {passed ? (
            <p className="text-green-600 font-semibold text-sm mb-4">
              🏆 Excellent! 90%+ score — you can proceed!
            </p>
          ) : (
            <p className="text-orange-500 font-semibold text-sm mb-4">
              ❌ Need 9/10 (90%) to advance. Please retake this level!
            </p>
          )}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              onClick={handleNextLevel}
              className="w-full bg-blue-500 hover:bg-blue-600 font-semibold"
            >
              🚀 Next Level (Q{(page || 0) * 10 + 11}–{(page || 0) * 10 + 20})
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

  // Quiz screen
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/quizzes")}>
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold truncate">
                {CATEGORY_LABELS[category] || category}
              </p>
              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                Q{globalQuestion} • Lvl {level}
              </span>
            </div>
          </div>
        </div>
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
          <Badge variant="outline" className="text-xs capitalize">
            {q.difficulty || "medium"}
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-24">
        <Card className="p-4 mb-4 shadow-sm">
          {topicName && (
            <p className="text-xs text-blue-500 font-medium mb-2 uppercase tracking-wide">
              {topicName}
            </p>
          )}
          <p className="text-base font-medium leading-relaxed text-gray-800">
            {q.question}
          </p>
        </Card>

        <div className="space-y-3">
          {choices.slice(0, 4).map((choice, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === correctIdx;
            let cls =
              "w-full p-3.5 rounded-xl border-2 text-left transition-all ";
            if (selected === null) cls += "border-gray-200 bg-white";
            else if (isCorrect) cls += "border-green-400 bg-green-50";
            else if (isSelected) cls += "border-red-400 bg-red-50";
            else cls += "border-gray-100 bg-gray-50 opacity-60";

            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`font-bold text-sm min-w-[22px] mt-0.5 ${selected !== null && isCorrect ? "text-green-600" : selected !== null && isSelected ? "text-red-500" : "text-gray-400"}`}
                  >
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span
                    className={`flex-1 text-sm leading-relaxed ${selected !== null && isCorrect ? "text-green-800 font-medium" : selected !== null && isSelected ? "text-red-700" : "text-gray-700"}`}
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

        {showRationale && q.rationale && (
          <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-bold text-blue-700 uppercase">
                Rationale
              </p>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              {q.rationale}
            </p>
          </Card>
        )}

        {selected !== null && (
          <Button
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 font-semibold py-3"
            onClick={handleNext}
          >
            {current + 1 >= total ? "See Results 📊" : "Next Question →"}
          </Button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
