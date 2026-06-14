# Animation System Reference

> Permanent reference document for all animation decisions in the ZU Connect platform.
> Last updated: 2026-06-14

---

## Animation System Philosophy

ZU Connect is a modern university platform. Every animation must serve the user experience, never distract from it.

**Core principles:**

1. **Purpose-driven** — Every animation must have a clear reason: guide attention, communicate state, or illustrate a concept.
2. **Minimal** — Less is more. One animation per viewport at a time.
3. **Professional** — Avoid playful, cartoonish, or gaming-style motion.
4. **Educational** — Animations should feel academic, not entertaining.
5. **Performant** — Animations must never block interaction or cause layout shifts.
6. **Accessible** — Respect `prefers-reduced-motion`. Disable all non-essential motion when the user requests it.
7. **Consistent** — Use the same motion curves, durations, and patterns across the platform.

---

## Platform Animation Zones

Every location where animations may appear, organized by page/module.

### Navigation & Layout
| Zone | Location | Current Animation Type |
|---|---|---|
| Topbar | All pages | None |
| Navbar | All pages | `hover:bg-accent`, `text-foreground` transition |
| Footer | All pages | None |
| Page transitions | Router level | framer-motion `fadeIn` + `y` slide (0.2s) |

### Pages

#### Home (`/`)
| Zone | Current Type | Notes |
|---|---|---|
| Hero section | framer-motion: parallax, floating icons, entrance | Dark bg overlay — keep as-is |
| Stats cards | framer-motion: stagger, countUp, hover scale | On `bg-card` — keep as-is |
| Leadership section | framer-motion: stagger | Navy bg — keep as-is |
| News section | framer-motion: stagger, hover scale + color | On `bg-card` — keep as-is |
| AI Chat widget | framer-motion: message bubbles, send button pulse | Navy header — keep as-is |

#### About (`/about`)
| Zone | Current Type | Notes |
|---|---|---|
| Cards | framer-motion stagger | Keep as-is |
| Timeline | framer-motion stagger, timeline dot transition | Keep as-is |

#### Services (`/services`)
| Zone | Current Type | Notes |
|---|---|---|
| Service cards | framer-motion stagger, hover scale, hover color | Keep as-is |

#### Chat (`/chat`)
| Zone | Current Type | Notes |
|---|---|---|
| Room list | hover bg | Keep as-is |
| Messages | framer-motion layout AnimatePresence | Keep as-is |

#### Library (`/library`)
| Zone | Current Type | Notes |
|---|---|---|
| Cards | framer-motion stagger, hover scale + color | Keep as-is |
| **Empty state** | Lucide icon | **Can be upgraded to Lottie** |
| **Loading state** | Skeleton cards | **Can be upgraded to Lottie** |

#### Members (`/members`)
| Zone | Current Type | Notes |
|---|---|---|
| Cards | framer-motion stagger, hover scale | Keep as-is |
| **Empty state** | Lucide icon (not currently used) | **Can be upgraded to Lottie** |

#### Colleges (`/colleges`)
| Zone | Current Type | Notes |
|---|---|---|
| Cards | framer-motion stagger, hover scale | Keep as-is |
| **Loading state** | Skeleton cards | **Can be upgraded to Lottie** |

#### Login (`/login`)
| Zone | Current Type | Notes |
|---|---|---|
| Form card | framer-motion stagger, gradient bar | Keep as-is |

#### All other pages (courses, news, planner, suggestions, volunteer, faq)
| Zone | Current Type | Notes |
|---|---|---|
| Cards/items | framer-motion stagger | Keep as-is |

### UI Components
| Component | Location | Current Type |
|---|---|---|
| Skeleton | All pages | CSS `animate-pulse` (respects reduced motion) |
| Spinner | Utility | CSS `animate-spin` on Lucide `Loader2` |
| Empty | All pages | Lucide icon in `bg-muted` box |
| Button | All pages | CSS `transition-colors` |
| Dialog/Sheet/Popover | UI layer | Radix + `animate-in/out` classes |

---

