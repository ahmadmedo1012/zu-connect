import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { LottieAnimation } from "@/components/ui/lottie";
import { containerVariants, itemVariants } from "@/lib/animations/variants";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="flex flex-col gap-8 py-8 max-w-6xl mx-auto px-4 md:px-6 items-center justify-center min-h-[calc(100dvh-8rem)]">
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate={prefersReducedMotion ? undefined : "visible"}
        className="flex flex-col items-center text-center gap-6 max-w-md"
      >
        <motion.div variants={itemVariants}>
          <LottieAnimation src="/animations/illustration/robot-404.json" className="w-[150px] h-[150px]" />
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-4xl font-black text-foreground">الصفحة غير موجودة</motion.h1>
        <motion.p variants={itemVariants} className="text-muted-foreground">
          الصفحة التي تبحث عنها غير موجودة. قد يكون الرابط غير صحيح أو تم حذف الصفحة.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link href="/">
            <Button size="lg" className="rounded-full font-bold">
              العودة إلى الرئيسية
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
