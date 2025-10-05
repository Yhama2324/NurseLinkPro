import { useState } from "react";
import { Image, Hash, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ObjectUploader } from "./ObjectUploader";
import { apiRequest } from "@/lib/queryClient";
import type { UploadResult } from "@uppy/core";

interface CreatePostDialogProps {
  onSubmit?: (content: string, hashtags: string[], imageUrl?: string) => void;
  trigger?: React.ReactNode;
}

export default function CreatePostDialog({ onSubmit, trigger }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleAddHashtag = () => {
    if (hashtag && !hashtags.includes(hashtag)) {
      setHashtags([...hashtags, hashtag.replace(/^#/, "")]);
      setHashtag("");
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleGetUploadParams = async () => {
    const response = await apiRequest("POST", "/api/objects/upload");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful[0]) {
      const uploadURL = result.successful[0].uploadURL;
      const response = await apiRequest("PUT", "/api/post-images", { imageURL: uploadURL });
      const data = await response.json();
      setImageUrl(data.objectPath);
    }
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit?.(content, hashtags, imageUrl);
      setContent("");
      setHashtags([]);
      setImageUrl("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full" data-testid="button-create-post">
            Create Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-32 resize-none"
            data-testid="input-post-content"
          />

          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  #{tag}
                  <button
                    onClick={() => handleRemoveHashtag(tag)}
                    className="hover:bg-background/50 rounded-sm p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Add hashtag (e.g., StudyRN)"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddHashtag())}
              data-testid="input-hashtag"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddHashtag}
              data-testid="button-add-hashtag"
            >
              <Hash className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <ObjectUploader
              maxNumberOfFiles={1}
              maxFileSize={10485760}
              onGetUploadParameters={handleGetUploadParams}
              onComplete={handleUploadComplete}
              buttonClassName="gap-2"
            >
              <Image className="w-4 h-4" />
              Add Image
            </ObjectUploader>
            {imageUrl && (
              <Badge variant="secondary" className="gap-1">
                Image uploaded
                <button onClick={() => setImageUrl("")}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!content.trim()}
            data-testid="button-submit-post"
          >
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
