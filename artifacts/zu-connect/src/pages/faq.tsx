import { useListFaq } from "@workspace/api-client-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  const { data: faqs, isLoading } = useListFaq();

  // Group FAQs by category
  const categories = Array.from(new Set(faqs?.map(faq => faq.category) || []));

  return (
    <div className="flex flex-col gap-8 py-8 max-w-3xl mx-auto">
      <div className="flex flex-col gap-4 text-center items-center">
        <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-2">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white">الأسئلة الشائعة</h1>
        <p className="text-muted-foreground">إجابات لأكثر الأسئلة تداولاً بين طلاب جامعة الزاوية.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-card border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8 mt-4">
          {categories.map(category => (
            <div key={category} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-primary border-b border-border/50 pb-2 inline-block w-fit">
                {category}
              </h2>
              <Accordion type="single" collapsible className="w-full flex flex-col gap-3">
                {faqs?.filter(faq => faq.category === category).map((faq, index) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={`item-${faq.id}`}
                    className="bg-card border border-border rounded-xl px-4 data-[state=open]:border-primary/50 transition-colors"
                  >
                    <AccordionTrigger className="text-right font-bold text-white hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4 pt-0">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
