import { useLocation } from "wouter";
import { Sparkles, Calendar, BookOpen } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const CATEGORIES = [
  {
    id: "fundamentals",
    label: "Fundamentals of Nursing",
    sub: "NP I",
    color: "bg-blue-500",
    emoji: "📋",
  },
  {
    id: "maternal",
    label: "Maternal & Child Health",
    sub: "NP II",
    color: "bg-pink-500",
    emoji: "👶",
  },
  {
    id: "medsurg",
    label: "Medical-Surgical Nursing",
    sub: "NP III/IV",
    color: "bg-green-500",
    emoji: "🏥",
  },
  {
    id: "psychiatric",
    label: "Psychiatric Nursing",
    sub: "NP V",
    color: "bg-purple-500",
    emoji: "🧠",
  },
  {
    id: "pharmacology",
    label: "Pharmacology",
    sub: "Drugs & Meds",
    color: "bg-yellow-500",
    emoji: "💊",
  },
  {
    id: "community",
    label: "Community Health",
    sub: "Public Health",
    color: "bg-red-500",
    emoji: "🌍",
  },
];

export default function Quizzes() {
  const [, navigate] = useLocation();

  const { data: counts = {} } = useQuery({
    queryKey: ["/api/quiz-items/counts"],
    queryFn: async () => {
      const res = await fetch("/api/quiz-items/counts", {
        credentials: "include",
      });
      if (!res.ok) return {};
      return res.json();
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopHeader title="Quizzes" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* Daily Challenge */}
        <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Daily Challenge</span>
            </div>
            <Badge className="bg-yellow-400 text-yellow-900 text-xs">
              +100 XP
            </Badge>
          </div>
          <p className="text-sm text-blue-100 mb-3">
            10 random PNLE questions — refreshes every 24 hours
          </p>
          <Button
            className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            onClick={() => navigate("/quiz/daily")}
          >
            Start Daily Challenge
          </Button>
        </Card>

        {/* Categories */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Study by Category
          </h2>
          <div className="space-y-3">
            {CATEGORIES.map((cat) => (
              <Card key={cat.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-xl`}
                    >
                      {cat.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{cat.label}</p>
                      <p className="text-xs text-gray-500">
                        {cat.sub} • {counts[cat.id] || 0} questions
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/quiz/${cat.id}`)}
                    disabled={!counts[cat.id]}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4"
                  >
                    Start
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-purple-700">
              Total Questions Available
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {Object.values(counts as Record<string, number>).reduce(
              (a, b) => a + b,
              0,
            )}
          </p>
          <p className="text-xs text-purple-500">
            More questions added regularly!
          </p>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
