# Data Model: Education Visual Enhancement

## Overview

This feature does not introduce new database entities. It adds frontend-only configuration maps that define visual associations between content categories and their educational iconography.

## Entities

### Icon Mapping

A configuration map that associates content categories with educational icons.

| Field | Type | Description |
|-------|------|-------------|
| contentCategory | string | The category identifier (e.g., "news:أخبار", "college:engineering", "course:coding") |
| iconName | string | The lucide-react icon name to display |
| colorScheme | string | Optional accent color identifier for category visual distinction |

### Animation Configuration

Centralized animation timing and variant definitions.

| Field | Type | Description |
|-------|------|-------------|
| animationType | string | Animation pattern identifier (stagger, fade, slide, scale) |
| duration | number | Animation duration in seconds |
| easing | string | CSS easing function |
| staggerDelay | number (optional) | Delay between staggered items in seconds |

## State Transitions

### Page Load Flow
```
User navigates to page
  → Page transition animation plays (AnimatePresence)
  → Data fetch begins
  → Skeleton loading state displays (with educational icon)
  → Data received
  → Content renders with staggered item animations
  → Stats counters animate from 0 to final value
```

### Hover/Click Interaction Flow
```
User hovers over card/button
  → Scale/glow animation plays (100ms response)
  → Visual feedback shown
User clicks button
  → Press animation plays (50ms)
  → Action executes
  → Success/error feedback shown
```

### Error/Empty State Flow
```
Data fetch fails
  → Error state with educational icon and Arabic message
  → Retry option displayed
Data returns empty
  → Empty state illustration with helpful Arabic text
  → Suggested next action shown
```

## Icon Category Mapping

### News Categories
| Category | Icon | Color |
|----------|------|-------|
| أخبار | Globe | Default |
| عاجل | AlertTriangle | #E32652 (primary red) |
| دورات | GraduationCap | #22c55e (green) |
| فعاليات | Calendar | #3b82f6 (blue) |
| أنشطة منجزة | CheckCircle | #a855f7 (purple) |

### College Fields
| College | Icon |
|---------|------|
| كلية الهندسة والتقنية | Settings |
| كلية الطب البشري | HeartPulse |
| كلية الصيدلة | FlaskConical |
| كلية القانون والعلوم السياسية | Scale |
| كلية الاقتصاد والأعمال | BarChart |
| كلية الحاسوب والمعلوماتية | Monitor |
| كلية العلوم الأساسية | Atom |
| كلية الآداب والإنسانيات | BookOpen |
| كلية التربية | GraduationCap |
| كلية الإعلام والاتصال | Radio |
| كلية الزراعة | Sprout |
| المعهد العالي للتقنية | Wrench |

### Library Resource Types
| Type | Icon |
|------|------|
| ملخصات | FileText |
| كتب PDF | Book |
| بحوث | Search |
| تسجيلات | Headphones |

### Course Levels
| Level | Icon |
|-------|------|
| مبتدئ | Star |
| متوسط | BarChart3 |
| متقدم | Trophy |
