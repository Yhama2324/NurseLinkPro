import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Calendar, Trophy } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import QuizCard from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { Quiz } from "@shared/schema";

const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 1,
    title: "Cardiovascular Nursing Fundamentals",
    topic: "Cardiovascular System",
    category: "nclex",
    difficulty: "medium",
    createdById: null,
    isDaily: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "Pharmacology: Antibiotics & Antimicrobials",
    topic: "Pharmacology",
    category: "pnle",
    difficulty: "hard",
    createdById: null,
    isDaily: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "Maternal & Child Nursing Basics",
    topic: "Maternal Health",
    category: "nclex",
    difficulty: "easy",
    createdById: null,
    isDaily: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: "Mental Health & Psychiatric Nursing",
    topic: "Mental Health",
    category: "pnle",
    difficulty: "medium",
    createdById: null,
    isDaily: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    title: "Medical-Surgical Nursing: Respiratory",
    topic: "Respiratory System",
    category: "nclex",
    difficulty: "medium",
    createdById: null,
    isDaily: false,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 6,
    title: "Pediatric Nursing Essentials",
    topic: "Pediatrics",
    category: "pnle",
    difficulty: "easy",
    createdById: null,
    isDaily: false,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 7,
    title: "Fundamentals of Nursing Practice",
    topic: "Nursing Fundamentals",
    category: "nclex",
    difficulty: "easy",
    createdById: null,
    isDaily: false,
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
  },
  {
    id: 8,
    title: "Advanced Cardiac Life Support",
    topic: "Emergency Nursing",
    category: "pnle",
    difficulty: "hard",
    createdById: null,
    isDaily: false,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
  },
];

const SAMPLE_DAILY_CHALLENGE: Quiz = {
  id: 999,
  title: "Daily NCLEX Practice: Critical Thinking",
  topic: "Critical Thinking",
  category: "nclex",
  difficulty: "medium",
  createdById: null,
  isDaily: true,
  createdAt: new Date(),
};

export default function Quizzes() {
  const [selectedTab, setSelectedTab] = useState("all");
  
  const { data: quizzes } = useQuery<Quiz[]>({
    queryKey: ["/api/quizzes"],
  });

  const { data: dailyChallenge } = useQuery<Quiz>({
    queryKey: ["/api/daily-challenge"],
  });

  const displayQuizzes = quizzes && quizzes.length > 0 ? quizzes : SAMPLE_QUIZZES;
  const displayDailyChallenge = dailyChallenge || SAMPLE_DAILY_CHALLENGE;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="Quizzes" showSearch />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Daily Challenge */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 card-reveal shimmer">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Daily Challenge</h3>
              </div>
              <p className="text-sm text-muted-foreground">24 hours remaining</p>
            </div>
            <Badge className="bg-chart-4">+100 XP</Badge>
          </div>
          <p className="text-sm mb-4">{displayDailyChallenge.title}</p>
          <Button className="w-full" data-testid="button-start-daily">
            Start Challenge
          </Button>
        </Card>

        {/* AI Quiz Generator */}
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-secondary/20 card-reveal stagger-1 scale-on-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-bold">Generate Custom Quiz</h3>
              <p className="text-sm text-muted-foreground">AI-powered questions</p>
            </div>
          </div>
          <Button variant="secondary" className="w-full" data-testid="button-generate-quiz">
            Create Quiz with AI
          </Button>
        </Card>

        {/* Quiz Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
            <TabsTrigger value="pnle" data-testid="tab-pnle">PNLE</TabsTrigger>
            <TabsTrigger value="nclex" data-testid="tab-nclex">NCLEX</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {displayQuizzes.map((quiz, index) => (
              <div key={quiz.id} className={`card-reveal stagger-${Math.min(index + 2, 5)}`}>
                <QuizCard quiz={quiz} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="pnle" className="space-y-4 mt-4">
            {displayQuizzes
              .filter((quiz) => quiz.category === "pnle")
              .map((quiz, index) => (
                <div key={quiz.id} className={`card-reveal stagger-${Math.min(index + 1, 5)}`}>
                  <QuizCard quiz={quiz} />
                </div>
              ))}
            {displayQuizzes.filter((quiz) => quiz.category === "pnle").length === 0 && (
              <Card className="p-8 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No PNLE quizzes available yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="nclex" className="space-y-4 mt-4">
            {displayQuizzes
              .filter((quiz) => quiz.category === "nclex")
              .map((quiz, index) => (
                <div key={quiz.id} className={`card-reveal stagger-${Math.min(index + 1, 5)}`}>
                  <QuizCard quiz={quiz} />
                </div>
              ))}
            {displayQuizzes.filter((quiz) => quiz.category === "nclex").length === 0 && (
              <Card className="p-8 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No NCLEX quizzes available yet</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
