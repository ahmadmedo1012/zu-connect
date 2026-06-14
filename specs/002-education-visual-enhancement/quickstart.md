# Quickstart Validation Guide: Education Visual Enhancement

## Prerequisites

- The application must be running locally (API server + frontend dev server)
- A web browser with Chrome DevTools or Firefox Developer Tools

## Validation Scenarios

### Scenario A: Homepage Hero Enhancement
1. Open `http://localhost:5173`
2. **Verify**: Hero section loads with educational-themed decorative icons (graduation cap, book) visible alongside the campus background
3. **Verify**: Background image has a subtle parallax or slow-motion effect on scroll
4. **Verify**: All four stat cards (طلاب, كليات, أنشطة, ملفات) display animated relevant icons
5. **Verify**: Stat numbers animate from 0 to their final value on first view

### Scenario B: Educational Icon System
1. Navigate to "الكليات" (Colleges) page
2. **Verify**: Each college card displays a field-specific icon (e.g., Settings for Engineering, HeartPulse for Medicine)
3. Navigate to "الدورات التدريبية" (Courses) page
4. **Verify**: Each course card displays a relevant subject icon
5. Navigate to "المكتبة" (Library) page
6. **Verify**: Each resource type has a distinct icon (ملخصات, PDF, بحوث, تسجيلات)

### Scenario C: Page Transitions & Micro-Animations
1. Navigate between pages using the navbar
2. **Verify**: Smooth fade/slide transition plays on each route change (duration ≤ 300ms)
3. Hover over any card
4. **Verify**: Card scales up slightly (1.02x) with smooth transition (≤ 100ms response)
5. Hover over any button
6. **Verify**: Button provides visual hover feedback (glow, scale, or color shift)

### Scenario D: Loading & Empty States
1. Open Chrome DevTools → Network tab → throttle to "Slow 3G"
2. Navigate to any data-fetching page (courses, members, library, news, planner)
3. **Verify**: Educational-themed skeleton or spinner displays while loading
4. Disconnect the API server (Terminal 1: Ctrl+C)
5. Refresh any page
6. **Verify**: Error state shows with an educational icon and Arabic error message
7. Reconnect the API and navigate to a section with no content (if possible)
8. **Verify**: Empty state illustration with helpful text is shown

### Scenario E: Performance & Reduced Motion
1. Open Chrome DevTools → Performance tab
2. Scroll through the homepage with all sections
3. **Verify**: Frame rate stays at 60fps during scroll animations
4. Enable `prefers-reduced-motion: reduce` in Chrome DevTools → Rendering → Emulate CSS media feature
5. Navigate between pages
6. **Verify**: No animations play — content appears instantly with full functionality

### Scenario F: News Category Indicators
1. Navigate to "الأخبار" (News) page
2. **Verify**: Each news card shows a category-specific color/icon indicator (e.g., alert icon for عاجل, calendar for فعاليات)
3. Navigate to a detail view of a news item (click on it)
4. **Verify**: Category visual indicator appears in the detail page header

### Scenario G: AI Assistant Visual Refresh
1. Navigate to homepage
2. **Verify**: The AI assistant chat widget has updated color scheme matching the educational theme
3. Send a test message
4. **Verify**: Message bubbles are styled consistently with the educational theme
