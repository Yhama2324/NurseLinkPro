import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import PostCard from "@/components/PostCard";
import CreatePostDialog from "@/components/CreatePostDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post, User } from "@shared/schema";

const SAMPLE_POSTS: (Post & { user?: User })[] = [
  {
    id: 1,
    userId: "user-1",
    content: "Just finished my first week of clinical rotations! 🏥 Feeling overwhelmed but excited. Any tips for managing stress during clinicals?",
    hashtags: ["ClinicalLife", "NursingStudent", "StudyRN"],
    likesCount: 42,
    commentsCount: 8,
    imageUrl: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: {
      id: "user-1",
      email: "maria.santos@example.com",
      firstName: "Maria",
      lastName: "Santos",
      profileImageUrl: null,
      xp: 450,
      streak: 7,
      lastActiveDate: null,
      rank: "Student",
      subscriptionTier: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
  {
    id: 2,
    userId: "user-2",
    content: "Study tip: Use the ADPIE method to remember the nursing process! Assessment → Diagnosis → Planning → Implementation → Evaluation. This helped me ace my fundamentals exam! 📚✨",
    hashtags: ["StudyTips", "NCLEX2024", "NurseGoals"],
    likesCount: 128,
    commentsCount: 15,
    imageUrl: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    user: {
      id: "user-2",
      email: "juan.cruz@example.com",
      firstName: "Juan",
      lastName: "Cruz",
      profileImageUrl: null,
      xp: 1250,
      streak: 15,
      lastActiveDate: null,
      rank: "Scholar",
      subscriptionTier: "basic",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
  {
    id: 3,
    userId: "user-3",
    content: "Reminder: You chose nursing because you want to make a difference! 💙 Don't let one bad day or failed quiz define your journey. We've all been there. Keep pushing forward!",
    hashtags: ["Motivation", "BoardJourney", "NursingStudent"],
    likesCount: 89,
    commentsCount: 12,
    imageUrl: null,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    user: {
      id: "user-3",
      email: "ana.reyes@example.com",
      firstName: "Ana",
      lastName: "Reyes",
      profileImageUrl: null,
      xp: 780,
      streak: 12,
      lastActiveDate: null,
      rank: "Student",
      subscriptionTier: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
  {
    id: 4,
    userId: "user-4",
    content: "Question: What's your go-to method for memorizing drug classifications? I'm struggling with pharmacology right now 😓",
    hashtags: ["Pharmacology", "StudyHelp", "MedSurg"],
    likesCount: 34,
    commentsCount: 19,
    imageUrl: null,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    user: {
      id: "user-4",
      email: "carlo.deleon@example.com",
      firstName: "Carlo",
      lastName: "De Leon",
      profileImageUrl: null,
      xp: 320,
      streak: 4,
      lastActiveDate: null,
      rank: "Student",
      subscriptionTier: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
  {
    id: 5,
    userId: "user-5",
    content: "Celebrating small wins today! ✨ Completed 50 practice questions and got 90% correct. Consistency is key! Who else is grinding for their NCLEX/PNLE?",
    hashtags: ["NCLEX2024", "BoardJourney", "StudyWins"],
    likesCount: 156,
    commentsCount: 28,
    imageUrl: null,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    user: {
      id: "user-5",
      email: "sofia.garcia@example.com",
      firstName: "Sofia",
      lastName: "Garcia",
      profileImageUrl: null,
      xp: 2100,
      streak: 21,
      lastActiveDate: null,
      rank: "Expert",
      subscriptionTier: "premium",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
  {
    id: 6,
    userId: "user-6",
    content: "Looking for study buddies! Planning to review Maternal & Child Health this weekend. Anyone interested in forming a study party? 📖👥",
    hashtags: ["StudyGroup", "MaternalHealth", "NursingStudent"],
    likesCount: 67,
    commentsCount: 22,
    imageUrl: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    user: {
      id: "user-6",
      email: "miguel.ramos@example.com",
      firstName: "Miguel",
      lastName: "Ramos",
      profileImageUrl: null,
      xp: 890,
      streak: 9,
      lastActiveDate: null,
      rank: "Student",
      subscriptionTier: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
];

export default function Home() {
  const { data: posts, isLoading } = useQuery<(Post & { user?: User })[]>({
    queryKey: ["/api/posts"],
  });

  const { data: trendingHashtags } = useQuery<string[]>({
    queryKey: ["/api/trending-hashtags"],
  });

  const displayPosts = posts && posts.length > 0 ? posts : SAMPLE_POSTS;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="CareSpace" showSearch showNotifications />
      
      <div className="px-4 py-6 max-w-md mx-auto space-y-4">
        {/* Create Post Button */}
        <CreatePostDialog
          trigger={
            <Button className="w-full gap-2" size="lg" data-testid="button-create-post-trigger">
              <Plus className="w-5 h-5" />
              Share your experience
            </Button>
          }
        />

        {/* Trending Topics */}
        <Card className="p-4 card-reveal">
          <h3 className="font-semibold text-sm mb-3">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {(trendingHashtags || ["StudyRN", "BoardJourney", "NurseGoals", "MedSurg", "NCLEX2024", "Pharmacology", "ClinicalLife", "StudyWins"]).map((tag, index) => (
              <Button 
                key={tag} 
                variant="secondary" 
                size="sm" 
                className={`text-xs h-8 card-reveal stagger-${Math.min(index + 1, 5)}`}
                data-testid={`trending-${tag}`}
              >
                #{tag}
              </Button>
            ))}
          </div>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))}
            </>
          ) : (
            displayPosts.map((post, index) => (
              <div key={post.id} className={`card-reveal stagger-${Math.min(index + 1, 5)}`}>
                <PostCard post={post} />
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
