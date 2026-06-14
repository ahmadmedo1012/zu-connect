import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LottieAnimation } from "@/components/ui/lottie";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function NotFound() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate={prefersReducedMotion ? undefined : "visible"}
        className="w-full max-w-md mx-4"
      >
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
              <LottieAnimation src="/animations/illustration/robot-404.json" className="w-[120px] h-[120px]" />
              <h1 className="text-2xl font-bold text-foreground">الصفحة غير موجودة</h1>
            </motion.div>

            <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
              الصفحة التي تبحث عنها غير موجودة. قد يكون الرابط غير صحيح أو تم حذف الصفحة.
            </motion.p>

            <motion.a
              variants={itemVariants}
              href="/"
              className="text-primary font-bold hover:underline"
            >
              العودة إلى الرئيسية
            </motion.a>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
