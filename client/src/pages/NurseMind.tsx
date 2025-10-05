import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Send, Bot, User as UserIcon, Plus, BookOpen, Sparkles } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AiChatConversation, AiChatMessage, AiStudyPlan } from "@shared/schema";

export default function NurseMind() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [studyPlanOpen, setStudyPlanOpen] = useState(false);
  const [studyPlanData, setStudyPlanData] = useState({
    topic: "",
    duration: "7",
    level: "Year 1"
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = useQuery<AiChatConversation[]>({
    queryKey: ["/api/ai/conversations"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<AiChatMessage[]>({
    queryKey: ["/api/ai/conversations", selectedConversationId, "messages"],
    enabled: !!selectedConversationId,
  });

  const { data: studyPlans } = useQuery<AiStudyPlan[]>({
    queryKey: ["/api/ai/study-plans"],
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/conversations", { title: "New Chat" });
      return await response.json();
    },
    onSuccess: (data: AiChatConversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/conversations"] });
      setSelectedConversationId(data.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (msg: string) =>
      apiRequest("POST", "/api/ai/chat", {
        conversationId: selectedConversationId,
        message: msg,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/ai/conversations", selectedConversationId, "messages"],
      });
      setMessage("");
    },
  });

  const createStudyPlanMutation = useMutation({
    mutationFn: (data: typeof studyPlanData) =>
      apiRequest("POST", "/api/ai/study-plan", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/study-plans"] });
      setStudyPlanOpen(false);
      setStudyPlanData({ topic: "", duration: "7", level: "Year 1" });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedConversationId && conversations && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversationId) return;
    sendMessageMutation.mutate(message);
  };

  const handleCreateStudyPlan = () => {
    createStudyPlanMutation.mutate(studyPlanData);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="NurseMind AI" showNotifications />

      <div className="px-4 py-6 max-w-md mx-auto space-y-4">
        <Tabs defaultValue="chat">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="chat" data-testid="tab-ai-chat">
              <Bot className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="plans" data-testid="tab-study-plans">
              <BookOpen className="w-4 h-4 mr-2" />
              Study Plans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4 mt-4">
            {/* Chat Header */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => createConversationMutation.mutate()}
                className="gap-2"
                size="sm"
                data-testid="button-new-conversation"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </Button>

              {conversations && conversations.length > 0 && (
                <Select
                  value={selectedConversationId?.toString()}
                  onValueChange={(val) => setSelectedConversationId(parseInt(val))}
                >
                  <SelectTrigger className="flex-1" data-testid="select-conversation">
                    <SelectValue placeholder="Select conversation" />
                  </SelectTrigger>
                  <SelectContent>
                    {conversations.map((conv) => (
                      <SelectItem key={conv.id} value={conv.id.toString()}>
                        {conv.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Messages */}
            <Card className="p-4 h-[500px] flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={`rounded-lg p-3 max-w-[80%] ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">Welcome to NurseMind!</h3>
                      <p className="text-sm text-muted-foreground">
                        Ask me anything about nursing, NCLEX/PNLE prep, or study strategies.
                      </p>
                    </div>
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask NurseMind anything..."
                  disabled={!selectedConversationId || sendMessageMutation.isPending}
                  data-testid="input-ai-message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !selectedConversationId || sendMessageMutation.isPending}
                  size="icon"
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4 mt-4">
            <Dialog open={studyPlanOpen} onOpenChange={setStudyPlanOpen}>
              <DialogTrigger asChild>
                <Button className="w-full gap-2" data-testid="button-create-study-plan">
                  <Sparkles className="w-4 h-4" />
                  Generate Study Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create AI Study Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      value={studyPlanData.topic}
                      onChange={(e) => setStudyPlanData({ ...studyPlanData, topic: e.target.value })}
                      placeholder="e.g., Pharmacology, Med-Surg..."
                      data-testid="input-study-plan-topic"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Select
                      value={studyPlanData.duration}
                      onValueChange={(val) => setStudyPlanData({ ...studyPlanData, duration: val })}
                    >
                      <SelectTrigger id="duration" data-testid="select-study-plan-duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={studyPlanData.level}
                      onValueChange={(val) => setStudyPlanData({ ...studyPlanData, level: val })}
                    >
                      <SelectTrigger id="level" data-testid="select-study-plan-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Year 1">Year 1</SelectItem>
                        <SelectItem value="Year 2">Year 2</SelectItem>
                        <SelectItem value="Year 3">Year 3</SelectItem>
                        <SelectItem value="Year 4">Year 4</SelectItem>
                        <SelectItem value="NCLEX">NCLEX Review</SelectItem>
                        <SelectItem value="PNLE">PNLE Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleCreateStudyPlan}
                    className="w-full"
                    disabled={!studyPlanData.topic || createStudyPlanMutation.isPending}
                    data-testid="button-submit-study-plan"
                  >
                    {createStudyPlanMutation.isPending ? "Generating..." : "Generate Plan"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Study Plans List */}
            <div className="space-y-3">
              {studyPlans && studyPlans.length > 0 ? (
                studyPlans.map((plan) => (
                  <Card key={plan.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{plan.title}</h3>
                        {plan.description && (
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{plan.duration} days</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-plan-${plan.id}`}>
                      View Plan
                    </Button>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No study plans yet. Generate your first AI-powered study plan!</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
