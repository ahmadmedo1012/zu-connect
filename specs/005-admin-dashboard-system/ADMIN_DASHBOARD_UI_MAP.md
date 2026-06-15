# ADMIN DASHBOARD UI MAP

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Topbar (sticky)                                         │
│  [☰ toggle] [ZU Connect Admin] [🔔] [👤 Admin Name ▼]   │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │  Main Content Area                            │
│ (w-64)   │                                               │
│          │  ┌─────────────────────────────────────────┐  │
│ ● لوحة   │  │  Page-specific content                  │  │
│   التحكم  │  │                                         │  │
│ ● المستخدم│  │  Summary cards, tables, forms,          │  │
│ ● الأدوار│  │  charts, feeds, settings panels          │  │
│ ● المباشر │  │                                         │  │
│ ● المراجعة│  └─────────────────────────────────────────┘  │
│ ● الشكاوى │                                               │
│ ● الإحالات│                                               │
│ ● النقاط  │                                               │
│ ● الإعلانات│                                               │
│ ● الملفات │                                               │
│ ● النشاط  │                                               │
│ ● الإحصائيات│                                               │
│ ● التكاملات│                                               │
│ ● الإعدادات│                                               │
│ ● السجل   │                                               │
├──────────┴──────────────────────────────────────────────┤
│  Footer (minimal: version, connection status)            │
└─────────────────────────────────────────────────────────┘
```

## Sidebar Navigation Items

| # | Arabic Label | Icon | Route | Permission |
|---|-------------|------|-------|------------|
| 1 | لوحة التحكم | LayoutDashboard | /admin | admin.view |
| 2 | المستخدمون | Users | /admin/users | admin.users |
| 3 | الأدوار والصلاحيات | Shield | /admin/roles | admin.roles |
| 4 | الأحداث المباشرة | Radio | /admin/live | admin.live |
| 5 | قائمة المراجعة | ClipboardCheck | /admin/moderation | admin.moderation |
| 6 | الشكاوى والاقتراحات | MessageSquare | /admin/complaints | admin.complaints |
| 7 | الإحالات | Gift | /admin/referrals | admin.referrals |
| 8 | النقاط والتحديات | Trophy | /admin/gamification | admin.gamification |
| 9 | الإعلانات | Megaphone | /admin/announcements | admin.announcements |
| 10 | الملفات | File | /admin/files | admin.files |
| 11 | سجل النشاط | Activity | /admin/activity | admin.activity |
| 12 | الإحصائيات | BarChart | /admin/analytics | admin.analytics |
| 13 | التكاملات | Puzzle | /admin/integrations | admin.integrations |
| 14 | إعدادات تلغرام | Send | /admin/telegram | admin.telegram |
| 15 | إعدادات النظام | Settings | /admin/settings | admin.settings |
| 16 | سجل التدقيق | ScrollText | /admin/audit | admin.audit |

## Page Blueprints

### 1. Dashboard Overview (/admin)

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 👥 المستخدمون│ 🔗 الإحالات  │ 📋 الشكاوى   │ 📰 المقالات  │
│    1,234     │    567       │     89       │     45       │
│   ▲ +12%     │   ▲ +8%      │   ▼ -3%      │   ▲ +5%      │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌─────────────────────────────┬─────────────────────────────┐
│  النشاط الأخير (Live Feed)  │  الإحالات (Chart)           │
│  • تسجيل دخول جديد - أحمد   │  ┌─────────────────────┐    │
│  • إحالة جديدة - محمد      │  │   Rechart Line       │    │
│  • شكوى جديدة - سارة       │  │                      │    │
│  • تم نشر إعلان            │  └─────────────────────┘    │
└─────────────────────────────┴─────────────────────────────┘
```

### 2. Users (/admin/users)

