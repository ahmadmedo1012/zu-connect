import { useListMembers } from "@workspace/api-client-react";
import { useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["الكل", "القيادة التنفيذية", "رؤساء اللجان", "ممثلو الكليات"];

export default function Members() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const { data: members, isLoading } = useListMembers(
    activeCategory !== "الكل" ? { category: activeCategory } : {}
  );

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-white">أعضاء الاتحاد</h1>
        <p className="text-muted-foreground">تعرف على زملائك الممثلين في الاتحاد العام للطلبة وممثلي الكليات المختلفة.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
              activeCategory === cat 
                ? "bg-primary text-white border-primary" 
                : "bg-card text-muted-foreground border-border hover:border-muted-foreground hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl h-[300px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members?.map(member => (
            <div key={member.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:-translate-y-1 transition-transform group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/80 to-[#0b1f3f] p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl font-black text-white">
                  {member.initials}
                </div>
              </div>
              
              <div className="flex flex-col gap-1 w-full">
                <h3 className="font-bold text-lg text-white leading-tight">{member.name}</h3>
                <p className="text-sm font-semibold text-primary">{member.role}</p>
                <div className="text-xs text-muted-foreground mt-1 flex flex-col">
                  <span>{member.department}</span>
                  <span>{member.year}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-2 w-full pt-4 border-t border-border/50">
                <button className="p-2 rounded-full bg-background hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full bg-background hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full bg-background hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
