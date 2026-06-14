# Research: Education Visual Enhancement

**Phase**: 0 — Research & Discovery
**Feature**: specs/002-education-visual-enhancement/spec.md

## Research Tasks

### 1. Existing Visual State Analysis

**Finding**: The project already has framer-motion animations on 4 pages (home, courses, members, library) with containerVariants/itemVariants staggered reveal pattern. 7 pages lack framer-motion entirely (colleges, news, services, planner, faq, chat, login). CSS transitions are used on remaining pages.

**Decision**: Extend framer-motion to all pages for consistent animation experience. Wrap all cards, lists, and grids with the existing containerVariants/itemVariants pattern already established on the animated pages.

### 2. Icon System Analysis

**Finding**: ~45 unique lucide-react icons are used across the project. Layout components (Navbar, Topbar) use context-appropriate icons. However, content pages (colleges, courses, library) lack category-specific educational icons — using generic ones like `Users`, `FileText` instead of subject-specific ones.

**Decision**: Create a centralized icon mapping for content categories:
- Course subjects → subject-appropriate icons (Code→Monitor, Medicine→HeartPulse, Law→Scale, etc.)
- College fields → field-specific icons (Engineering→Settings, Medicine→HeartPulse, Pharmacy→Flask, etc.)
- Library types → type-specific icons (ملخصات→FileText, كتب PDF→Book, بحوث→Search, تسجيلات→Headphones)
- News categories → visual indicators (أخبار→Globe, عاجل→AlertTriangle, دورات→GraduationCap, فعاليات→Calendar, أنشطة منجزة→CheckCircle)
- Already available in existing `lucide-react` library — no new dependencies needed.

### 3. Animation Performance Analysis

**Finding**: Existing framer-motion animations use `opacity` and `y` transforms which are GPU-accelerated. All animated pages respect `prefers-reduced-motion`. No animation performance issues expected.

**Decision**: Continue using GPU-accelerated properties (opacity, transform) for all new animations. Use `will-change: transform` sparingly only on animated elements.

### 4. Loading & Empty States Analysis

**Finding**: 
- `<Skeleton>` component exists with variant support (text, card, circle, rect) but only used on 4 pages
- `<Empty>` component exists (composable with icon, title, description) but is never used anywhere
- 5 pages still use inline `animate-pulse` divs instead of Skeleton
- No loading states at all on services.tsx (static) and login.tsx (button text change only)

**Decision**: Replace all inline `animate-pulse` loading states with the `<Skeleton>` component. Add `<Empty>` component usage to pages that need empty states. Add educational icons to both components.

### 5. Hero Section Analysis

**Finding**: Single static hero section with campus background image, gradient overlays, and CTAs. No carousel, no slideshow, no animated elements.

**Decision**: Add subtle parallax effect on background image (via framer-motion useScroll + useTransform). Keep the static content overlay but add entrance animations. Add educational graphics as overlay decorative elements (graduation cap, book, atom icons as floating elements).

### 6. Design System Consistency

**Finding**: 
- Primary design tokens are well-defined in CSS custom properties
- Gold (#d4af37) and navy blue (#0b1f3f, #152a4f) used ad-hoc in leadership section
- No light theme support (dark-only)
- Colors are only in the leadership section, not part of the global design system

**Decision**: 
- Add gold (#d4af37) as `--color-accent-gold` CSS variable for consistent use
- Add navy blue variants as CSS variables
- Keep dark-only theme as-is (constitutional constraint from MasterClass design)
- All enhancements must preserve existing token system

### 7. No Custom SVG Graphics

**Finding**: No custom SVG illustrations or decorative graphics exist. Favicon.svg is the only SVG. The project relies entirely on lucide-react icons.

**Decision**: Create inline SVG components for educational-themed illustrations (hero decorations, empty state graphics, loading spinners). Keep as React components to avoid external asset loading.
