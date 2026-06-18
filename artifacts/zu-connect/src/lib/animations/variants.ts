import type { Variants, Transition } from "framer-motion"

/* ========= Shared transitions ========= */

export const spring: Transition = { type: "spring" as const, stiffness: 300, damping: 24 }
export const springBouncy: Transition = { type: "spring" as const, stiffness: 400, damping: 20 }
export const springGentle: Transition = { type: "spring" as const, stiffness: 200, damping: 28 }
export const springStiff: Transition = { type: "spring" as const, stiffness: 600, damping: 35 }
export const smoothEase: Transition = { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }

/* ========= Container / Stagger ========= */

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
}

export const staggerList: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

export const staggerQuick: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03 },
  },
}

export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

/* ========= Item / Entry ========= */

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: spring },
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: spring },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: spring },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: spring },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: springBouncy },
}

export const fadeSlide: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

/* ========= Entrance animations ========= */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: springGentle },
}

export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 22 },
  },
}

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: spring },
}

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: spring },
}

/* ========= Page transitions ========= */

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
}

export const pageSlide: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: spring },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2, ease: "easeIn" } },
}

/**
 * Direction-aware page transition.
 * Pass direction = 1 for forward, -1 for back, 0 for no slide (fade only).
 * RTL-aware: isRtl = true inverts the x-axis offset.
 */
export function directionAwarePage(isRtl = false, direction = 0): Variants {
  const dir = isRtl ? -1 : 1
  const offset = 40 * (direction * dir)

  if (direction === 0) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
      exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
    }
  }

  return {
    initial: { opacity: 0, x: offset },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: -offset, transition: { duration: 0.2, ease: "easeIn" } },
  }
}

/* ========= Scroll-reveal helpers ========= */

export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export const scrollRevealLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export const scrollRevealRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export const scrollRevealScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

/* ========= Fade ========= */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

/* ========= Interactive (micro-interactions) ========= */

export const hoverEffect = {
  scale: 1.02,
  transition: spring,
}

export const tapEffect = {
  scale: 0.98,
}

export const cardHover = {
  scale: 1.02,
  boxShadow: "0 8px 24px hsla(210, 20%, 0%, 0.12)",
  transition: springBouncy,
}

export const buttonTap = {
  scale: 0.94,
}

export const cardLift = {
  y: -4,
  boxShadow: "0 12px 32px hsla(210, 20%, 0%, 0.15)",
  transition: spring,
}

export const buttonGlow = {
  boxShadow: "0 0 20px hsla(var(--primary), 0.4)",
  transition: spring,
}

export const iconPulse = {
  scale: 1.15,
  transition: springBouncy,
}

/* ========= Decorative ========= */

export const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  },
}

export const pulseAnimation = {
  scale: [1, 1.04, 1],
  transition: {
    duration: 2.5,
    ease: "easeInOut",
    repeat: Infinity,
  },
}

/* ========= Loading bar ========= */

export const loadingBarVariants: Variants = {
  initial: { scaleX: 0, opacity: 1 },
  animate: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
}

/* ========= Re-usable shortcut ========= */

export const anim = {
  container: containerVariants,
  item: itemVariants,
  stagger: staggerList,
  staggerQuick,
  staggerSlow,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleIn,
  scalePop,
  fadeIn,
  fadeInUp,
  fadeSlide,
  slideFromLeft,
  slideFromRight,
  page: pageTransition,
  pageSlide,
  directionAwarePage,
  scrollReveal,
  scrollRevealLeft,
  scrollRevealRight,
  scrollRevealScale,
  hover: hoverEffect,
  cardHover,
  cardLift,
  buttonGlow,
  iconPulse,
  tap: tapEffect,
  buttonTap,
  float: floatAnimation,
  pulse: pulseAnimation,
  loadingBar: loadingBarVariants,
} as const