## Allowed Animation Categories

| # | Category | Purpose | Max Duration | Max Size |
|---|---|---|---|---|
| 1 | **Loading State** | Indicate content is being fetched. Replaces Skeleton. | Loop (≤3s cycle) | 200×200px |
| 2 | **Empty State** | Illustrate absence of content with a meaningful visual. | Loop (gentle) | 200×200px |
| 3 | **Hero Animation** | Welcome/waiting state on high-level pages. | Loop (≤5s cycle) | 400×400px |
| 4 | **Section Illustration** | Decorative enhancement for section headers. | Loop (subtle) | 150×150px |
| 5 | **Educational Illustration** | Visual aid for learning content. | User-controlled | 300×300px |
| 6 | **Status Indicator** | Success, error, warning, empty confirmations. | 1× play (1-2s) | 80×80px |

---

## Forbidden Animation Categories

| # | Category | Reason |
|---|---|---|
| 1 | Flashy/strobing effects | Trigger seizures, unprofessional |
| 2 | Excessive rotation/spinning | Motion sickness, visual noise |
| 3 | Gaming-style (confetti, explosions, particles) | Unacademic, distracting |
| 4 | Full-screen animated backgrounds | Performance cost, accessibility violation |
| 5 | Autoplay video backgrounds | Data usage, distraction |
| 6 | Bouncing/jiggling UI elements | Unprofessional |
| 7 | Multi-animation per viewport | Overload, confusion |
| 8 | Commercial-style motion graphics | Wrong tone for university platform |

---

## Placement Matrix

| Section | Priority | Allowed Types | Max Count | Recommended Size | Mobile Behavior | Performance |
|---|---|---|---|---|---|---|
| Library — Empty | High | Empty State | 1 | 180×180px | Scale 80% | Low cost |
| Library — Loading | Medium | Loading State | 1 | 160×160px | Scale 80% | Low cost |
| Members — Empty | High | Empty State | 1 | 180×180px | Scale 80% | Low cost |
| Colleges — Loading | Medium | Loading State | 1 | 160×160px | Scale 80% | Low cost |
| Home — Hero | Low | Hero Animation | 1 | 300×300px (if added) | Hide on mobile | Moderate |
| About — Header | Low | Section Illustration | 1 | 150×150px (if added) | Hide on mobile | Low cost |
| Login — Card | Low | Educational Illustration | 1 | 200×200px (if added) | Move above form | Low cost |

### Mobile Rules
- Animations must scale down proportionally (max 80% of original size).
- Animations must not increase CLS (layout shift).
- Animations should be paused when not in viewport using `IntersectionObserver`.
- On devices with `prefers-reduced-motion: reduce`, animations must be replaced with static first frame or hidden.

### Performance Notes
- Use `lottie-web`'s `renderer: 'svg'` for crisp output at any scale.
- Keep JSON file sizes under 100KB where possible.
- Preload critical animations; lazy-load the rest.
- Use `segments` to play only relevant portions of long animations.

---

## Animation Evaluation Framework

Every animation must be scored before approval.

| Criterion | Weight | Score 1 (Poor) | Score 3 (Good) | Score 5 (Excellent) |
|---|---|---|---|---|
| Visual Relevance | 25% | Unrelated to content | Somewhat related | Directly illustrates the section's purpose |
| Educational Relevance | 20% | Purely decorative | Supports but not essential | Teaches or clarifies a concept |
| UX Value | 20% | Adds no utility | Mildly helpful | Replaces text explanation, guides user |
| Performance Cost | 15% | >200KB, heavy rendering | 50-100KB, reasonable | <50KB, negligible impact |
| Mobile Compatibility | 10% | Breaks layout, lags | Scales adequately | Fluid at any size, pauses offscreen |
| Design Consistency | 10% | Different art style, wrong colors | Matches palette partially | Feels native to the platform |

**Scoring:**
- **≥ 4.0**: Approved — proceed to placement
- **3.0 – 3.9**: Conditional — needs refinement
- **< 3.0**: Rejected

---

