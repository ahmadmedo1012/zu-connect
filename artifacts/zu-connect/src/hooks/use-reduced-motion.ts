import * as React from "react"

const ReducedMotionCtx = React.createContext(false)

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setPrefersReducedMotion(mql.matches)
    mql.addEventListener("change", onChange)
    setPrefersReducedMotion(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return React.createElement(
    ReducedMotionCtx.Provider,
    { value: prefersReducedMotion },
    children,
  )
}

export function useReducedMotion() {
  const ctx = React.useContext(ReducedMotionCtx)
  // If provider is missing, fall back to individual media query
  if (ctx === undefined) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
      const onChange = () => setPrefersReducedMotion(mql.matches)
      mql.addEventListener("change", onChange)
      setPrefersReducedMotion(mql.matches)
      return () => mql.removeEventListener("change", onChange)
    }, [])
    return prefersReducedMotion
  }
  return ctx
}
