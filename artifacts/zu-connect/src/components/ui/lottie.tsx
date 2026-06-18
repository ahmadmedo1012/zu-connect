import { useEffect, useRef, useState, useCallback } from "react";
import LottiePlayer, { type LottieRefCurrentProps } from "lottie-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type LottieSize = "sm" | "md" | "lg" | "xl";

interface LottieAnimationProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  size?: LottieSize;
  clickToPlay?: boolean;
  onComplete?: () => void;
  fallback?: React.ReactNode;
}

const sizeClasses: Record<LottieSize, string> = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-20 h-20",
  xl: "w-32 h-32",
};

function SkeletonPlaceholder({ className, size }: { className?: string; size?: LottieSize }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted/50",
        size ? sizeClasses[size] : "w-full h-full min-h-[80px]",
        className
      )}
      aria-hidden="true"
    />
  );
}

function ErrorFallback({ className, size }: { className?: string; size?: LottieSize }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-muted/20 text-muted-foreground",
        size ? sizeClasses[size] : "w-full h-full min-h-[80px]",
        className
      )}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-1/2 h-1/2 opacity-40"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
  );
}

export function LottieAnimation({
  src,
  className,
  loop = true,
  autoplay = true,
  speed = 1,
  size,
  clickToPlay = false,
  onComplete,
  fallback,
}: LottieAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const interactionRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setAnimationData(null);

    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load animation");
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setAnimationData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const el = lottieRef.current;
    if (el?.animationItem) {
      el.setSpeed(speed);
    }
  }, [speed]);

  const handleClick = useCallback(() => {
    if (!clickToPlay || !lottieRef.current) return;
    const el = lottieRef.current;
    /* ponytail: play/pause via animationItem to avoid isPaused type issue */
    const animItem = (el as any).animationItem;
    if (!animItem) return;
    if (animItem.isPaused || interactionRef.current) {
      el.play();
      interactionRef.current = false;
    } else {
      el.pause();
      interactionRef.current = true;
    }
  }, [clickToPlay]);

  const handleComplete = useCallback(() => {
    if (clickToPlay) {
      interactionRef.current = true;
    }
    if (clickToPlay && lottieRef.current) {
      lottieRef.current.pause();
    }
    onComplete?.();
  }, [clickToPlay, onComplete]);

  // Derived class for Skeleton when no size prop is given
  const skelClass = className;

  if (loading && !animationData) {
    return <SkeletonPlaceholder className={skelClass} size={size} />;
  }

  if (error || !animationData) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <ErrorFallback className={className} size={size} />
    );
  }

  if (prefersReducedMotion) {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          size ? sizeClasses[size] : "",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <LottiePlayer
      lottieRef={lottieRef}
      animationData={animationData}
      loop={clickToPlay ? false : loop}
      autoplay={clickToPlay ? false : autoplay}
      onComplete={handleComplete}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center cursor-default",
        clickToPlay && "cursor-pointer",
        size ? sizeClasses[size] : "",
        className
      )}
      aria-hidden="true"
    />
  );
}
