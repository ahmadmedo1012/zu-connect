# خطة تنفيذ: نظام التحكم في الوصول وعرض البيانات

**الهدف**: إبقاء الموقع متاحاً للجميع مع بيانات محدودة، وعرض البيانات الكاملة فقط بعد تسجيل الدخول (طالب/أستاذ/إدارة).

---

## المشكلة الحالية

كل endpoints الـ API مفتوحة بالكامل دون أي تحقق من الهوية. الـ auth middleware موجود (`requireRole`) لكنه لا يُستخدم في أي route. التوكن يُخزن في localStorage بعد تسجيل الدخول لكنه لا يُرسل مع الطلبات أبداً.

---

## ملخص التغييرات

### Backend (API Server)

| الخطوة | الملف | التغيير |
|--------|-------|---------|
| 1 | `middlewares/auth.ts` | إضافة middleware جديد: `optionalAuth` — يفك التوكن إن وُجد دون رفض الطلب |
| 2 | جميع `routes/*.ts` | تعديل routes الـ GET لتعيد بيانات محدودة (public) أو كاملة (authenticated) |
| 3 | `routes/news.ts` | إضافة `requireRole` على `POST /news` |
| 4 | `routes/courses.ts` | إضافة `requireRole` على `POST /courses` و `/enroll` و `/unenroll` |
| 5 | `routes/chat.ts` | إضافة `requireRole` على `POST /chat/rooms/:roomId/messages` |
| 6 | `routes/suggestions.ts` | تبقى عامة (نموذج تواصل) |
| 7 | `routes/volunteers.ts` | تبقى عامة (نموذج تطوع) |
| 8 | `routes/auth.ts` | إضافة `user + role` في response login |

### Frontend (ZU Connect SPA)

| الخطوة | الملف | التغيير |
|--------|-------|---------|
| 9 | `lib/auth/AuthContext.tsx` | **جديد**: React Context للدخول — user, role, token, login(), logout() |
| 10 | `lib/auth/setupAuth.ts` | **جديد**: ربط `setAuthTokenGetter` من custom-fetch |
| 11 | `App.tsx` | إضافة AuthProvider حول التطبيق |
| 12 | `components/layout/Topbar.tsx` | إظهار اسم المستخدم + logout بعد الدخول |
| 13 | `components/layout/Navbar.tsx` | إخفاء روابط معينة لغير المسجلين |
| 14 | جميع الـ pages | تعديل لعرض بيانات محدودة للجمهور وكاملة للأعضاء |

---

## التفاصيل الكاملة

### Phase 1 — Backend Auth Middleware

#### 1.1 إضافة `optionalAuth` middleware

في `artifacts/api-server/src/middlewares/auth.ts`:

```typescript
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next();
    return;
  }
  try {
    const payload = JSON.parse(Buffer.from(header.slice(7), "base64url").toString());
    if (payload.role && payload.id && payload.name) {
      req.user = payload;
    }
  } catch {
    // ignore invalid tokens
  }
  next();
}
```

#### 1.2 إضافة دالة `publicOrFull`

في نفس الملف أو في ملف جديد `artifacts/api-server/src/middlewares/data-access.ts`:

```typescript
import type { Request, Response } from "express";

/**
 * ترجع دالة معالجة للـ route ترسل بيانات محدودة أو كاملة
 * حسب وجود req.user
 */
export function publicOrFull<T extends Record<string, unknown>>(
  publicFields: (keyof T)[],
  fullData: T[],
  user?: Express.User,
) {
  if (user) return fullData;
  return fullData.map(item => {
    const partial: Partial<T> = {};
    for (const field of publicFields) {
      partial[field] = item[field];
    }
    return partial;
  });
}
```

لكن الطريقة الأفضل هي تعديل كل route مباشرة بدلاً من إضافة طبقة تجريد — هذا أوضح وأكثر مرونة.

#### 1.3 تعديل كل Route

**Stats** — `routes/stats.ts`:
- عام: أرقام عامة فقط (totalStudents, totalColleges)
- كامل: إضافة totalActivities, totalLibraryFiles, totalCourses, totalMembers

**News** — `routes/news.ts`:
- GET /news:
  - عام: id, title, category, date فقط (بدون body)
  - كامل: كل الحقول
- POST /news: يتطلب `requireRole("admin")`
- GET /news/:id: نفس منطق القائمة — عام: بدون body، كامل: مع body

