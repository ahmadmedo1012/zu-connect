import { useListChatRooms, useListChatMessages, useSendChatMessage, getListChatMessagesQueryKey } from "@workspace/api-client-react";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Users, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Chat() {
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  
  const { data: rooms, isLoading: isLoadingRooms } = useListChatRooms();
  const { data: messages, isLoading: isLoadingMessages } = useListChatMessages(activeRoomId || 0, {
    query: {
      enabled: !!activeRoomId,
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

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] py-4">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-black text-white border-r-4 border-primary pr-4">غرف النقاش</h1>
        <p className="text-muted-foreground text-sm">تواصل مع زملائك، شارك أفكارك، وناقش المواضيع الأكاديمية.</p>
      </div>

      <div className="flex flex-col md:flex-row flex-1 bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
        {/* Sidebar */}
        <div className="w-full md:w-64 lg:w-80 border-l border-border flex flex-col bg-background/50 shrink-0">
          <div className="p-4 border-b border-border bg-card">
            <h2 className="font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              الغرف المتاحة
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {isLoadingRooms ? (
              [1,2,3,4].map(i => <div key={i} className="h-16 bg-card rounded-xl animate-pulse" />)
            ) : (
              rooms?.map(room => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 rounded-xl transition-colors text-right",
                    activeRoomId === room.id
                      ? "bg-primary text-white"
                      : "hover:bg-white/5 text-muted-foreground hover:text-white"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-sm">{room.name}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1",
                      activeRoomId === room.id ? "bg-white/20" : "bg-white/5 text-muted-foreground"
                    )}>
                      <Users className="w-3 h-3" />
                      {room.onlineCount}
                    </span>
                  </div>
                  <span className={cn(
                    "text-xs line-clamp-1",
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
                  <h3 className="font-bold text-white">
                    {rooms?.find(r => r.id === activeRoomId)?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {rooms?.find(r => r.id === activeRoomId)?.onlineCount} متصل الآن
                  </p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-background">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
                    جاري تحميل المحادثات...
                  </div>
                ) : messages?.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    لا توجد رسائل سابقة. كن أول من يرسل!
                  </div>
                ) : (
                  messages?.map(msg => (
                    <div 
                      key={msg.id} 
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
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white"
                />
                <button 
                  type="submit" 
                  disabled={!message.trim() || sendMessage.isPending}
                  className="bg-primary text-white px-4 rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5 rtl:-scale-x-100" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-2">
              <MessageCircle className="w-12 h-12 text-border" />
              <p>اختر غرفة للبدء بالنقاش</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
