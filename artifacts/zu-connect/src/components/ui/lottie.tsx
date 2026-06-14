import { useEffect, useRef, useState } from "react";
import LottiePlayer, { type LottieRefCurrentProps } from "lottie-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface LottieAnimationProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  onComplete?: () => void;
}

export function LottieAnimation({
  src,
  className,
  loop = true,
  autoplay = true,
  speed = 1,
  onComplete,
}: LottieAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load animation");
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => { cancelled = true; };
  }, [src]);

  useEffect(() => {
    const el = lottieRef.current;
    if (el?.animationItem) {
      el.setSpeed(speed);
    }
  }, [speed]);

  if (error || !animationData) {
    return <div className={cn("flex items-center justify-center", className)} />;
  }

  if (prefersReducedMotion) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <LottiePlayer
      lottieRef={lottieRef}
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      onComplete={onComplete}
      className={cn("flex items-center justify-center", className)}
      aria-hidden="true"
    />
  );
}