**Courses** — `routes/courses.ts`:
- GET /courses:
  - عام: id, title, category, level, duration فقط
  - كامل: كل الحقول + enrolledCount
- POST /courses: يتطلب `requireRole("admin")`
- POST /courses/:id/enroll: يتطلب `requireRole("student", "teacher")`
- POST /courses/:id/unenroll: يتطلب `requireRole("student", "teacher")`

**Members** — `routes/members.ts`:
- عام: id, name, category فقط (بدون department, year, role التفصيلية)
- كامل: كل الحقول

**Colleges** — `routes/colleges.ts`:
- عام: id, name, icon فقط
- كامل: كل الحقول

**Library** — `routes/library.ts`:
- عام: id, title, type, rating فقط
- كامل: كل الحقول (subtitle, downloadCount, college)

**Planner** — `routes/planner.ts`:
- عام: id, title, month, icon فقط
- كامل: كل الحقول (description, date كاملة)

**Chat** — `routes/chat.ts`:
- GET /chat/rooms:
  - عام: id, name, description, icon فقط (بدون onlineCount)
  - كامل: كل الحقول
- GET /chat/rooms/:roomId/messages:
  - عام: لا يُسمح — يتطلب تسجيل الدخول
  - كامل: كل الحقول
- POST /chat/rooms/:roomId/messages: يتطلب `requireRole("student", "teacher", "admin")`

**FAQ** — `routes/faq.ts`:
- عام: كل الحقول (يبقى كما هو — معلومات عامة)
- كامل: نفس الشيء

**Suggestions** — `routes/suggestions.ts`:
- يبقى عام POST (نموذج تواصل)

**Volunteers** — `routes/volunteers.ts`:
- يبقى عام POST (نموذج تطوع)

**Leadership** — `routes/leadership.ts`:
- عام: id, name, role فقط
- كامل: نفس الشيء (لا توجد بيانات إضافية)

---

### Phase 2 — Frontend Auth System

#### 2.1 إنشاء Auth Context

ملف جديد: `artifacts/zu-connect/src/lib/auth/AuthContext.tsx`

```typescript
interface AuthUser {
  id: number;
  name: string;
  role: "student" | "teacher" | "admin";
  identifier: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string, name: string) => void;
  logout: () => void;
}
```

- يقرأ التوكن من localStorage عند التحميل الأول
- يفك التوكن (base64url) ليستخرج user info
- يوفر `login(token)` و `logout()`
- `login()` يخزن التوكن واسم المستخدم في localStorage ويحدث state
- `logout()` يمسح localStorage ويعيد تحميل الصفحة أو يعيد التوجيه للصفحة الرئيسية

#### 2.2 ربط Auth Token مع API Client

ملف جديد: `artifacts/zu-connect/src/lib/auth/setupAuth.ts`

```typescript
import { setAuthTokenGetter } from "@workspace/api-client-react";

export function setupAuthTokenGetter() {
  setAuthTokenGetter(() => localStorage.getItem("token"));
}
```

يُستدعى مرة واحدة عند بداية التطبيق (في main.tsx قبل render).

#### 2.3 تحديث App.tsx

- إضافة `AuthProvider` حول المحتوى
- استدعاء `setupAuthTokenGetter()` مرة واحدة

#### 2.4 تحديث Topbar.tsx

- إذا كان المستخدم مسجل الدخول:
  - إظهار اسم المستخدم
  - إظهار avatar/dropdown
  - زر تسجيل الخروج
- إذا غير مسجل:
  - زر "الدخول" (كما هو حالياً)

#### 2.5 تحديث Navbar.tsx

- إخفاء روابط معينة لغير المسجلين (Chat, Members, Library)
- أو إظهارها مع رسالة "سجل الدخول للمشاهدة"

#### 2.6 تحديث كل صفحة

لكل صفحة، نتحقق من `user` في AuthContext:

- **محجوبة كلياً لغير المسجلين**: Chat
- **بيانات محدودة**: News (بدون محتوى), Courses (بدون تفاصيل), Members (بدون أدوار), Library (بدون ملخصات), Planner (بدون وصف), Colleges (بدون إحصائيات)
- **عامة بالكامل**: About, FAQ, Services, Suggestions, Volunteer، Home

نمط التحديث في كل صفحة:

```tsx
import { useAuth } from "@/lib/auth/AuthContext";

export default function News() {
  const { user } = useAuth();
  const { data: news, isLoading } = useListNews(...);

  const isLimited = !user;

  // عند عرض البيانات:
  // لو isLimited: اعرض عنوان + تصنيف + تاريخ فقط
  // لو isLoggedIn: اعرض كل شيء
}
```

