import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Calendar, Sparkles, BookOpen, Zap, Trophy, ChevronRight } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { id: "fundamentals", label: "Fundamentals of Nursing", sub: "NP I", color: "from-blue-500 to-blue-600", bg: "bg-blue-50", border: "border-blue-200", textColor: "text-blue-700", emoji: "📋" },
  { id: "maternal", label: "Maternal & Child Health", sub: "NP II", color: "from-pink-500 to-rose-500", bg: "bg-pink-50", border: "border-pink-200", textColor: "text-pink-700", emoji: "👶" },
  { id: "medsurg", label: "Medical-Surgical Nursing", sub: "NP III / IV", color: "from-green-500 to-emerald-500", bg: "bg-green-50", border: "border-green-200", textColor: "text-green-700", emoji: "🏥" },
  { id: "psychiatric", label: "Psychiatric Nursing", sub: "NP V", color: "from-purple-500 to-violet-500", bg: "bg-purple-50", border: "border-purple-200", textColor: "text-purple-700", emoji: "🧠" },
  { id: "pharmacology", label: "Pharmacology", sub: "Drugs & Medications", color: "from-yellow-500 to-amber-500", bg: "bg-yellow-50", border: "border-yellow-200", textColor: "text-yellow-700", emoji: "💊" },
  { id: "community", label: "Community Health Nursing", sub: "Public Health", color: "from-red-500 to-orange-500", bg: "bg-red-50", border: "border-red-200", textColor: "text-red-700", emoji: "🌍" },
];

export default function Quizzes() {
  const [, navigate] = useLocation();
  const { data: counts = {} } = useQuery<Record<string, number>>({
    queryKey: ["/api/quiz-items/counts"],
    queryFn: async () => {
      const res = await fetch("/api/quiz-items/counts", { credentials: "include" });
      if (!res.ok) return {};
      return res.json();
    },
  });
  const totalQuestions = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopHeader title="Quizzes" />
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 pb-24 max-w-md mx-auto w-full">
        <Card className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-md">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-bold text-sm">Daily Challenge</span>
            </div>
            <Badge className="bg-yellow-400 text-yellow-900 text-xs font-bold">+100 XP</Badge>
          </div>
          <p className="text-xs text-blue-100 mb-3">10 random PNLE questions — refreshes every 24 hours</p>
          <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm h-9" onClick={() => navigate("/take-quiz/daily")}>
            <Zap className="w-4 h-4 mr-1" /> Start Daily Challenge
          </Button>
        </Card>
        {totalQuestions > 0 && (
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600"><span className="font-bold text-purple-600">{totalQuestions}</span> questions ready to practice</span>
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Study by Category</span>
          </div>
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const count = (counts as any)[cat.id] || 0;
              const hasQuestions = count > 0;
              return (
                <Card key={cat.id} className={"p-0 overflow-hidden border " + cat.border + " shadow-sm transition-all duration-200 " + (hasQuestions ? "hover:shadow-md" : "opacity-60")}>
                  <div className="flex items-center">
                    <div className={"w-1.5 self-stretch bg-gradient-to-b " + cat.color + " flex-shrink-0"} />
                    <div className="flex items-center gap-3 flex-1 p-4">
                      <div className={"w-11 h-11 rounded-xl " + cat.bg + " flex items-center justify-center text-xl flex-shrink-0"}>{cat.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 leading-tight">{cat.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{cat.sub} · <span className={hasQuestions ? cat.textColor : "text-gray-400"}>{count} question{count !== 1 ? "s" : ""}</span></p>
                      </div>
                      <Button size="sm" disabled={!hasQuestions} onClick={() => navigate("/take-quiz/" + cat.id)} className={"flex-shrink-0 h-9 px-4 text-xs font-bold bg-gradient-to-r " + cat.color + " text-white border-0 hover:opacity-90 disabled:opacity-40"}>
                        Start <ChevronRight className="w-3 h-3 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        {totalQuestions === 0 && (
          <Card className="p-8 text-center border-dashed">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No questions yet</p>
            <p className="text-xs text-gray-400 mt-1">Questions will appear here once added to the database.</p>
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
}