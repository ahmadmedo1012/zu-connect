# Contracts: Education Visual Enhancement

## Icon Mapping Contract

The icon mapping is a TypeScript constant map used by frontend page components to display educational icons based on content category.

```typescript
// lib/icons/icon-maps.ts

interface IconMap<T extends string> {
  [key: T]: {
    icon: string;       // lucide-react icon name
    label: string;      // Arabic label for accessibility
  };
}
```

### News Category Icon Map
Maps Arabic news category strings to lucide-react icons.

- Key: News category string (أخبار, عاجل, دورات, فعاليات, أنشطة منجزة)
- Value: `{ icon: string, label: string }`
- Used by: news.tsx, home.tsx

### College Icon Map
Maps college names to subject-representative lucide-react icons.

- Key: College name string
- Value: `{ icon: string, label: string }`
- Used by: colleges.tsx

### Course Icon Map
Maps course categories/levels to appropriate icons.

- Key: Course category string
- Value: `{ icon: string, label: string }`
- Used by: courses.tsx, home.tsx

### Library Resource Icon Map
Maps library resource types to appropriate icons.

- Key: Resource type string (ملخصات, كتب PDF, بحوث, تسجيلات)
- Value: `{ icon: string, label: string }`
- Used by: library.tsx

## Animation Configuration Contract

Framer-motion variant configurations for consistent animation behavior across all pages.

```typescript
// lib/animations/variants.ts

interface AnimationVariants {
  container: Variants;  // staggerChildren container
  item: Variants;       // individual item entrance
  hover: { scale: number; transition: { type: string; stiffness: number } };
  tap: { scale: number };
}
```

### Pattern 1: Staggered List Reveal
- Container: `staggerChildren: 0.05`
- Item: `{ opacity: 0, y: 20 }` → `{ opacity: 1, y: 0 }`

### Pattern 2: Card Hover
- Scale: `1.02`
- Transition: `spring`, stiffness `300`

### Pattern 3: Button Press
- Scale: `0.98` (or `0.95` for larger buttons)

### Pattern 4: Page Transition
- Initial: `{ opacity: 0, y: 20 }`
- Animate: `{ opacity: 1, y: 0 }`
- Exit: `{ opacity: 0, y: -20 }`
- Duration: `0.2s`

## Visual Indicator Contract

News category visual indicators use badge variants with distinct accent colors.

| Category | Background | Text Color | Icon |
|----------|-----------|------------|------|
| أخبار | --primary /10 | --primary | Globe |
| عاجل | #E32652 /20 | #E32652 | AlertTriangle |
| دورات | #22c55e /20 | #22c55e | GraduationCap |
| فعاليات | #3b82f6 /20 | #3b82f6 | Calendar |
| أنشطة منجزة | #a855f7 /20 | #a855f7 | CheckCircle |

## Skeleton Variant Contract

```typescript
// components/ui/skeleton.tsx

type SkeletonVariant = "text" | "card" | "circle" | "rect";

interface SkeletonProps {
  variant: SkeletonVariant;
  className?: string;
}
```

## Empty State Component Contract

```typescript
// components/ui/empty.tsx

interface EmptyProps {
  icon?: string;        // lucide-react icon name
  title: string;        // Arabic title
  description?: string; // Arabic description
  action?: {            // Optional CTA
    label: string;
    href: string;
  };
}
```