```
┌─────────────────────────────────────────────────────────┐
│  [بحث...]         [الدور: الكل ▼]     [الحالة: الكل ▼]   │
├─────────────────────────────────────────────────────────┤
│  ┌───┬──────┬──────────┬───────┬──────┬──────┬──────┐  │
│  │ # │ الاسم│ المعرف   │ النقاط│ الدور│ الحالة│ تاريخ │  │
│  ├───┼──────┼──────────┼───────┼──────┼──────┼──────┤  │
│  │ 1 │ أحمد │ 2021001  │ 150   │ طالب │ نشط  │ 1/1  │  │
│  │ 2 │ محمد │ teacher  │ 0     │ مدرس │ نشط  │ 1/1  │  │
│  │...│      │          │       │      │      │      │  │
│  └───┴──────┴──────────┴───────┴──────┴──────┴──────┘  │
│  [< السابق]  الصفحة 1 من 10  [التالي >]                  │
└─────────────────────────────────────────────────────────┘
```

### 3. Live Events (/admin/live)

```
┌─────────────────────────────────────────────────────────┐
│  [🟢 متصل]  الأحداث المباشرة                    [مسح]   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐       │
│  │  🔵 15:30  تسجيل دخول - أحمد الطالب          │       │
│  │  🟣 15:28  إحالة جديدة - محمد → سارة         │       │
│  │  🟡 15:25  شكوى جديدة - نوع: أكاديمي          │       │
│  │  🟢 15:20  تسجيل في دورة - تحليل البيانات     │       │
│  │  🔴 15:15  خطأ في النظام - Database timeout   │       │
│  │  🔵 15:10  تسجيل دخول - فاطمة                 │       │
│  │  ...                                          │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### 4. Moderation Queue (/admin/moderation)

```
┌─────────────────────────────────────────────────────────┐
│  [الكل]  [قيد المراجعة]  [تم الحل]  [مرفوض]            │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐       │
│  │  📝 شكوى: مشكلة في التسجيل                   │       │
│  │  أحمد | أكاديمي | منذ ساعتين                  │       │
│  │  [🔍 عرض] [✅ حل] [📌 تصعيد] [❌ رفض]       │       │
│  ├──────────────────────────────────────────────┤       │
│  │  💡 اقتراح: إضافة نادي رياضي                  │       │
│  │  سارة | أنشطة | منذ 5 ساعات                   │       │
│  │  [🔍 عرض] [✅ حل] [📌 تصعيد] [❌ رفض]       │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### 5. Analytics (/admin/analytics)

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ إجمالي المستخدم│ المستخدمون  │ إجمالي الإحالات│ معدل الإحالات │
│    1,234     │    456       │     567      │    45%       │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌──────────────┬──────────────┐
│  المستخدمون  │  الإحالات    │
│  (Bar Chart) │  (Line Chart)│
└──────────────┴──────────────┘
```

## Responsive Behavior

| Breakpoint | Sidebar | Cards | Tables |
|------------|---------|-------|--------|
| > 1024px | Fixed sidebar (w-64) | 4-column grid | Full table |
| 768-1024px | Collapsible (icon mode) | 2-column grid | Scrollable table |
| 480-768px | Sheet overlay | 2-column grid | Horizontal scroll |
| < 480px | Sheet overlay | 1-column stack | Horizontal scroll + card view |

## Color Scheme

Admin uses the same CSS variable system as the public app:
- Sidebar: `--sidebar-background`, `--sidebar-foreground`, `--sidebar-accent`
- Active nav item: `bg-sidebar-accent text-sidebar-accent-foreground`
- Cards: `bg-card text-card-foreground`
- Status badges: `default` (gray), `secondary` (blue), `destructive` (red), `outline` (border)

## Component Reuse

| Admin Component | Reuses |
|----------------|--------|
| DataTable | components/ui/table.tsx + components/ui/pagination.tsx |
| FilterBar | components/ui/select.tsx + components/ui/input.tsx |
| MetricCard | components/ui/card.tsx |
| StatusBadge | components/ui/badge.tsx |
| ActionDialog | components/ui/dialog.tsx |
| SettingsForm | components/ui/form.tsx + components/ui/input.tsx + components/ui/switch.tsx |
| LiveFeed | components/ui/scroll-area.tsx |
| Charts | components/ui/chart.tsx (Recharts) |
| SidebarNav | components/ui/sidebar.tsx |
| Tabs | components/ui/tabs.tsx |
| Loading | components/ui/skeleton.tsx |
| Empty | components/ui/empty.tsx |
