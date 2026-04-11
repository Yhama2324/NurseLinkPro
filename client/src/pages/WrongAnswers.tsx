import { useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CATEGORY_LABELS: Record<string, string> = {
  fundamentals: "NP I — Fundamentals",
  maternal: "NP II — Maternal & Child",
  medsurg: "NP III/IV — Med-Surg",
  psychiatric: "NP V — Psychiatric",
  pharmacology: "Pharmacology",
  community: "Community Health",
};

interface WrongItem {
  id: number;
  question: string;
  choices: string[] | string;
  correctIndex: number;
  rationale: string;
  difficulty: string;
  topicName: string;
  subjectCode: string;
  wrongAt: string;
}

export default function WrongAnswers() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [practiceMode, setPracticeMode] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState<boolean[]>([]);
  const [practiceFinished, setPracticeFinished] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "practice">("all");

  const { data: wrongItems = [], isLoading } = useQuery<WrongItem[]>({
    queryKey: ["/api/wrong-answers"],
    queryFn: async () => {
      const res = await fetch("/api/wrong-answers", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const clearMutation = useMutation({
    mutationFn: async (id?: number) => {
      const url = id ? `/api/wrong-answers/${id}` : "/api/wrong-answers";
      await fetch(url, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wrong-answers"] });
    },
  });

  const markCorrectMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/wrong-answers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wrong-answers"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Practice mode
  if (practiceMode && wrongItems.length > 0) {
    const q = wrongItems[current];
    const choices: string[] = Array.isArray(q.choices)
      ? q.choices
      : JSON.parse(q.choices as string);

    const handleSelect = (idx: number) => {
      if (selected !== null) return;
      setSelected(idx);
      setShowRationale(true);
      const isCorrect = idx === q.correctIndex;
      if (isCorrect) {
        setPracticeScore((s) => s + 1);
        markCorrectMutation.mutate(q.id);
      }
      setPracticeAnswers((a) => [...a, isCorrect]);
    };

    const handleNext = () => {
      if (current + 1 >= wrongItems.length) {
        setPracticeFinished(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowRationale(false);
      }
    };

    if (practiceFinished) {
      const pct = Math.round((practiceScore / wrongItems.length) * 100);
      return (
        <div className="min-h-screen flex flex-col bg-gray-50">
          <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                setPracticeMode(false);
                setPracticeFinished(false);
              }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-semibold">Practice Complete!</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-3">
              {pct >= 80 ? "🎉" : pct >= 60 ? "👏" : "📚"}
            </div>
            <h2 className="text-2xl font-bold mb-1">
              {practiceScore}/{wrongItems.length}
            </h2>
            <p className="text-3xl font-bold text-blue-600 mb-4">{pct}%</p>
            <p className="text-sm text-gray-500 mb-6">
              {practiceScore > 0
                ? `${practiceScore} items removed from your wrong answers list!`
                : "Keep practicing!"}
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button
                onClick={() => {
                  setPracticeMode(false);
                  setPracticeFinished(false);
                  setCurrent(0);
                  setPracticeScore(0);
                  setPracticeAnswers([]);
                }}
                className="w-full"
              >
                Back to Wrong Answers
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/quizzes")}
                className="w-full"
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
        <div className="bg-white border-b px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setPracticeMode(false)}>
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <p className="text-sm font-semibold">Practice Wrong Answers</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                <div
                  className="bg-red-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${(current / wrongItems.length) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {current + 1}/{wrongItems.length}
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto pb-24">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="outline"
              className="text-xs bg-red-50 text-red-500 border-red-200"
            >
              {CATEGORY_LABELS[q.subjectCode] || q.subjectCode}
            </Badge>
            {q.topicName && (
              <span className="text-xs text-gray-400">{q.topicName}</span>
            )}
          </div>

          <Card className="p-4 mb-4 shadow-sm">
            <p className="text-base font-medium leading-relaxed text-gray-800">
              {q.question}
            </p>
          </Card>

          <div className="space-y-3">
            {choices.slice(0, 4).map((choice, idx) => {
              const isSelected = selected === idx;
              const isCorrect = idx === q.correctIndex;
              let cls =
                "w-full p-3.5 rounded-xl border-2 text-left transition-all ";
              if (selected === null) {
                cls += "border-gray-200 bg-white";
              } else if (isCorrect) {
                cls += "border-green-400 bg-green-50";
              } else if (isSelected) {
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
              className="w-full mt-4 bg-red-500 hover:bg-red-600"
              onClick={handleNext}
            >
              {current + 1 >= wrongItems.length ? "See Results 📊" : "Next →"}
            </Button>
          )}
        </div>
        <BottomNav />
      </div>
    );
  }

  // Main wrong answers list
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/quizzes")}>
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="font-semibold flex-1">Wrong Answers</span>
        {wrongItems.length > 0 && (
          <button
            onClick={() => clearMutation.mutate(undefined)}
            className="text-xs text-red-400 hover:text-red-600"
          >
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {wrongItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="font-semibold text-gray-700 mb-1">
              No wrong answers!
            </h3>
            <p className="text-sm text-gray-400">
              Keep taking quizzes — wrong answers will appear here for review.
            </p>
            <Button className="mt-4" onClick={() => navigate("/quizzes")}>
              Go to Quizzes
            </Button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="flex gap-3 mb-4">
              <Card className="flex-1 p-3 text-center">
                <p className="text-2xl font-bold text-red-500">
                  {wrongItems.length}
                </p>
                <p className="text-xs text-gray-500">To Review</p>
              </Card>
              <Card className="flex-1 p-3 text-center bg-blue-50 border-blue-200">
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(wrongItems.map((i) => i.subjectCode)).size}
                </p>
                <p className="text-xs text-blue-500">Categories</p>
              </Card>
            </div>

            {/* Practice button */}
            <Button
              className="w-full mb-4 bg-red-500 hover:bg-red-600 font-semibold"
              onClick={() => {
                setPracticeMode(true);
                setCurrent(0);
                setSelected(null);
                setShowRationale(false);
                setPracticeScore(0);
                setPracticeAnswers([]);
                setPracticeFinished(false);
              }}
            >
              📝 Practice All Wrong Answers ({wrongItems.length})
            </Button>

            {/* Group by category */}
            {Object.entries(
              wrongItems.reduce(
                (acc, item) => {
                  if (!acc[item.subjectCode]) acc[item.subjectCode] = [];
                  acc[item.subjectCode].push(item);
                  return acc;
                },
                {} as Record<string, WrongItem[]>,
              ),
            ).map(([cat, items]) => (
              <div key={cat} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">
                    {CATEGORY_LABELS[cat] || cat}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs text-red-500 border-red-200"
                  >
                    {items.length} items
                  </Badge>
                </div>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <Card
                      key={item.id}
                      className="p-3 border-l-4 border-l-red-400"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2">
                            {item.question}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            ✓{" "}
                            {Array.isArray(item.choices)
                              ? item.choices[item.correctIndex]
                              : JSON.parse(item.choices as string)[
                                  item.correctIndex
                                ]}
                          </p>
                        </div>
                        <button
                          onClick={() => clearMutation.mutate(item.id)}
                          className="text-gray-300 hover:text-red-400 flex-shrink-0"
                        >
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
