import { useListColleges } from "@workspace/api-client-react";
import { Users, FileText, Calendar, Activity } from "lucide-react";

export default function Colleges() {
  const { data: colleges, isLoading } = useListColleges();

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-white border-r-4 border-primary pr-4">الكليات المعتمدة</h1>
        <p className="text-muted-foreground">تضم جامعة الزاوية 14 كلية مختلفة، تصفح خدمات كل كلية ونشاطاتها.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl h-[200px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {colleges?.map(college => (
            <div key={college.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-5 hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {college.icon}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md">
                  <Users className="w-3 h-3" />
                  {college.studentCount}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white">{college.name}</h3>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {college.hasNews && (
                  <span className="text-[10px] flex items-center gap-1 bg-background text-muted-foreground px-2 py-1 rounded font-semibold">
                    <FileText className="w-3 h-3" /> أخبار
                  </span>
                )}
                {college.hasSchedules && (
                  <span className="text-[10px] flex items-center gap-1 bg-background text-muted-foreground px-2 py-1 rounded font-semibold">
                    <Calendar className="w-3 h-3" /> جداول
                  </span>
                )}
                {college.hasActivities && (
                  <span className="text-[10px] flex items-center gap-1 bg-background text-muted-foreground px-2 py-1 rounded font-semibold">
                    <Activity className="w-3 h-3" /> نشاطات
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
