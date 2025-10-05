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

export default function Home() {
  const { data: posts, isLoading } = useQuery<(Post & { user?: User })[]>({
    queryKey: ["/api/posts"],
  });

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
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {["StudyRN", "BoardJourney", "NurseGoals", "MedSurg", "NCLEX2024"].map((tag) => (
              <Button key={tag} variant="secondary" size="sm" className="text-xs h-8" data-testid={`trending-${tag}`}>
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
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </Card>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
