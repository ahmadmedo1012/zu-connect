import type { Variants, Transition } from "framer-motion"

/* ========= Shared transitions ========= */

export const spring: Transition = { type: "spring" as const, stiffness: 300, damping: 24 }
export const springBouncy: Transition = { type: "spring" as const, stiffness: 400, damping: 20 }
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

/* ========= Fade ========= */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

/* ========= Interactive ========= */

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

/* ========= Re-usable shortcut ========= */

export const anim = {
  container: containerVariants,
  item: itemVariants,
  stagger: staggerList,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleIn,
  fadeIn,
  fadeSlide,
  page: pageTransition,
  pageSlide,
  hover: hoverEffect,
  cardHover,
  tap: tapEffect,
  buttonTap,
  float: floatAnimation,
  pulse: pulseAnimation,
} as const