---

### Phase 3 — تعديل صفحة الدخول

تحديث `login.tsx`:
- بعد نجاح تسجيل الدخول، استدعاء `login(token, name)` من AuthContext
- تخزين التوكن (موجود فعلاً)
- إضافة تحويل role من response

---

## هيكل الملفات النهائي

```
artifacts/api-server/src/
├── middlewares/
│   ├── auth.ts              # MODIFY: +optionalAuth
│   └── data-access.ts       # NEW: دوال مساعدة للبيانات العامة/الكاملة (اختياري)
├── routes/
│   ├── news.ts              # MODIFY: public/private filter + requireRole on POST
│   ├── courses.ts           # MODIFY: public/private filter + requireRole on POST
│   ├── members.ts           # MODIFY: public/private filter
│   ├── colleges.ts          # MODIFY: public/private filter
│   ├── library.ts           # MODIFY: public/private filter
│   ├── planner.ts           # MODIFY: public/private filter
│   ├── chat.ts              # MODIFY: public/private filter + requireRole on POST
│   ├── stats.ts             # MODIFY: public/private filter
│   └── ...others            # MODIFY: minor or no changes

artifacts/zu-connect/src/
├── lib/
│   └── auth/
│       ├── AuthContext.tsx   # NEW: React Context + Provider
│       └── setupAuth.ts     # NEW: ربط auth token مع custom-fetch
├── App.tsx                  # MODIFY: +AuthProvider, +setupAuthTokenGetter
├── components/layout/
│   ├── Topbar.tsx           # MODIFY: user menu + logout
│   └── Navbar.tsx           # MODIFY: إخفاء روابط لغير المسجلين
├── pages/
│   ├── news.tsx             # MODIFY: تصفية البيانات حسب isLoggedIn
│   ├── courses.tsx          # MODIFY: تصفية البيانات حسب isLoggedIn
│   ├── members.tsx          # MODIFY: تصفية البيانات حسب isLoggedIn
│   ├── library.tsx          # MODIFY: تصفية البيانات حسب isLoggedIn
│   ├── planner.tsx          # MODIFY: تصفية البيانات حسب isLoggedIn
│   ├── colleges.tsx         # MODIFY: تصفية البيانات حسب isLoggedIn
│   ├── chat.tsx             # MODIFY: حجب كلي لغير المسجلين
│   ├── login.tsx            # MODIFY: استخدام AuthContext.login()
│   └── home.tsx             # MODIFY: تصفية بسيطة حسب isLoggedIn
```

---

## جدول المحتوى العام مقابل الخاص

| الصفحة | العام (زائر) | الخاص (مسجل دخول) |
|--------|-------------|-------------------|
| Home | Hero + إحصائيات محدودة + leadership + 3 عناوين أخبار + planner titles + AI chat | نفس + إحصائيات كاملة + كل الأخبار |
| News | عناوين + تواريخ + تصنيفات (بدون body) | كل المحتوى كاملاً |
| Courses | عناوين + تصنيفات + مستوى | كل التفاصيل + enrollment |
| Members | أسماء فقط | كل البيانات (department, year, role) |
| Colleges | أسماء + أيقونات | كل الإحصائيات (studentCount, schedules, files) |
| Library | عناوين + أنواع + تقييم | كل التفاصيل (subtitle, downloadCount) |
| Planner | عناوين + أشهر | كل التفاصيل (description, date) |
| Chat | رسالة "سجل الدخول للمشاركة" | الدخول الكامل + إرسال رسائل |
| FAQ | كامل | كامل |
| Suggestions | كامل (نموذج) | كامل |
| Volunteer | كامل (نموذج) | كامل |
| About | كامل | كامل |
| Services | كامل | كامل |

---

## الموافقة (Constitution Check)

1. **Arabic-First & RTL** — ✅ جميع التغييرات تدعم RTL ولا تمس المحتوى العربي
2. **Real Data Layer** — ✅ تغييرات مباشرة على API layers
3. **Authoritative Content** — ✅ لا تغيير في المحتوى نفسه، فقط التحكم في الوصول
4. **Mobile-First Delivery** — ✅ منطق الشرطية بسيط ولا يؤثر على الأداء
5. **Defensive Supply Chain** — ✅ لا إضافات جديدة — كل شيء من المكتبات الموجودة
