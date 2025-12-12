import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2, Sparkles, Download, Bot, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: suggestionsData } = useQuery<{ suggestions: string[] }>({
    queryKey: ["/api/ai/suggestions"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/ai/chat", { message });
      return res.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(input);
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch("/api/recommendations/pdf", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ERP_Recommendations.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({ title: "PDF downloaded successfully!" });
    } catch {
      toast({
        title: "Download failed",
        description: "Could not download the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold" data-testid="text-page-title">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">Ask questions about your business data</p>
          </div>
        </div>
        <Button onClick={handleDownloadPDF} variant="outline" data-testid="button-download-recommendations">
          <Download className="h-4 w-4 mr-2" />
          Download Recommendations PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4" />
                Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 p-4 pt-0">
              <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">Welcome! I'm your AI assistant.</p>
                      <p className="text-sm mt-1">Ask me anything about your sales, purchases, stock, or finances.</p>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="flex-shrink-0 flex gap-2 mt-4 pt-4 border-t">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={chatMutation.isPending}
                  data-testid="input-chat-message"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim() || chatMutation.isPending}
                  data-testid="button-send-message"
                >
                  {chatMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestionsData?.suggestions?.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left text-sm p-2 rounded-md bg-muted hover-elevate active-elevate-2 transition-colors"
                  data-testid={`button-suggestion-${idx}`}
                >
                  {suggestion}
                </button>
              )) || (
                <p className="text-sm text-muted-foreground">Loading suggestions...</p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Try asking about:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Total sales or purchases</li>
                <li>Top customers or suppliers</li>
                <li>Stock and inventory levels</li>
                <li>Today's activity</li>
                <li>Payment summaries</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
