import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import SplashScreen from "@/components/SplashScreen";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Quizzes from "@/pages/Quizzes";
import Profile from "@/pages/Profile";
import Clans from "@/pages/Clans";
import ReviewCenters from "@/pages/ReviewCenters";
import Jobs from "@/pages/Jobs";
import AdSpace from "@/pages/AdSpace";
import Subscriptions from "@/pages/Subscriptions";
import TakeQuiz from "@/pages/TakeQuiz";
import NurseMind from "@/pages/NurseMind";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/quizzes" component={Quizzes} />
          <Route path="/quiz/:id" component={TakeQuiz} />
          <Route path="/clans" component={Clans} />
          <Route path="/profile" component={Profile} />
          <Route path="/nursemind" component={NurseMind} />
          <Route path="/review-centers" component={ReviewCenters} />
          <Route path="/jobs" component={Jobs} />
          <Route path="/adspace" component={AdSpace} />
          <Route path="/subscriptions" component={Subscriptions} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