## Animation Registry

Every animation added to the platform is recorded here.

### Registered Animations

| File | Description | Classification | Placement | Alternative | Score | Status |
|---|---|---|---|---|---|---|
| `book-flip.json` | Open book with page flipping | Empty State | Library — Empty state | Courses — loading | 4.6 | ✅ Approved |
| `student-illustration.json` | Student with books and academic elements | Empty State | Members — Empty state | Login — illustration | 4.2 | ✅ Approved |
| `loading-main.json` | Circular loading indicator with motion | Loading State | Colleges — Loading state | Global page loading | 4.0 | ✅ Approved |

### Pending Review

No pending animations.

### Rejected Animations

No rejected animations.

---

## File Storage Convention

All Lottie JSON files are stored in:
```
public/animations/<category>/<name>.json
```

Categories:
- `loading/` — Loading state animations
- `empty/` — Empty state illustrations
- `illustration/` — Feature/educational illustrations
- `hero/` — Hero section animations

---

## Technical Implementation

### Lottie Player
- Library: `lottie-react` (wrapper around `lottie-web`)
- Component: `@/components/ui/lottie` (`<LottieAnimation>`)
- Player API: `lottie-react`'s `<Player>` with `renderer="svg"`

### LottieAnimation Component Props
```tsx
interface LottieAnimationProps {
  src: string;               // Path to JSON file in public/
  className?: string;        // Tailwind classes for sizing/positioning
  loop?: boolean;            // Default: true
  autoplay?: boolean;        // Default: true
  speed?: number;            // Default: 1
  segments?: [number, number]; // Play specific frame range
  onComplete?: () => void;   // Callback when animation ends (non-looping)
}
```

### Reduced Motion Handling
When `prefers-reduced-motion: reduce`:
- Loop animations → show only first frame (static)
- Non-loop animations → play once then freeze
- Use the existing `useReducedMotion()` hook

### Sizing & Containment
- Wrap in a container with explicit width/height to prevent layout shift
- Use `className="w-[180px] h-[180px]"` pattern (no arbitrary Tailwind)
- SVG renderer ensures crisp output at any scale

---

## Future Workflow

When a new animation JSON file is provided:

1. Read this reference document.
2. Analyze the animation: content, style, duration, size.
3. Score using the **Animation Evaluation Framework**.
4. Determine optimal placement using the **Placement Matrix**.
5. Check for conflicts (multiple animations in same viewport).
6. Decide: Approve / Conditional / Reject.
7. If approved:
   - Copy file to `public/animations/<category>/`
   - Register in the **Animation Registry**.
   - Implement using `<LottieAnimation>` component.
8. If conditional: document required changes and wait for revision.
9. If rejected: document reason and archive.

### Rejection Triggers
- File size > 300KB
- Duration > 10 seconds (unless looping)
- Contains strobing, flashing, or seizure-inducing content
- Art style conflicts with platform design (navy + gold + red palette)
- Cannot be made accessible (no static fallback possible)
- More than 2 animations per page

---

## Design Tokens

### Motion Curves
| Token | Value | When to use |
|---|---|---|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard UI transitions |
| `--ease-spring` | spring(1, 100, 10, 0) | Hover/tap feedback |
| `--ease-emphasized` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Entrance animations |

### Durations
| Token | Value | When to use |
|---|---|---|
| `--duration-fast` | 150ms | Hover states, color transitions |
| `--duration-normal` | 300ms | Page transitions, dialog open/close |
| `--duration-slow` | 500ms | Entrance animations |

### Color Palette (for animations)
| Token | Hex | Usage |
|---|---|---|
| Primary | `#E32652` | Brand elements, CTAs |
| Accent Gold | `#d4af37` | Highlight, premium sections |
| Navy Deep | `#0b1f3f` | Dark sections, headers |
| Navy Card | `#152a4f` | Card backgrounds in dark sections |
| Foreground | `hsl(240 10% 4%)` | Text color (light mode) |
| Background | `hsl(0 0% 97%)` | Page background (light mode) |
