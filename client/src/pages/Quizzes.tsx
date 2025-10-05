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

export default function Quizzes() {
  const [selectedTab, setSelectedTab] = useState("all");
  
  const { data: quizzes } = useQuery<Quiz[]>({
    queryKey: ["/api/quizzes"],
  });

  const { data: dailyChallenge } = useQuery<Quiz>({
    queryKey: ["/api/daily-challenge"],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="Quizzes" showSearch />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Daily Challenge */}
        {dailyChallenge && (
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
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
            <p className="text-sm mb-4">{dailyChallenge.title}</p>
            <Button className="w-full" data-testid="button-start-daily">
              Start Challenge
            </Button>
          </Card>
        )}

        {/* AI Quiz Generator */}
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-secondary/20">
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
            {quizzes && quizzes.length > 0 ? (
              quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
            ) : (
              <Card className="p-8 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No quizzes available. Generate one with AI!</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pnle" className="space-y-4 mt-4">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">PNLE quizzes coming soon</p>
            </Card>
          </TabsContent>

          <TabsContent value="nclex" className="space-y-4 mt-4">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">NCLEX quizzes coming soon</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
