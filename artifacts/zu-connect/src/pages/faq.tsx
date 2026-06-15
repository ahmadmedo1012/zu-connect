import { useListFaq } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, ShieldQuestion } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie";
import { containerVariants, itemVariants } from "@/lib/animations/variants";

export default function FAQ() {
  const prefersReducedMotion = useReducedMotion();
  const { data: faqs, isLoading } = useListFaq();

  // Group FAQs by category
  const categories = Array.from(new Set(faqs?.map(faq => faq.category) || []));

  return (
    <div className="flex flex-col gap-8 py-8 max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex flex-col gap-4">
        <LottieAnimation src="/animations/illustration/faq-help.json" className="w-[120px] h-[120px] self-start" />
        <h1 className="text-3xl md:text-4xl font-black text-foreground border-r-4 border-primary pr-4">الأسئلة الشائعة</h1>
        <p className="text-muted-foreground">إجابات لأكثر الأسئلة تداولاً بين طلاب جامعة الزاوية.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3,4,5].map(i => (
            <Skeleton key={i} variant="card" className="h-16" icon={ShieldQuestion} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col gap-8 mt-4"
        >
          {categories.map(category => (
            <motion.div key={category} variants={itemVariants} className="flex flex-col gap-4">
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
                    <AccordionTrigger className="text-right font-bold text-foreground hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4 pt-0">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
