import { useListChatRooms, useListChatMessages, useSendChatMessage, getListChatMessagesQueryKey } from "@workspace/api-client-react";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Send, Users, MessageCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LottieAnimation } from "@/components/ui/lottie";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthContext";
import { Link } from "wouter";
import { containerVariants, itemVariants } from "@/lib/animations/variants";

export default function Chat() {
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  
  const { data: rooms, isLoading: isLoadingRooms } = useListChatRooms();
  const { data: messages, isLoading: isLoadingMessages } = useListChatMessages(activeRoomId || 0, {
    query: {
      enabled: !!activeRoomId && !!user,
      queryKey: getListChatMessagesQueryKey(activeRoomId || 0)
    }
  });

  const queryClient = useQueryClient();
  const sendMessage = useSendChatMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rooms && rooms.length > 0 && !activeRoomId) {
      setActiveRoomId(rooms[0].id);
    }
  }, [rooms, activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeRoomId) return;
    
    const sender = localStorage.getItem("username") || "زائر";
    
    sendMessage.mutate({
      roomId: activeRoomId,
      data: { sender, message: message.trim(), isMe: true }
    }, {
      onSuccess: () => {
        setMessage("");
        queryClient.invalidateQueries({ queryKey: getListChatMessagesQueryKey(activeRoomId) });
      }
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-[calc(100dvh-8rem)] py-4 max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-full gap-8">
          <Lock className="w-20 h-20 text-muted-foreground" />
          <div className="text-center max-w-md flex flex-col gap-4">
            <h2 className="text-2xl font-black text-foreground">غرف النقاش</h2>
            <p className="text-muted-foreground">هذه الميزة متاحة للأعضاء المسجلين فقط. سجل الدخول للمشاركة في النقاشات والتواصل مع زملائك.</p>
            <Link href="/login">
              <Button size="lg" className="rounded-full font-bold">
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-8rem)] py-4 max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-4 mb-2">
          <LottieAnimation src="/animations/illustration/study-discussion.json" className="w-[80px] h-[80px] md:w-[130px] md:h-[130px]" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground border-r-4 border-primary pr-4">غرف النقاش</h1>
            <p className="text-muted-foreground text-sm mt-1">تواصل مع زملائك، شارك أفكارك، وناقش المواضيع الأكاديمية.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
        {/* Sidebar */}
        <div className="w-full md:w-64 lg:w-80 border-l border-border flex flex-col bg-background/50 shrink-0">
          <div className="p-4 border-b border-border bg-card">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              الغرف المتاحة
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {isLoadingRooms ? (
              [1,2,3,4].map(i => <Skeleton key={i} variant="card" className="h-16" icon={MessageCircle} />)
            ) : (
              rooms?.map(room => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 rounded-xl transition-colors text-right",
                    activeRoomId === room.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-sm">{room.name}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1",
                      activeRoomId === room.id ? "bg-primary-foreground/20" : "bg-accent text-muted-foreground"
                    )}>
                      <Users className="w-3 h-3" />
                      {room.onlineCount}
                    </span>
                  </div>
                  <span className={cn(
                    "text-xs line-clamp-1 block",
                    activeRoomId === room.id ? "text-white/80" : "text-muted-foreground/70"
                  )}>{room.description}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-[50vh] md:h-auto">
          {activeRoomId ? (
            <>
              <div className="p-4 border-b border-border bg-card/80 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground">
                    {rooms?.find(r => r.id === activeRoomId)?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {rooms?.find(r => r.id === activeRoomId)?.onlineCount} متصل الآن
                  </p>
                </div>
              </div>
              
              <motion.div
                variants={containerVariants}
                initial={prefersReducedMotion ? undefined : "hidden"}
                whileInView={prefersReducedMotion ? undefined : "visible"}
                viewport={{ once: true }}
                role="log"
                aria-live="polite"
                className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-background min-h-0"
              >
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <LottieAnimation src="/animations/loading/loading-main.json" className="w-[160px] h-[160px]" speed={0.8} />
                  </div>
                ) : messages?.length === 0 ? (
                  <motion.div variants={itemVariants} className="flex items-center justify-center h-full">
                    <Empty icon={MessageCircle} title="لا توجد رسائل" description="لا توجد رسائل سابقة. كن أول من يرسل!" />
                  </motion.div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {messages?.map(msg => (
                      <motion.div
                        key={msg.id}
                        variants={itemVariants}
                        layout
                        className={cn(
                          "flex flex-col max-w-[80%] md:max-w-[70%]",
                          msg.isMe ? "self-end items-end" : "self-start items-start"
                        )}
                      >
                        <span className="text-[10px] text-muted-foreground mb-1 px-1">{msg.sender}</span>
                        <div className={cn(
                          "px-4 py-2 rounded-2xl text-sm leading-relaxed",
                          msg.isMe
                            ? "bg-primary text-white rounded-tl-sm"
                            : "bg-card border border-border text-foreground rounded-tr-sm"
                        )}>
                          {msg.message}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.createdAt}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </motion.div>

              <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex gap-2 items-center">
                <LottieAnimation src="/animations/illustration/typing-dots.json" className="w-8 h-8 opacity-50 shrink-0" />
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
                <Button 
                  type="submit" 
                  aria-label="إرسال"
                  disabled={!message.trim() || sendMessage.isPending}
                  size="icon"
                  className="rounded-xl shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <LottieAnimation src="/animations/illustration/chat-bubbles.json" className="w-[120px] h-[120px]" />
              <p className="text-muted-foreground text-sm">اختر غرفة من القائمة الجانبية للبدء</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
