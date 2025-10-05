import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import type { Post, User } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post & { user?: User };
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const contentPreview = post.content.length > 150 && !isExpanded 
    ? post.content.slice(0, 150) + "..." 
    : post.content;

  return (
    <Card className="p-4 space-y-3 hover-elevate" data-testid={`post-${post.id}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.user?.profileImageUrl || undefined} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {post.user?.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">
              {post.user?.firstName && post.user?.lastName 
                ? `${post.user.firstName} ${post.user.lastName}`
                : "Anonymous User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="w-8 h-8" data-testid="button-post-menu">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {contentPreview}
        </p>
        {post.content.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary font-medium hover:underline"
            data-testid="button-read-more"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post content"
          className="w-full rounded-lg max-h-96 object-cover"
          loading="lazy"
        />
      )}

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.hashtags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs font-normal"
              data-testid={`hashtag-${tag}`}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2 px-3 h-9",
            isLiked && "text-destructive"
          )}
          onClick={handleLike}
          data-testid="button-like"
        >
          <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
          <span className="text-sm font-medium">{post.likesCount + (isLiked ? 1 : 0)}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 px-3 h-9"
          onClick={() => onComment?.(post.id)}
          data-testid="button-comment"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.commentsCount}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 px-3 h-9 ml-auto"
          data-testid="button-share"
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
