import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Brain, Users, Trophy, Sparkles } from "lucide-react";
import { TAGLINES } from "@/lib/constants";

export default function Landing() {
  const [tagline, setTagline] = useState(TAGLINES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTagline(TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <div className="px-4 py-16 max-w-md mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
            <Heart className="w-10 h-10 text-primary" fill="currentColor" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight">
            CKalingaLink
          </h1>
          
          <p className="text-lg text-muted-foreground font-medium leading-relaxed px-4">
            Connecting care, courage, and community
          </p>
        </div>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <p className="text-base leading-relaxed font-medium text-center min-h-[4rem] flex items-center justify-center">
            {tagline}
          </p>
        </Card>

        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold"
          onClick={() => window.location.href = '/api/login'}
          data-testid="button-login"
        >
          Get Started
        </Button>
      </div>

      {/* Features Grid */}
      <div className="px-4 pb-16 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">AI-Powered Quizzes</h3>
            <p className="text-xs text-muted-foreground">Adaptive learning for PNLE & NCLEX</p>
          </Card>

          <Card className="p-4 text-center space-y-2">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-sm">Social Learning</h3>
            <p className="text-xs text-muted-foreground">Connect with nursing students</p>
          </Card>

          <Card className="p-4 text-center space-y-2">
            <div className="w-12 h-12 bg-chart-3/20 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6 text-chart-3" />
            </div>
            <h3 className="font-semibold text-sm">Compete & Grow</h3>
            <p className="text-xs text-muted-foreground">Daily challenges & leaderboards</p>
          </Card>

          <Card className="p-4 text-center space-y-2">
            <div className="w-12 h-12 bg-chart-4/20 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-chart-4" />
            </div>
            <h3 className="font-semibold text-sm">Track Progress</h3>
            <p className="text-xs text-muted-foreground">XP, streaks, and achievements</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
