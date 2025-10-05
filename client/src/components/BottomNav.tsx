import { Link, useLocation } from "wouter";
import { Home, BookOpen, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "CareSpace", testId: "nav-carespace" },
  { path: "/quizzes", icon: BookOpen, label: "Quizzes", testId: "nav-quizzes" },
  { path: "/clans", icon: Users, label: "Clans", testId: "nav-clans" },
  { path: "/profile", icon: User, label: "Profile", testId: "nav-profile" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[64px]",
                "hover-elevate active-elevate-2",
                isActive && "text-primary"
              )}
              data-testid={item.testId}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
              <span className={cn("text-xs font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
