import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopHeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export default function TopHeader({ title, showSearch = false, showNotifications = false }: TopHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {user && (
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user.firstName?.[0] || user.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          )}
          {title && <h1 className="text-lg font-semibold">{title}</h1>}
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              size="icon"
              variant="ghost"
              className="w-9 h-9"
              data-testid="button-search"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}
          {showNotifications && (
            <Button
              size="icon"
              variant="ghost"
              className="w-9 h-9 relative"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
