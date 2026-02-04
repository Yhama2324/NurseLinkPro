import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

// Development mode: bypass authentication
const DEV_MODE = import.meta.env.DEV;

const devUser: User = {
  id: 'dev-user-123',
  email: 'dev@example.com',
  firstName: 'Dev',
  lastName: 'User',
  profileImageUrl: null,
  xp: 1500,
  streak: 7,
  lastActiveDate: null,
  rank: 'Learner',
  subscriptionTier: 'free',
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  lastQuizGenerationTime: null,
  customQuizIntervalHours: 1,
  onboardingCompleted: true,
  schoolName: null,
  yearLevel: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !DEV_MODE,
  });

  // In dev mode, return the dev user immediately
  if (DEV_MODE) {
    return {
      user: devUser,
      isLoading: false,
      isAuthenticated: true,
    };
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
