# PROJECT_UNDERSTANDING.md

## ZU Connect — Digital Platform for the General Union of Zawia University Students

**Document purpose:** This document is a complete architectural and content understanding of the “ZU Connect” project, produced in the planning/analysis phase. No implementation, code, components, schemas, or APIs have been created. This document is intended to be sufficient on its own for any developer or AI agent to understand the entire project’s intent, structure, content, branding, and open questions, without needing to re-read the source files (a working HTML/CSS/JS prototype, a 15-page organizational PDF deck, and two image assets).

-----

## 1. Executive Summary

“ZU Connect” (Arabic subtitle: **اتحاد طلبة جامعة الزاوية** — “Union of Zawia University Students”) is a planned Arabic-language, right-to-left (RTL), student-facing web platform for the **General Union of Zawia University Students** (الاتحاد العام لطلبة جامعة الزاوية), a student governance body representing students across **14 faculties** of Zawia University in Libya.

The project currently exists as a **single-file HTML/CSS/JS interactive prototype** (`zu_connect_v2.html`) that represents the desired final visual design, layout, navigation, and interaction patterns. This prototype is fully functional in-browser using `localStorage` for persistence (chat history, course enrollments, theme preference, simulated login username) and contains placeholder/demo content for nearly every module (news, courses, library resources, chat messages, FAQ, member directory, college list).

Alongside the prototype, a **15-slide PDF presentation** (“الاتحاد العام لطلبة جامعة الزاوية — دليل الهيكلية الإدارية، رؤساء الاتحادات، وممثلي الكليات الـ 14” / “General Union of Zawia University Students — Guide to the Administrative Structure, Union Heads, and Representatives of the 14 Faculties”) documents the **real organizational structure** of the union: its mission/strategic pillars, its organizational chart (General Union → 3 Executive Office groups → 14 Faculty Unions), its President (named: محمد وسام الفراح), its code of ethics and strategic goals, and a navy/gold visual identity that the prototype explicitly borrows for its “Leadership Board” section.

Two image assets supplement this: a photograph of the Zawia University main campus (yellow-domed building, matching the PDF’s title-slide background) and an alternate 2015-era “U.Z.S.U” union emblem (graduation cap inside a laurel wreath).

The platform’s purpose is to unify: union leadership transparency, faculty/college directories, news & activity feeds, a training-course catalog with enrollment, an activity planner, per-faculty discussion/chat rooms, a digital library of academic resources, a rule-based “AI assistant,” a suggestions/complaints channel, a volunteer program, an FAQ, and a login system with three roles (student, teacher, admin) — currently all simulated client-side.

The project is in the **planning/architecture phase**. Future implementation will be version-controlled on **GitHub**, deployed via **Render**, and backed by **Neon PostgreSQL**, replacing the prototype’s `localStorage`-based data layer with a real backend and authentication system.

-----

## 2. Project Vision

The platform’s vision is drawn from both the PDF (the union’s official mission) and the prototype’s “About / رؤيتنا 2030” content:

- **A single digital home for the student union’s voice.** The PDF frames the union as *“الجهة الرسمية والشرعية الوحيدة التي تتحدث بلسان آلاف الطلاب عبر جميع القطاعع والكليات”* (“the sole official and legitimate body speaking on behalf of thousands of students across all sectors and faculties”). ZU Connect is meant to be the digital expression of that mandate.
- **Three strategic pillars** (PDF, slide 2 — “قوة وهدف الاتحاد العام”):
1. **صوت الحق والعدالة** (Voice of Truth and Justice) — standing firmly against corruption, demanding improved university services, and reform of the educational system.
1. **حماية البيئة الجامعية** (Protection of the University Environment) — defending the safety and security of students within campus and demanding the rule of law.
1. **التمثيل الطلابي الشامل** (Comprehensive Student Representation) — the sole legitimate voice for all students across all sectors and faculties.
- **Organizational philosophy** (PDF, slide 3 quote): *“هيكل تنظيمي يضمن وصول صوت كل طالب من كليته إلى أعلى هرم السلطة الجامعية”* — “An organizational structure that ensures every student’s voice, from their faculty, reaches the top of the university authority hierarchy.” ZU Connect should make this hierarchy visible and navigable.
- **“صوت الطالب.. شريك في البناء والتطوير”** (PDF tagline) — “The Student’s Voice: A Partner in Building and Development.”
- **“يدٌ واحدة.. لمستقبل أفضل”** (PDF closing slide) — “One Hand for a Better Future” — the union “remains alongside its 14 faculties, the impregnable fortress for student rights, and the primary driver of academic excellence and national awareness.”
- **Vision 2030** (prototype “About” page, رؤيتنا 2030): “To be a model of an effective student union that contributes to academic development, fulfills the new generation’s aspirations for a promising future, and makes Zawia University a regional reference for student work.”
- **Mission** (prototype “About” page, رسالتنا): “We represent the voices of Zawia University students and seek to create a supportive academic, cultural, and social environment through effective communication with university administration, conveying student demands, and organizing activities that enrich the student experience.”

In short: ZU Connect is both a **service portal** (courses, library, planner, chat, services) and an **institutional transparency/communication tool** (leadership directory, organizational chart, news, suggestions/complaints channel) for the student union.

-----

## 3. Stakeholders

|Stakeholder                                                                                       |Description / Source                                                                                                                                                                                                                                                                                                                                             |
|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|**الاتحاد العام لطلبة جامعة الزاوية** (General Union of Zawia University Students)                |The commissioning organization and primary content owner. Founded 2008 per prototype timeline.                                                                                                                                                                                                                                                                   |
|**محمد وسام الفراح** — رئيس الاتحاد العام                                                         |President of the General Union; named in both the PDF (slide 4) and the prototype’s home-page Leadership Board. Described as representing the highest student authority in the university, leading defense of student rights, coordinating major initiatives, and serving as the primary liaison with the university presidency.                                 |
|**مالك علي كشلاف** — النائب الأول (First Deputy)                                                  |Named only in the prototype’s Leadership Board (not present in the supplied PDF).                                                                                                                                                                                                                                                                                |
|**عبد المجيد محمد الحمري** — النائب الثاني (Second Deputy)                                        |Named only in the prototype’s Leadership Board (not present in the supplied PDF).                                                                                                                                                                                                                                                                                |
|**Executive Office holders** (12 named individuals in prototype’s `OFFICES` data — see Section 11)|Each manages a specialized portfolio (student affairs, public relations, administrative affairs, membership, media, programs & activities, legal affairs, female students’ affairs, digital transformation, sports activities, alumni affairs, follow-up & development). Not present in the supplied PDF, which shows only 4 generic placeholder executive roles.|
|**14 Faculty Union Presidents** (رئيس اتحاد الكلية)                                               |One per faculty, per PDF slides 7–13. Only one is named: **حسام الدين شقلابو** (Faculty of Dentistry & Oral and Maxillofacial Surgery). The rest are placeholder profiles with generic silhouette photos.                                                                                                                                                        |
|**Zawia University administration / rectorate**                                                   |Referenced as the body the union liaises with (“ربط الجهات المعنية”, “رئاسة الجامعة”); not a direct platform user but an external entity the union represents students to.                                                                                                                                                                                       |
|**General student body**                                                                          |~5,240 students (per prototype stat), across 14 faculties; primary end users of the platform.                                                                                                                                                                                                                                                                    |
|**Teaching staff (أستاذ)**                                                                        |A login role exists for teachers; their platform responsibilities are undefined (see Open Questions).                                                                                                                                                                                                                                                            |
|**Platform administrators (إدارة)**                                                               |A login role exists for administration; their platform responsibilities/back-office are undefined (see Open Questions).                                                                                                                                                                                                                                          |
|**Project technical lead (Ahmed)**                                                                |Acting as the developer/architect commissioning this understanding document, providing the design prototype and source materials.                                                                                                                                                                                                                                |
|**Future development team**                                                                       |The intended audience of this document — responsible for turning this understanding into an implementation plan, then code.                                                                                                                                                                                                                                      |
|**U.Z.S.U (الاتحاد العام لطلبة جامعة الزاوية)** — historical branding entity                      |Referenced via the 2015 emblem (IMG_0792.JPG), credited to “ALHUSAIN ELSHAWISH, 2015” — likely an earlier incarnation of the same union’s branding.                                                                                                                                                                                                              |

-----

## 4. User Types

The prototype’s login screen defines three selectable roles, plus an implicit unauthenticated visitor role. Responsibilities below are inferred from context, since the prototype does not implement differentiated behavior per role.

### 4.1 Guest / Unauthenticated Visitor

- Can browse: Home, About, Members directory, Colleges, News & Activities, Courses (view only), Activity Planner, Services, FAQ, Library (view only).
- Cannot persist enrollments, chat identity, or submissions tied to an account (currently everything is per-browser via `localStorage`, so in practice even “logged in” users are not truly authenticated).

### 4.2 Student (طالب)

- Default/primary role, pre-selected on the login screen.
- Expected capabilities (per Services tile list and page content): enroll/unenroll in training courses, participate in faculty/topic chat rooms, submit suggestions/complaints, register as a volunteer, use the AI assistant, participate in e-voting (التصويت الإلكتروني) during union elections, download/view library resources, view personalized “upcoming activities.”
- Identified by college/faculty and academic year (seen in Members directory `dept` field, e.g., “كلية الهندسة - السنة الخامسة”).

### 4.3 Teacher (أستاذ)

- Selectable at login via a dedicated role button with a chalkboard icon.
- **No distinct functionality is defined anywhere in the supplied materials.** This is a significant open question (see Section 18 and 19).

### 4.4 Administration (إدارة)

- Selectable at login via a dedicated role button with a settings/gear icon.
- **No admin dashboard, content-management interface, or back-office is defined anywhere in the supplied materials.** Given that the platform’s content (news, courses, library, FAQ, planner, member directory, leadership board) is currently hardcoded as static arrays in the prototype, an admin role would presumably need to manage all of this — but this is not specified. (See Section 18 and 19.)

### 4.5 Union Leadership / Executive Office Holders (content entities, not necessarily distinct platform accounts)

- President, two deputies, ~12 executive office holders, and 14 faculty union presidents are represented as **content** (displayed in the Leadership Board and Members directory) rather than as a clearly defined platform “role.” Whether these individuals require special platform permissions (e.g., to post news, moderate chat rooms, respond to suggestions) is unspecified.

-----

## 5. Core Objectives

1. Provide a single, mobile-friendly, Arabic-RTL digital home for all union-related student services and communications.
1. Make the union’s **organizational structure and leadership** transparent and navigable — reflecting the real hierarchy described in the PDF (General Union → Executive Offices → 14 Faculty Unions).
1. Provide a **directory of union council members** (leadership, committee heads, faculty representatives), filterable by category, with contact affordances.
1. Provide a **directory of the university’s colleges/faculties**, each with student counts and links to relevant content (news, schedules, files, activities).
1. Deliver a **news & activities feed** with category filtering (general news, urgent announcements, events, courses, completed activities).
1. Offer a **training course catalog** with category filters, enrollment/cancellation flow, seat availability tracking, and detail views.
1. Provide an **activity planner/calendar** organized by month, showing upcoming union/university events.
1. Provide **per-faculty / per-topic discussion (chat) rooms** for student community interaction.
1. Provide a **digital library** of academic resources (lecture summaries, research papers, PDF books, recorded lectures) with filtering, ratings, and download/playback actions.
1. Provide an **AI assistant** that can answer common student questions (exam dates, course registration, library, scholarships, chat rooms, union history).
1. Provide a **suggestions/complaints (“Voice of the Student”) channel** plus direct contact information and office hours, fulfilling the union’s “صوت الحق والعدالة” mandate.
1. Provide a **volunteer program** signup across multiple categories (environmental, blood donation, events, national initiatives, freshman welcome, media).
1. Provide an **FAQ** for self-service answers to common questions.
1. Provide **login/authentication** with three roles (student, teacher, admin) — to be made real (currently fully simulated).
1. Support **light/dark theming**, persisted per user/device.
1. Present the union’s **history, mission, and 2030 vision** on an “About” page, reinforcing institutional identity and continuity (founded 2008 → ZU Connect launch 2026).

-----

## 6. Functional Requirements

This section enumerates functionality discovered in the prototype (`zu_connect_v2.html`), organized by page/module. Each item notes whether it is **fully interactive (client-side simulated)**, **static/display-only**, or **non-functional placeholder** in the current prototype — all of these will need a real backend implementation.

### 6.1 Global / Shared UI

- **Top bar**: brand mark (“U.Z.S.U” placeholder badge) + “ZU Connect” title + Arabic subtitle “اتحاد طلبة جامعة الزاوية”; a “تسجيل دخول” (Login) pill button; a theme toggle (sun/moon icon, **functional** — persists to `localStorage`); a notifications bell with an indicator dot (**non-functional placeholder**); a search icon (**non-functional placeholder**).
- **Primary navigation bar**: sticky, horizontally scrollable on mobile, 13 links + Login, each with a Tabler icon: الرئيسية (Home), عن الاتحاد (About), أعضاء الاتحاد (Members), الكليات (Colleges), الأخبار والأنشطة (News & Activities), الدورات التدريبية (Courses), الأنشطة القادمة (Planner), غرف النقاش (Chat), الخدمات (Services), اقترح / تواصل (Suggestions/Contact), تطوع معنا (Volunteer), الأسئلة الشائعة (FAQ), المكتبة (Library), الدخول (Login).
- **Single-page navigation**: clicking any `data-nav` element shows the corresponding `<section id="page-...">` and hides all others (`is-active` class), with a fade-in animation and scroll-to-top. **No URL routing/deep-linking** — refresh always returns to Home.
- **Footer**: platform description, “Quick Links” (subset of nav items), contact info (email, phone, address), copyright line.
- **Modal component**: reusable dialog with title, body, and configurable action buttons (used for course enrollment/cancellation confirmation and course detail display).
- **Toast component**: bottom-center transient notification (used for login, suggestion submission, volunteer registration, library “download” simulation, course enrollment confirmation).
- **Skip-to-content link** for accessibility.

### 6.2 Home Page (الرئيسية)

- **Hero banner**: welcome heading, descriptive paragraph, two CTAs (“استكشف الخدمات” → Services page; “تسجيل الدخول” → Login page).
- **Stats row**: 4 stat cards — 5,240 طالب مسجل (registered students), 12 كلية ومعهد (colleges/institutes — **conflicts with PDF’s 14**, see Section 20), 48 نشاط هذا العام (activities this year), 320 ملف في المكتبة (library files).
- **Leadership Board** (“الهيكل الإداري للاتحاد العام”) — styled in a distinct navy/gold theme explicitly modeled on the PDF:
  - President card (gold-bordered, star icon, name + “رئيس الاتحاد العام” label).
  - Two deputy cards (initials avatars, names, “النائب الأول”/“النائب الثاني” labels).
  - Grid of 12 “Executive Office” cards (icon, name, office/portfolio title) — rendered dynamically from the `OFFICES` array.
- **Latest News** (two-column layout, left/main column): shows the first 3 items from the `NEWS` array, each with title, category badge, body excerpt, date, and view count. “عرض الكل ←” link → News page.
- **Sidebar (right column)**:
  - “الأنشطة القادمة” (Upcoming Activities) — first 4 items flattened from the `PLANNER` data, each with icon, title, date.
  - “المنح والفرص” (Scholarships & Opportunities) — 2 static entries: Turkish scholarship (deadline 30 May) and student exchange program (deadline 10 June).
- **AI Assistant card**: avatar, prompt text, input field + send button, and a scrollable conversation log. **Functional but rule-based** — keyword-matches the user’s question against a small `AI_KNOWLEDGE` array (exams, course registration, library, scholarships, chat rooms, union history) and returns a canned response, or a generic fallback (“سأحوّله لفريق الدعم…”).

### 6.3 About Page (عن الاتحاد)

- “رسالتنا” (Mission) and “رؤيتنا 2030” (Vision 2030) cards (static text — see Section 2).
- 3 highlight stat cards: 2008 (founding year), 5,240+ (students), 120+ (activities/initiatives).
- “المسيرة التاريخية” (Historical Timeline) — 7 milestones from 2008 to 2026, rendered as a vertical timeline:
  - 2008: Founding of the student union (9-member council).
  - 2012: First national student conference (delegations from 7 Libyan universities).
  - 2016: Launch of summer training programs (partnerships with local companies, engineering/tech specializations).
  - 2019: Expansion to 12 colleges and institutes (3 new colleges added).
  - 2022: Launch of the digital library (summaries, research, PDF books).
  - 2024: Launch of international scholarship program (Turkey, Tunisia, Morocco).
  - 2026: Launch of the ZU Connect digital platform itself.

> Note: This timeline’s “2019: expansion to 12 colleges” is the likely origin of the prototype’s “12 colleges” figure, which conflicts with the PDF’s “14 faculties” — see Section 20.

### 6.4 Members Directory (أعضاء الاتحاد)

- Header indicates “الدورة 2025 - 2027” (the 2025–2027 term).
- Filter chips: الكل (All), القيادة التنفيذية (Executive Leadership), رؤساء اللجان (Committee Chairs), ممثلو الكليات (Faculty Representatives).
- Grid of member cards (12 in prototype data), each showing: circular gradient avatar with initials, full name, role/title, department + academic year, and a row of 3 contact icons (email, phone, message — **non-functional placeholders**, `href="#"`).
- Filtering is **fully functional client-side** (re-renders grid based on `cat` field).

### 6.5 Colleges Page (الكليات)

- Header subtitle: “12 كلية ومعهد تشكّل الاتحاد” (12 colleges/institutes form the union).
- Grid of 12 college cards (prototype data), each showing: icon, college name, approximate student count (e.g., “+850 طالب”), and a set of content-availability tags (e.g., أخبار/news, جداول/schedules, ملفات/files, نشاطات/activities).
- No filtering or click-through behavior defined — cards are display-only in the prototype.

### 6.6 News & Activities Page (الأخبار والأنشطة)

- Filter chips: الكل (All), أخبار (News), فعاليات (Events), دورات (Courses), عاجل (Urgent), أنشطة منجزة (Completed Activities).
- List of news cards (7 in prototype data), each with: title, category badge (color-coded), body text, date, and view count (formatted with Arabic-Indic numerals via `toLocaleString("ar-EG")`).
- Filtering is fully functional client-side; an empty-state message appears if a filter yields no results.

### 6.7 Courses Page (الدورات التدريبية)

- Filter chips: جميع التخصصات (All), تقنية وبرمجة (Tech/Programming), لغات (Languages), مهارات شخصية (Soft Skills), إدارة وأعمال (Business/Management).
- Grid of course cards (9 in prototype data), each with:
  - Colored/gradient cover banner with an icon.
  - Title, description.
  - Badges: instructor, duration, level (مبتدئ/متوسط/etc.).
  - Enrollment meta: “`enrolled`/`seats` مسجل (`percent`%)” and a status label (“متاح”/Available shown in green, or “مكتمل”/Full shown in red).
  - Two CTAs: **Enroll/Cancel button** (opens a confirmation modal; on confirm, toggles enrollment state, updates seat counts, persists to `localStorage` under `zu_enrolled`, shows a toast) and **“تفاصيل” (Details) button** (opens an info modal with description + instructor/duration/level/enrollment stats).
  - Enroll button is disabled with “مكتمل” label if the course is full and the user is not already enrolled.

### 6.8 Activity Planner Page (الأنشطة القادمة)

- Month tabs generated from `PLANNER` data (مايو 2026, يونيو 2026, يوليو 2026, أغسطس 2026) plus an “عرض الكل” (Show All) tab.
- Selecting a tab re-renders a vertical timeline of that month’s (or all months’) activities, each with an icon, date, title, and description.
- 10 sample activities across the 4 months (e.g., inter-college football tournament, scientific research writing workshop, top-student honoring ceremony, AI workshop, campus cleanup volunteer drive, university book fair, national student conference, summer internship program start, cultural trip to Tunisia, student entrepreneurs meetup).

### 6.9 Chat Rooms Page (غرف النقاش)

- Two-pane layout:
  - **Left pane**: list of 7 rooms (الغرفة العامة/General, كلية الهندسة/Engineering, كلية الطب والصيدلة/Medicine & Pharmacy, كلية الحاسوب/Computer Science, كلية القانون/Law, الفعاليات والأنشطة/Events & Activities, المساعدة والدعم/Help & Support), each showing icon, name, short description, and a live “online” count badge.
  - **Right pane**: header (active room name/description/online count), a scrollable message stream (chat bubbles, distinguishing “me” vs. “them” with author names and timestamps), a “typing…” indicator area, and a message input + send button.
- **Functional behaviors** (all client-side, single-user simulation):
  - Clicking a room switches the active room, re-renders header and message stream. Seeded messages exist per room (`SEED_MESSAGES`).
  - Submitting a message appends it to the active room’s stream (as “me”), persists all chat state to `localStorage` (`zu_chats`), shows a “someone is typing…” indicator, and after ~0.9–1.6 seconds appends a randomly-selected canned `BOT_RESPONSES` reply attributed to a randomly-chosen persona (“موجه الغرفة”, “عضو الاتحاد”, “مشرف القسم”).
  - Keyboard accessibility for room selection (Enter/Space triggers click).

### 6.10 Services Page (الخدمات)

- Grid of 10 service tiles, each with an icon, title, and short description:
1. تحميل النماذج (Download Forms) — no link target.
1. طلب دعم / شكوى (Support/Complaint Request) — links to Suggestions page.
1. التسجيل في أنشطة (Activity Registration) — links to Planner page.
1. شهادات حضور (Attendance Certificates) — no link target.
1. QR الفعاليات (Event QR Check-in) — no link target.
1. صندوق اقتراحات (Suggestion Box) — links to Suggestions page.
1. تطوع معنا (Volunteer with Us) — links to Volunteer page.
1. الأسئلة الشائعة (FAQ) — links to FAQ page.
1. خريطة الجامعة (Campus Map) — no link target.
1. التصويت الإلكتروني (E-Voting) — no link target.
- Tiles without a `data-nav` target are **non-functional placeholders** for future features.

### 6.11 Suggestions / Contact Page (اقترح / تواصل)

- **Form** (“أرسل اقتراحك أو شكواك”): optional name, college (free text), message type (select: اقتراح/Suggestion, شكوى/Complaint, فكرة نشاط/Activity Idea, أخرى/Other), message body (required textarea). On submit: shows a success toast (“تم إرسال رسالتك إلى الاتحاد بنجاح ✓”) and resets the form. **No actual storage or transmission** — purely client-side simulation.
- **Sidebar — “طرق التواصل المباشر” (Direct Contact Methods)**:
  - Email: `union@zu.edu.ly`
  - Phone: `+218 23 762 0000`
  - Official Facebook page: “اتحاد طلبة جامعة الزاوية”
  - HQ: “مبنى الاتحاد - الحرم الجامعي، الزاوية” (Union building, university campus, Zawia)
- **Sidebar — “أوقات الاستقبال” (Reception Hours)**: Sunday–Thursday, 9:00 AM – 2:00 PM, at “مكتب الاتحاد - الإدارة العامة” (Union Office, General Administration).

### 6.12 Volunteer Page (تطوع معنا)

- Intro paragraph describing the value of volunteering.
- Grid of 6 volunteer category tiles: حملات بيئية (Environmental Campaigns), حملات التبرع بالدم (Blood Donation Campaigns, in partnership with the National Blood Transfusion Center), تنظيم الفعاليات (Event Organization Support), أعمال وطنية (National Initiatives), استقبال الطلاب الجدد (New Student Welcome/Onboarding), الإعلام والتصوير (Media & Photography).
- **Registration form** (“سجل كمتطوع”): full name, college + academic year (free text), phone number, and a “preferred volunteer area” select (mirroring the 6 categories above). On submit: success toast (“تم تسجيلك كمتطوع، سنتواصل معك قريباً ✓”) and form reset. **No actual storage** — purely client-side simulation.

### 6.13 FAQ Page (الأسئلة الشائعة)

- Accordion of 8 question/answer pairs (first one open by default), covering: how to submit a suggestion/complaint, how to register for training courses, how to join the volunteer team, where to find course summaries/references, how to find upcoming activities, who the current council members are, how to contact one’s faculty representative, and whether students can participate in union elections.
- Accordion expand/collapse is fully functional (single-open behavior — opening one closes others).

### 6.14 Library Page (المكتبة)

- Filter chips: الكل (All), ملخصات (Summaries), بحوث (Research), كتب PDF (PDF Books), تسجيلات (Recordings).
- Grid of 6 library resource cards (prototype data), each with: type badge (color-coded by type), title, subtitle (faculty/year/page count or duration), a stat (download count or view count), a star rating, and an action icon button (download icon for documents, play icon for recordings) which, on click, shows a “جاري التحميل…” (Downloading…) toast — **no real file is served**.
- Filtering is fully functional client-side; empty-state message if no results.

### 6.15 Login Page (الدخول)

- Role selector: طالب (Student, default-selected), أستاذ (Teacher), إدارة (Admin) — purely visual toggle, no behavioral difference.
- Form: “رقم القيد / البريد الجامعي” (Registration Number / University Email) text field, password field (min length 4).
- “هل نسيت كلمة المرور؟ استعادة” (Forgot password? Recover) — link present but non-functional (`href="#"`).
- On submit: **no real authentication**. Any non-empty username and ≥4-character password “succeeds.” The username (portion before `@` if an email) is stored as `state.user.name` and persisted to `localStorage` (`zu_user`), a success toast is shown (“تم تسجيل الدخول (محاكاة) ✓” — explicitly labeled as a *simulation*), and the user is navigated to Home.
- The stored `state.user.name` is used as the “author” name when the user sends chat messages.

### 6.16 Theming

- Light/dark mode toggle (moon/sun icon in top bar). Initializes from `localStorage` (`zu_theme`) or system preference (`prefers-color-scheme: dark`). Persists choice. All color tokens have light/dark variants defined via CSS custom properties on `:root` and `html[data-theme="dark"]`.

-----

## 7. Non-Functional Requirements

- **Language & Direction**: Arabic-first, full RTL layout (`<html lang="ar" dir="rtl">`). All UI copy is in Arabic. No multi-language toggle exists or is implied beyond the brand name “ZU Connect” itself being in Latin script.
- **Typography**: “Cairo” font family (Google Fonts, weights 400/500/600/700) with fallbacks to Segoe UI, Tahoma, Arial, sans-serif.
- **Iconography**: Tabler Icons webfont v3.10.0 via CDN (`cdn.jsdelivr.net`).
- **Responsiveness**: Defined breakpoints at 980px, 720px, and 480px. Layout adjustments include: two-column → single-column collapses, 4/3-column grids → 2/1-column grids, chat shell collapsing to a single column with a height-capped room list, hiding secondary label text in the top bar, and reduced nav-link padding/font-size on small screens.
- **Theming**: Full light/dark theme support via CSS custom properties; dark theme redefines surface, text, border, badge, and shadow tokens.
- **Accessibility**: Skip-to-content link; `aria-label`s on icon-only buttons; `aria-live="polite"` regions for chat stream and AI assistant log; `role="tablist"`/`role="tab"`/`aria-selected` on chat room list; `:focus-visible` outline styling; semantic landmark roles (`banner`, `contentinfo`); `prefers-reduced-motion` support disables all animations/transitions.
- **Performance / Dependencies**: Currently relies on two external CDNs (Google Fonts, Tabler Icons jsdelivr CDN) — acceptable for a prototype but should be evaluated (and potentially self-hosted) for production reliability, especially given a Libyan user base where external CDN access may be inconsistent (a known concern from prior related work).
- **Data persistence**: Currently 100% client-side via `localStorage` (`zu_user`, `zu_theme`, `zu_chats`, `zu_enrolled`). This is **not durable**, is **per-browser/per-device only**, and provides **no real multi-user functionality** (e.g., chat is not actually shared between users). This must be replaced by a real backend (per the brief: Neon PostgreSQL) with proper data models (see Section 17).
- **Security**: No real authentication, no password hashing, no session management, no input sanitization beyond basic `escapeHTML` for rendering (XSS-safe rendering of dynamic text, but no server-side validation since there is no server). A production system needs real auth, role-based authorization (student/teacher/admin), and server-side validation of all form submissions (suggestions, volunteer registrations, course enrollments, chat messages).
- **Maintainability**: The prototype uses a token-based design system (CSS custom properties for color, radius, shadow, transition) and small reusable component classes (`.card`, `.tile`, `.badge`, `.chip`, `.btn` variants), which is a good foundation for a component library in the eventual framework.
- **Scalability considerations**: Chat rooms currently simulate “online” counts and bot replies; a real implementation needs to consider real-time infrastructure (WebSockets, polling, or a managed real-time service) and moderation for genuinely multi-user chat across 7+ rooms.
- **Numeral formatting**: News view counts use `toLocaleString("ar-EG")`, which renders Eastern Arabic-Indic numerals (٠١٢٣…) — this is a deliberate localization choice but has historically been a source of rendering bugs in related projects (per prior work context) and should be tested carefully across browsers/fonts.

-----

## 8. Information Architecture

The platform is structured as a **single HTML document** with 14 mutually-exclusive “page” sections (`<section class="page">`), toggled via JavaScript — i.e., a client-side single-page application (SPA) pattern without URL routing.

```
ZU Connect (root)
├── الرئيسية (Home) — default/landing
├── عن الاتحاد (About)
├── أعضاء الاتحاد (Members Directory)
├── الكليات (Colleges)
├── الأخبار والأنشطة (News & Activities)
├── الدورات التدريبية (Courses)
├── الأنشطة القادمة (Activity Planner)
├── غرف النقاش (Chat Rooms)
├── الخدمات (Services)
├── اقترح / تواصل (Suggestions / Contact)
├── تطوع معنا (Volunteer)
├── الأسئلة الشائعة (FAQ)
├── المكتبة (Digital Library)
└── الدخول (Login)
```

Each page is self-contained; there is no nested/sub-page hierarchy in the current prototype. The “Services” page acts as a secondary index, linking out to Suggestions, Planner, Volunteer, and FAQ — suggesting these are conceptually “services” the union offers, while pages like Home/About/Members/Colleges/News/Courses/Chat/Library are more “content/community” sections.

-----

## 9. Navigation Structure

### 9.1 Primary Navigation (sticky nav bar, all pages)

Home → About → Members → Colleges → News & Activities → Courses → Planner → Chat Rooms → Services → Suggestions/Contact → Volunteer → FAQ → Library → Login

(13 content sections + Login, each with a distinct Tabler icon, horizontally scrollable on narrow viewports.)

### 9.2 Top Bar (all pages)

Logo/Brand (left in RTL = visually right) → Login button → Theme toggle → Notifications (placeholder) → Search (placeholder)

### 9.3 Footer Navigation (all pages)

“Quick Links” subset: About, News & Activities, Suggestions/Contact, Volunteer, FAQ, Library
Plus repeated contact info (email, phone, “جامعة الزاوية، ليبيا” address).

### 9.4 Cross-Page Links / Entry Points

- Home → “عرض الكل ←” link → News & Activities
- Home → “استكشف الخدمات” CTA → Services
- Home → “تسجيل الدخول” CTA → Login
- Services tiles → Suggestions (×2 tiles), Planner, Volunteer, FAQ
- Footer links → About, News, Suggestions, Volunteer, FAQ, Library

### 9.5 Routing Gap

There is **no hash-based or path-based routing**. A page refresh always resets to Home. There is no way to deep-link to, e.g., a specific course, news item, chat room, or member profile. This is a gap that will likely need addressing in the real implementation (e.g., for sharing links to specific news items or courses).

-----

## 10. Content Inventory

All content discovered across the prototype and PDF, itemized:

### 10.1 From the Prototype (`zu_connect_v2.html`) — demo/placeholder data

- **NEWS** (7 items): student week launch, second-semester exam schedule announcement (urgent), free programming course with a tech company, 2026 student projects exhibition, chess tournament conclusion, MoU with University of Tripoli, blood donation campaign (200 students).
- **MEMBERS** (12 entries across 3 categories — leadership/committees/reps): includes a “رئيس الاتحاد” named **محمد العماري** — *note: this is a different person from the Home page’s President, محمد وسام الفراح* (flagged in Conflicts, Section 20), plus نائب الرئيس (سارة الأحمدي), الأمين العام (عبدالله المنصوري), أمين الصندوق (فاطمة الخليفي), committee chairs (يوسف الشريف – ثقافة, ليلى الرويمي – أنشطة, خالد الزروق – لجنة تقنية, نور البشير – علاقات), and faculty representatives (أحمد الجبالي – هندسة, رنا العامري – طب, سالم القاضي – قانون, هدى المهدي – صيدلة).
- **COLLEGES** (12 entries): الهندسة والتقنية, الطب البشري, الصيدلة, القانون والعلوم السياسية, الاقتصاد والأعمال, الحاسوب والمعلوماتية, العلوم الأساسية, الآداب والإنسانيات, التربية, الإعلام والاتصال, الزراعة, المعهد العالي للتقنية — each with an approximate student count and content-availability tags.
- **COURSES** (9 items): مقدمة في تطوير الويب, الذكاء الاصطناعي للمبتدئين, الإنجليزية للأغراض الأكاديمية, مهارات العرض والتقديم, إدارة المشاريع الصغيرة, قواعد البيانات SQL, فن التحدث أمام الجمهور, كتابة السيرة الذاتية, اللغة التركية - مستوى أول — each with instructor, duration, level, seat counts.
- **PLANNER** (10 items across 4 months — مايو, يونيو, يوليو, أغسطس 2026): football tournament, research-writing workshop, top-students ceremony, AI workshop, campus cleanup, book fair, national student conference, summer internship start, Tunisia trip, entrepreneurs meetup.
- **LIBRARY** (6 items): algorithms summary, Libyan commercial law PDF book, post-2011 Libyan economic development research, organic chemistry lecture recording, neurology/nervous-system anatomy summary, project management fundamentals PDF book.
- **CHAT_ROOMS** (7 rooms) with **SEED_MESSAGES** for each: عام (General — 4 messages), هندسة (Engineering — 2), طب (Medicine — 2), حاسوب (Computer — 3), قانون (Law — 1), فعاليات (Events — 1), مساعدة (Help — 1).
- **OFFICES** (12 named executive office holders — see Section 11).
- **FAQ** (8 Q&A pairs — see Section 6.13).
- **BOT_RESPONSES** (5 canned chat-bot replies).
- **AI_KNOWLEDGE** (6 keyword-matched AI assistant replies covering: exams, course registration, library, scholarships, chat rooms, union history/founding).
- Historical timeline (7 milestones, 2008–2026 — see Section 6.3).
- Mission, Vision 2030, founding stats (2008, 5,240+ students, 120+ activities).
- Contact details: `union@zu.edu.ly`, `+218 23 762 0000`, Facebook page “اتحاد طلبة جامعة الزاوية”, HQ address, office hours.

### 10.2 From the PDF (`DOC-20260524-WA0007_.pdf`) — authoritative organizational content

- Title & tagline (slide 1): “الاتحاد العام لطلبة جامعة الزاوية” / “دليل الهيكلية الإدارية، رؤساء الاتحادات، وممثلي الكليات الـ 14” / “صوت الطالب.. شريك في البناء والتطوير”.
- Strategic pillars (slide 2): صوت الحق والعدالة, حماية البيئة الجامعية, التمثيل الطلابي الشامل (full text in Section 2).
- Organizational chart (slide 3): General Union → 3× “المكاتب التنفيذية والأعضاء” → 14× “اتحادات الكليات” + explanatory quote.
- President profile (slide 4): محمد وسام الفراح, with bio and placeholder photo.
- 4 generic Executive Office role cards (slide 5): نائب الرئيس, أمين السر, مسؤول الشؤون الأكاديمية, مسؤول الأنشطة الطلابية — all with placeholder names (“اسم العضو التنفيذي”) and a caption describing their collective role.
- 14-Faculty grid (slide 6) with icons — see Section 11.
- 7 paired faculty-union-president profile slides (slides 7–13), each with a short mission statement per faculty — see Section 11 for full text per faculty.
- Code of Ethics & Strategic Goals (slide 14): الدفاع عن الحقوق, المهام التعليمية, الأنشطة والبيئة, العلاقات الاجتماعية — full text in Section 11.
- Closing slide (slide 15): “يدٌ واحدة.. لمستقبل أفضل” + closing statement + contact placeholders (Email | Official Facebook Page | Website) + union logo (torch/people emblem).

### 10.3 From Images

- **IMG_0793.JPG**: Photograph of Zawia University’s main campus building (yellow dome, landscaped roundabout) — visually matches the PDF’s title-slide background.
- **IMG_0792.JPG**: “U.Z.S.U” emblem (2015) — graduation cap inside a laurel wreath, Arabic text “اتحاد طلبة جامعة الزاوية”, credited “ALHUSAIN ELSHAWISH 2015.”

-----

## 11. Organizational Structure

This section consolidates the **real organizational structure** of the General Union of Zawia University Students, as documented in the PDF, alongside the prototype’s (partially conflicting) representation of it.

### 11.1 Official Hierarchy (per PDF, slide 3)

```
الاتحاد العام لطلبة جامعة الزاوية (General Union)
│
├── المكاتب التنفيذية والأعضاء (Executive Offices & Members) — Group 1
├── المكاتب التنفيذية والأعضاء (Executive Offices & Members) — Group 2
└── المكاتب التنفيذية والأعضاء (Executive Offices & Members) — Group 3
        │
        └── 14 × اتحادات الكليات (Faculty Unions) — one per faculty
```

Quote (slide 3): *“هيكل تنظيمي يضمن وصول صوت كل طالب من كليته إلى أعلى هرم السلطة الجامعية”* — “An organizational structure ensuring every student’s voice, from their faculty, reaches the top of the university authority hierarchy.”

### 11.2 General Union Leadership (per PDF)

- **President (رئيس الاتحاد العام)**: **محمد وسام الفراح** (slide 4). Bio: “Represents the highest student authority at the university. Leads efforts to defend student rights, coordinates major initiatives, and serves as a key link with the university presidency and responsible parties to ensure an ideal educational environment.” Photo: placeholder (“صورة شخصية”).
- **4 Executive Office roles** (slide 5, all placeholder names — “اسم العضو التنفيذي”):
1. نائب الرئيس (Vice President / Deputy)
1. أمين السر (Secretary)
1. مسؤول الشؤون الأكاديمية (Academic Affairs Officer)
1. مسؤول الأنشطة الطلابية (Student Activities Officer)
  - Caption: “These executive members form the backbone of the union’s executive office, each managing specialized portfolios covering academic affairs, student activities, and external relations.”

### 11.3 General Union Leadership (per Prototype — additional/conflicting names)

The prototype’s Home page Leadership Board names individuals **not present in the PDF**:

- **President**: محمد وسام الفراح (✅ matches PDF)
- **النائب الأول (First Deputy)**: مالك علي كشلاف
- **النائب الثاني (Second Deputy)**: عبد المجيد محمد الحمري
- **12 Executive Offices** (`OFFICES` array — far more granular than the PDF’s 4 generic roles):
1. عبد الإله عبد الرؤوف راشد — مكتب شؤون الطلبة (Student Affairs Office)
1. أنور المقطوف — مكتب العلاقات العامة (Public Relations Office)
1. محمد هشام البشكار — مكتب الشؤون الإدارية (Administrative Affairs Office)
1. عبد العزيز دخيل — مكتب العضوية (Membership Office)
1. إسلام غريبي — مكتب الإعلام (Media Office)
1. أيهم نصرات — مكتب البرامج والأنشطة (Programs & Activities Office)
1. عبد الكريم يحي — مكتب الشؤون القانونية (Legal Affairs Office)
1. أبرار علي سعيد — مكتب شؤون الطالبات (Female Students’ Affairs Office)
1. عبد الرؤوف الطاهر — مكتب المنظومة والتحول الرقمي (Digital Transformation Office)
1. إبراهيم يوسف ساسي — مكتب الأنشطة الرياضية (Sports Activities Office)
1. قاسم عبد السلام النمروش — مكتب شؤون الخريجين (Alumni Affairs Office)
1. أبوبكر بكير — مكتب المتابعة والتطوير (Follow-up & Development Office)

> These 12 named individuals and their specific portfolios are **not corroborated by the supplied PDF**. Their source is unknown (see Section 18, Missing Information, and Section 19, Questions).

### 11.4 The 14 Faculties (per PDF, slide 6 — “الكليات الـ 14: شبكة الاتحاد المتكاملة”)

|# |Faculty (Arabic)                  |English Gloss                                                  |
|--|----------------------------------|---------------------------------------------------------------|
|1 |كلية الطب البشري                  |Faculty of Human Medicine                                      |
|2 |كلية طب وجراحة الفم والأسنان      |Faculty of Dentistry & Oral and Maxillofacial Surgery          |
|3 |كلية الصيدلة                      |Faculty of Pharmacy                                            |
|4 |كلية التقنية الطبية               |Faculty of Medical Technology                                  |
|5 |كلية الهندسة                      |Faculty of Engineering                                         |
|6 |كلية هندسة النفط والغاز           |Faculty of Petroleum & Gas Engineering                         |
|7 |كلية تقنية المعلومات              |Faculty of Information Technology                              |
|8 |كلية العلوم                       |Faculty of Science                                             |
|9 |كلية الآداب                       |Faculty of Arts (founding faculty of the university, est. 1988)|
|10|كلية التربية                      |Faculty of Education                                           |
|11|كلية الاقتصاد                     |Faculty of Economics                                           |
|12|كلية القانون                      |Faculty of Law                                                 |
|13|كلية اللغات والترجمة              |Faculty of Languages & Translation                             |
|14|كلية التربية البدنية وعلوم الرياضة|Faculty of Physical Education & Sports Science                 |

### 11.5 Faculty Union President Profiles (per PDF, slides 7–13)

Each faculty has a “رئيس اتحاد الكلية” (Faculty Union President) with a short mission statement. All have placeholder/generic silhouette photos except one named individual.

|Faculty                                                                 |Faculty Union President|Mission statement (summarized)                                                                                                                      |
|------------------------------------------------------------------------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
|كلية التربية (Education)                                                |Unnamed                |“Stronghold for student safety advocacy; historically led movements to ensure campus security and stability of the educational environment.”        |
|كلية الآداب (Arts, est. 1988 — founding faculty of the university)      |Unnamed                |“Leads the union in cultural and social initiatives.”                                                                                               |
|كلية الهندسة (Engineering)                                              |Unnamed                |“Pioneers of structural development and innovation; union focuses on providing labs and updating curricula to keep pace with the times.”            |
|كلية هندسة النفط والغاز (Petroleum & Gas Engineering)                   |Unnamed                |“Leadership striving to develop the university environment, raise the faculty’s academic standard, and support students’ scientific progress.”      |
|كلية الطب البشري (Human Medicine)                                       |Unnamed                |“Voice of healthcare students; the union defends the rights of future doctors in a safe clinical and educational environment.”                      |
|كلية طب وجراحة الفم والأسنان (Dentistry & Oral Surgery)                 |**حسام الدين شقلابو**  |“Pioneers of the ethical charter for faculty students; works to instill professional ethics and secure academic freedom and sound education rights.”|
|كلية التقنية الطبية (Medical Technology)                                |Unnamed                |“Bridge between technology and healthcare; union supports providing the latest technologies to serve students’ academic path.”                      |
|كلية الصيدلة (Pharmacy)                                                 |Unnamed                |“Union focuses on supporting medical research and providing a scientific environment ensuring student excellence in pharmaceutical sciences.”       |
|كلية تقنية المعلومات (Information Technology)                           |Unnamed                |“Driver of student digital transformation; union seeks to empower students in programming and technological innovation.”                            |
|كلية الاقتصاد (Economics)                                               |Unnamed                |“Student leaderships in management and finance fields; union works to connect theoretical aspects with practical application.”                      |
|كلية العلوم (Science)                                                   |Unnamed                |“Incubator of scientific inquiry; union follows up on lab equipment and supports graduation projects and student research.”                         |
|كلية القانون (Law)                                                      |Unnamed                |“Early defenders of legal frameworks for student rights, ensuring justice and equality within the campus.”                                          |
|كلية التربية البدنية وعلوم الرياضة (Physical Education & Sports Science)|Unnamed                |“Manages university sports activities; union cares about physical health and excellent organization of student tournaments.”                        |
|كلية اللغات والترجمة (Languages & Translation)                          |Unnamed                |“Students’ window to the world; union supports cultural exchange programs and advanced language skills development.”                                |

### 11.6 Code of Ethics & Strategic Goals (per PDF, slide 14 — “الميثاق الأخلاقي والأهداف الاستراتيجية”)

1. **الدفاع عن الحقوق** (Defense of Rights): “Representing students’ interests firmly per Law No. (23), and resolving issues between the student and university administration.”
1. **المهام التعليمية** (Educational Tasks): “Ensuring the right to sound education, freedom to be heard, and academic expression of opinion.”
1. **الأنشطة والبيئة** (Activities & Environment): “Organizing festivals, training courses, and volunteer work to create a motivating university environment.”
1. **العلاقات الاجتماعية** (Social Relations): “Building bridges of trust and continuous communication between students and faculty/college administrations.”

### 11.7 Closing / Brand Statement (per PDF, slide 15)

“يدٌ واحدة.. لمستقبل أفضل” — “The General Union of Zawia University Students remains, alongside its 14 faculties, the impregnable fortress for student rights and the primary driver of academic excellence and national awareness.” Followed by three contact placeholders: البريد الإلكتروني (Email) | صفحة الفيسبوك الرسمية (Official Facebook Page) | الموقع الإلكتروني (Website) — none populated with actual values in the PDF.

-----

## 12. User Flows

### 12.1 New Visitor Exploring the Platform

1. Lands on Home → sees hero, stats, Leadership Board, latest news, upcoming activities, scholarships, AI assistant.
1. Clicks “استكشف الخدمات” → Services page → browses 10 service tiles.
1. Clicks a tile (e.g., “صندوق اقتراحات”) → navigates to Suggestions/Contact page.

### 12.2 Student Enrolling in a Training Course

1. Navigates to “الدورات التدريبية” (Courses).
1. Filters by category (e.g., “تقنية وبرمجة”).
1. Reviews course cards (title, instructor, duration, level, seats).
1. Clicks “تسجيل في الدورة” → confirmation modal opens showing instructor/duration/level/remaining seats.
1. Confirms → enrollment recorded (currently `localStorage`), seat count increments, button changes to “مُسجّل — إلغاء”, success toast shown.
1. To cancel: clicks “مُسجّل — إلغاء” → confirmation modal → confirms → enrollment removed, seat count decrements, cancellation toast shown.
1. Alternatively, clicks “تفاصيل” → info modal with full description and stats (no state change).

### 12.3 Student Browsing & Participating in Chat

1. Navigates to “غرف النقاش” (Chat Rooms).
1. Default room “الغرفة العامة” (General) is active, showing seeded messages.
1. Clicks another room (e.g., “كلية الهندسة”) → room switches, header and message stream update to that room’s seeded messages.
1. Types a message and submits → message appears as “me” (using the logged-in username, or “أنت” if not logged in), “someone is typing…” appears, then a random bot persona posts a canned reply after ~1 second. All messages persist to `localStorage`.

### 12.4 Student Asking the AI Assistant

1. On Home page, types a question into the AI assistant input (e.g., “متى الامتحانات؟”).
1. Submits (Enter or button) → question appears in the log as “user”.
1. After ~0.5s, a keyword-matched canned answer appears as “bot” (e.g., exam date info, course registration steps, library location, scholarship deadlines, chat room guidance, or union founding facts) — or a generic “I’ll forward this to support” fallback if no keyword matches.

### 12.5 Student Submitting a Suggestion/Complaint

1. Navigates to “اقترح / تواصل”.
1. Optionally fills name and college, selects message type (Suggestion/Complaint/Activity Idea/Other), writes message (required).
1. Submits → success toast, form resets. (No backend storage currently — needs implementation.)
1. Alternatively, uses the sidebar’s direct contact info (email/phone/Facebook/address) or visits during stated office hours.

### 12.6 Student Registering as a Volunteer

1. Navigates to “تطوع معنا”.
1. Reviews 6 volunteer categories.
1. Fills registration form (name, college+year, phone, preferred area).
1. Submits → success toast, form resets. (No backend storage currently.)

### 12.7 User Logging In

1. Navigates to “الدخول” (Login).
1. Selects a role (Student/Teacher/Admin) — visual only, no behavioral branching currently.
1. Enters registration number/university email and password (≥4 chars).
1. Submits → username extracted and stored locally, success toast (“simulated login”), redirected to Home. No real session is created; role selection has no effect.

### 12.8 User Switching Theme

1. Clicks the moon/sun icon in the top bar at any time.
1. Theme toggles between light/dark, persisted to `localStorage`, applies immediately via `data-theme` attribute and CSS variable overrides.

### 12.9 User Browsing the Digital Library

1. Navigates to “المكتبة”.
1. Filters by type (summaries/research/PDF books/recordings) or views all.
1. Reviews resource cards (title, subtitle, rating, download/view count).
1. Clicks the download/play icon → “جاري التحميل…” toast appears (no real file served currently).

### 12.10 User Checking the Activity Planner

1. Navigates to “الأنشطة القادمة”.
1. Default shows the first month (مايو 2026) timeline.
1. Switches month tabs (يونيو/يوليو/أغسطس) or selects “عرض الكل” to see all activities chronologically grouped.

-----

## 13. Platform Modules

1. **Global Shell / Navigation** — top bar, primary nav, footer, modal, toast, theme system.
1. **Home / Dashboard Module** — hero, stats, Leadership Board, news preview, upcoming activities preview, scholarships widget, AI assistant.
1. **About / Institutional History Module** — mission, vision, founding stats, historical timeline.
1. **Members Directory Module** — filterable council member listing.
1. **Colleges / Faculties Directory Module** — faculty listing with stats and content tags.
1. **News & Activities Module** — filterable news/announcement feed.
1. **Training Courses Module** — catalog, filtering, enrollment workflow, seat management, modals.
1. **Activity Planner Module** — month-based event timeline.
1. **Chat Rooms Module** — multi-room messaging with simulated presence/bots.
1. **Services Hub Module** — index/launcher for various student services.
1. **Suggestions / Complaints (Contact) Module** — feedback form + direct contact info.
1. **Volunteer Program Module** — category browser + registration form.
1. **FAQ Module** — accordion-style Q&A.
1. **Digital Library Module** — resource catalog with filtering, ratings, download/playback triggers.
1. **AI Assistant Module** — currently a rule-based keyword-matching responder; likely candidate for real LLM integration.
1. **Authentication / User Roles Module** — currently a non-functional stub (no real accounts, sessions, or role enforcement).
1. **Theming Module** — light/dark mode with persistence.
1. **Notifications Module** — UI affordance present (bell icon + dot), no backing logic.
1. **Search Module** — UI affordance present (icon), no backing logic.
1. **Organizational Structure / Leadership Board Module** — visually distinct (navy/gold) presentation of the union’s real hierarchy (President, Deputies, Executive Offices), directly inspired by the PDF.

Modules 18, 19, and parts of 16 (teacher/admin functionality) are **named but unimplemented** — flagged for clarification.

-----

## 14. Visual Requirements

These requirements are derived from the prototype’s CSS, which represents the authoritative visual reference for the platform’s eventual implementation.

- **Layout system**: A centered container with `max-width: 1200px` and responsive horizontal padding (`clamp(12px, 3vw, 24px)`). Consistent use of CSS Grid for card/tile layouts (2/3/4 column variants, plus an `auto-fill` variant with a 220px minimum column width).
- **Header structure**: Two stacked sticky bars — a primary “topbar” (gradient brand-900→brand-700, 56px tall) containing branding and account/utility actions, and a secondary “nav-bar” (solid brand-700) containing the main navigation, sticky immediately below the topbar.
- **Hero section**: Full-width gradient background (a subtle radial accent-colored glow in the top-right combined with the brand diagonal gradient), centered white text, responsive heading size (`clamp(20px, 3vw, 28px)`), and a row of pill-shaped action buttons (one solid/white “primary” button and one translucent “ghost” button).
- **Stats row**: A 4-column card grid that visually overlaps the bottom of the hero section via a negative top margin, creating a “floating cards” effect — each card centers a large bold number above a small label.
- **Leadership Board**: A visually distinct **navy (#0b1f3f) and gold (#d4af37) themed panel**, explicitly described in the CSS as “from PDF” — i.e., intentionally mirroring the PDF deck’s navy/gold leadership slides. Contains:
  - A “president” card with a gold border, gradient inner background, gold-outlined circular avatar (star icon), gold “label” text above a large white “name.”
  - A 2-column grid of “deputy” cards — gold-outlined circular avatars with initials, centered text.
  - A “section title” (“المكاتب التنفيذية”) in gold with an icon.
  - A 3-column grid of “office” cards — each a horizontal row with a gold-tinted icon box, name, and role/portfolio label; hover state adds a gold border and subtle gold background tint.
- **Card system**: A base `.card` style (white/surface background, subtle border, soft shadow, rounded corners ~14px) with a `.hoverable` modifier that lifts the card (translateY + stronger shadow + border color shift) on hover.
- **Badges/Chips**: Pill-shaped small labels in 7 semantic color pairs (blue/green/amber/teal/red/violet/muted), each with a background and foreground color tuned for both light and dark themes — used for news categories, library resource types, course meta info, and filter chips (chips have an additional “is-active” state with a blue background/border).
- **Member cards**: Centered layout with a large circular gradient avatar (brand-700→brand-500) showing two-letter initials, name, role (brand-colored), department/year (muted), and a row of small circular social-icon links.
- **Faculty/College cards**: Horizontal header (icon box + name/count) followed by a wrapped row of small “tag” pills indicating available content types.
- **Course cards**: A colored/gradient “cover” banner (4 alternate gradient palettes plus the default brand gradient) with a large centered icon, followed by a body containing title, description, meta badges (instructor/duration/level), a meta row (enrollment fraction/percentage + availability status), and two side-by-side CTA buttons.
- **Chat UI**: Two-pane grid (260px sidebar + flexible main area, minimum height 520px). Sidebar room items show an icon box, name, description, and an online-count pill (green badge). Main pane has a header (icon + name/description/online count), a scrollable message area with rounded “bubble” messages — “them” bubbles are white/surface with a small top-left corner notch, “me” bubbles are brand-colored with a top-right corner notch — plus a typing indicator row and an input+send-button footer.
- **AI Assistant card**: A soft gradient (brand-50→brand-100) card with a circular gradient avatar (robot icon), heading + description text, an input+button row, and a scrollable log area styled similarly to chat bubbles but in blue/neutral tones for user/bot distinction.
- **Login**: A centered card (max-width 400px) with a 3-column role-selector button row (icon + label, with a selected state highlighted in brand-100), standard labeled form inputs, and a full-width primary submit button.
- **Modal**: Centered overlay dialog with a blurred dark backdrop, header (title + close button), scrollable body, and a footer for action buttons.
- **Toast**: Bottom-center floating pill notification with fade/slide transition.
- **Footer**: Dark brand-900 background, 3-column grid (1.5fr/1fr/1fr) collapsing to 2 then 1 columns on smaller screens, with a centered legal/copyright bar below.
- **Timeline component**: A vertical line with circular markers, used for both the “About” page’s historical timeline and the “Planner” page’s activity timeline — each entry shows a bold “year/date” label, a title, and a description.
- **FAQ accordion**: Each item is a full-width button (question text + chevron icon) that expands a hidden answer panel below it; the chevron rotates 180° when open; only one item can be open at a time.
- **Motion**: Subtle fade-in on page transitions (0.25s), hover lift transforms on cards/tiles, and smooth color/background transitions on interactive elements — all governed by a single `--transition` token and fully disabled under `prefers-reduced-motion: reduce`.

-----

## 15. Branding Requirements

### 15.1 Color Palette (from CSS design tokens)

**Brand (primary) colors:**

- `--brand-900: #0c447c` (deep blue — used for primary text accents, gradients, theme-color meta tag)
- `--brand-700: #185fa5` (used for nav bar, buttons, links)
- `--brand-500: #2a7dc8` (used for focus rings, hover accents)
- `--brand-100: #e6f1fb` / `--brand-50: #f3f8fd` (light blue tints for backgrounds/badges)

**Accent color:**

- `--accent: #ef9f27` (warm orange/amber — used sparingly for the hero’s radial glow and the notification dot)

**Leadership Board palette (navy & gold — explicitly sourced from the PDF’s visual style):**

- Navy backgrounds: `#0b1f3f`, `#142b52`
- Gold accent: `#d4af37`
- Off-white text: `#f4f1e8`

**Semantic/category colors** (each with light-mode bg/fg and a corresponding dark-mode override):

- Green (success/completed): `#eaf3de` / `#27500a`
- Amber (warnings/urgent context elsewhere): `#faeeda` / `#633806`
- Teal (informational/recordings): `#e1f5ee` / `#085041`
- Red (alerts/blood donation): `#fcebeb` / `#791f1f`
- Violet (events/exhibitions): `#ece6fb` / `#3a228a`

**Neutral/surface tokens**: separate light and dark sets for background, surface, surface-2/3, text, text-secondary, text-muted, border, border-strong.

### 15.2 Typography

- **Primary typeface**: “Cairo” (Google Fonts) — an Arabic-and-Latin variable-weight typeface well-suited to RTL interfaces, loaded at weights 400/500/600/700.
- **Fallback stack**: “Segoe UI”, Tahoma, Arial, sans-serif.
- **Base size**: 14px, line-height 1.55.

### 15.3 Iconography

- Tabler Icons (webfont, v3.10.0) — a comprehensive open-source icon set, used extensively for navigation, categories, badges, and decorative accents throughout the interface.

### 15.4 Logo / Brand Mark Status

- The prototype currently uses a **plain text placeholder** (“U.Z.S.U” in a white rounded box) as the logo mark in the top bar — this is explicitly a placeholder, not a final asset.
- **Two candidate real logos exist** in the supplied materials (see Section 16, Media Inventory), but neither has been integrated into the prototype, and it is unclear which (if either, or some new combination) should be canonical.
- The product name “**ZU Connect**” (Latin script) paired with the Arabic subtitle “**اتحاد طلبة جامعة الزاوية**” appears to be the intended branding for the platform itself, distinct from (but representing) the underlying union organization.

### 15.5 Tone & Voice

- Institutional but warm and student-oriented — formal Arabic register for organizational/structural content (mission, vision, code of ethics, leadership bios), more casual/encouraging tone for service-oriented copy (e.g., AI assistant prompts, volunteer descriptions, toasts using exclamation marks and emoji-adjacent symbols like ✓ and 👍).
- Strong emphasis on **unity, representation, and partnership** language (“صوت الطالب.. شريك في البناء والتطوير”, “يدٌ واحدة.. لمستقبل أفضل”, “صوت الحق والعدالة”).

-----

## 16. Media Inventory

|Asset                                        |Description                                                                                                                                                                                                                                                                                                                                                                                |Likely Intended Usage                                                                                                                                                                                                                        |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|**IMG_0793.JPG**                             |Photograph of Zawia University’s main campus building — a yellow-domed structure with a landscaped circular garden/roundabout, multiple light poles, under a blue sky (edited with a vignette/blur effect at the edges).                                                                                                                                                                   |Visually matches the background image used on the PDF’s title slide. Likely candidate for: hero/background imagery on the About page, Login page background, or a campus-identity image elsewhere. Not currently used in the HTML prototype. |
|**IMG_0792.JPG**                             |“U.Z.S.U” emblem (2015): a circular badge featuring a blue graduation cap (mortarboard with tassel) centered inside a grey laurel-wreath circle, with Arabic text “اتحاد طلبة جامعة الزاوية” below and “U.Z.S.U” lettering near the cap, on a cream/parchment textured background. Credit line “ALHUSAIN ELSHAWISH 2015” appears at the bottom.                                            |An alternate/earlier official emblem of the student union. Candidate logo asset — but conflicts with the PDF’s different logo design (see below) and is not used in the current prototype (which has only a placeholder “U.Z.S.U” text mark).|
|**PDF slide 1 background image**             |A duplicate/near-duplicate of the campus building photo (IMG_0793-style), overlaid with a translucent glass-morphism panel containing the union’s logo, the deck’s title, and the tagline “صوت الطالب.. شريك في البناء والتطوير.”                                                                                                                                                          |Confirms IMG_0793 (or a very similar photo) is the union’s standard “campus identity” image.                                                                                                                                                 |
|**PDF slide 1/15 logo (torch/people emblem)**|A different circular emblem: a constellation/orbit-style ring of dots surrounding a central icon depicting a torch with a flame and two stylized human figures, rendered in teal/green/orange/blue tones against a dark navy background, with overlaid Arabic text (partially obscured in the supplied images, appears to read something referencing the union and possibly “ليبيا”/Libya).|Appears on both the title slide (small, watermark-like) and the closing slide (large, centerpiece). This is a **second, different logo design** from IMG_0792 — a branding conflict (see Section 20).                                        |
|**PDF slide 2 photo**                        |Stock photograph of a diverse group of students walking together on a university walkway/pergola, used alongside the “قوة وهدف الاتحاد العام” (strategic pillars) text.                                                                                                                                                                                                                    |Likely a licensed stock photo, not a unique brand asset — probably should be replaced with real campus/student photography in the final product, or treated as a generic placeholder.                                                        |
|**PDF slides 4, 7–13 avatar placeholders**   |Generic grey “person silhouette” icons used for the President and all 14 Faculty Union Presidents (except possibly differing slightly in style between slide 4 and slides 7–13).                                                                                                                                                                                                           |Indicates that real headshot photography for union leadership is **outstanding** — a content/asset gap, not a design requirement.                                                                                                            |

-----

## 17. Data Requirements

The following entities and relationships are implied by the prototype’s data structures and the PDF’s organizational content. These represent the data model that a real backend (Neon PostgreSQL, per the brief) would need to support — described conceptually, without proposing schema/DDL (per scope constraints).

### 17.1 Core Entities

- **User / Account**: identity, role (student/teacher/admin), display name, college/faculty affiliation, academic year, contact info (email/phone), credentials, avatar.
- **News / Activity Post**: type (news/event/course/urgent/completed), title, body, category badge/color, publish date, view counter.
- **Union Council Member**: name, role/title, category (leadership/committee/representative), affiliated college, academic year, contact links — relates to the broader **Organizational Structure** entity below.
- **Organizational Structure / Leadership**: General Union (President, Deputies, Executive Offices with named portfolios) and, per faculty, a Faculty Union (President + description) — a hierarchical structure mirroring Section 11.
- **College / Faculty**: name, icon/visual identifier, student count, associated content (news/schedules/files/activities tags), relationship to its Faculty Union leadership.
- **Course**: title, description, category, instructor, duration, level, total seats, current enrollment count, cover/visual style.
- **Course Enrollment**: relates a User to a Course, with an enrollment timestamp; drives seat-count and “enrolled/full/available” status.
- **Planner / Activity Event**: month/date, title, description, icon/category — possibly related to News/Activity Posts (overlapping concepts).
- **Chat Room**: name, description, icon, category/affiliation (general vs. per-faculty vs. topic-based), online-presence indicator.
- **Chat Message**: room reference, author (User or system/bot persona), text, timestamp.
- **Library Resource**: type (summary/research/book/recording), title, subtitle (faculty, page count/duration), associated file or media reference, download/view counter, rating.
- **FAQ Entry**: question, answer, possibly category/ordering.
- **Suggestion / Complaint Submission**: submitter name (optional/anonymous-capable), college, type (suggestion/complaint/idea/other), message body, submission timestamp, and presumably a status/response workflow for union staff.
- **Volunteer Registration**: name, college+year, phone, preferred category, registration timestamp, and presumably a status/assignment workflow.
- **Scholarship / Opportunity**: title, deadline, category — currently only 2 hardcoded examples on the Home page.
- **Site/User Preference**: theme (light/dark) — currently per-browser; should likely become per-user if accounts are real.

### 17.2 Relationships

- A **User** belongs to one **College/Faculty** and has one **Role**.
- A **College/Faculty** has one associated **Faculty Union** (with its own President and description), which is part of the overall **Organizational Structure** under the **General Union**.
- A **User** can enroll in many **Courses** (many-to-many via Course Enrollment).
- A **Chat Room** has many **Chat Messages**, each authored by a **User** (or a system/bot persona, in the current simulation).
- A **News/Activity Post** may correspond to a **Planner/Activity Event** (the Home page derives “Upcoming Activities” from Planner data, while “Latest News” comes from a separate News array — whether these should be unified is an open question, see Section 19).
- **Suggestion/Complaint** and **Volunteer Registration** submissions are associated with a submitting **User** (or anonymous, for suggestions) and presumably routed to relevant **Union Council Members** / **Executive Offices** based on type/category.

### 17.3 Data Currently Hardcoded That Will Need to Become Dynamic

NEWS, MEMBERS, COLLEGES, COURSES, PLANNER, LIBRARY, CHAT_ROOMS + SEED_MESSAGES, OFFICES, FAQ, BOT_RESPONSES, AI_KNOWLEDGE, the historical timeline, and the Home page’s scholarship list are all currently static JavaScript arrays/objects embedded in the prototype. In a real implementation, most or all of these would be expected to come from a database and be manageable (likely by an admin role — see Section 19).

-----

## 18. Assumptions

The following assumptions are made in interpreting the supplied materials. Each should be validated with the project owner (see Section 19).

1. The HTML prototype (`zu_connect_v2.html`) represents the **authoritative visual/UX/layout reference** for the final platform — i.e., “the final desired design and user experience” referenced in the task brief — while the PDF informs **organizational content, branding cues (navy/gold leadership theme), and institutional context**, not page layout.
1. The prototype’s content arrays (news, courses, library, chat seeds, FAQ, members, colleges, planner, offices) are **demo/placeholder data** illustrating structure and volume, not final content to ship as-is.
1. The “12 كلية ومعهد” figure used throughout the prototype (stats, About page, Colleges page) is **outdated or placeholder** relative to the PDF’s authoritative “14 faculties” organizational chart, and likely originates from the prototype’s own “2019: expansion to 12 colleges” timeline entry — i.e., it may reflect the union’s structure *as of 2019*, not its current 14-faculty structure.
1. The login/role system (student/teacher/admin) is a **planned feature whose detailed requirements have not yet been specified** — the prototype only establishes that three roles should exist and provides a visual selector.
1. The “AI Assistant” is intended to eventually be a **real AI-backed assistant** (the development environment includes Anthropic API access for artifacts, suggesting this is technically feasible), replacing the current regex/keyword-matching stub — but this is an inference, not a stated requirement.
1. The “Chat Rooms” feature is intended to become **genuine multi-user, real-time (or near-real-time) chat**, requiring backend infrastructure beyond what `localStorage` + simulated bots can provide.
1. “**ZU Connect**” is the working product/brand name for the platform itself; “**اتحاد طلبة جامعة الزاوية**” / “**U.Z.S.U**” refers to the underlying organization the platform serves.
1. The two distinct logo assets (the 2015 graduation-cap-and-wreath emblem, and the PDF’s torch/people emblem) represent either (a) historical vs. current branding, or (b) the union’s general logo vs. a campaign-specific logo for this particular organizational guide — and that **one canonical logo (possibly a new one) will need to be selected or designed** for ZU Connect.
1. The campus building photograph (IMG_0793.JPG) is intended for **general campus-identity branding** (e.g., About page, Login background, hero imagery) given its prominent use as the PDF’s title-slide background.
1. Per the task brief’s deployment context, the eventual implementation will use **GitHub** (source control), **Render** (hosting), and **Neon PostgreSQL** (database) — and the current `localStorage`-based persistence is a **temporary prototyping convenience** to be fully replaced.
1. The “Services” page tiles that currently link nowhere (Download Forms, Attendance Certificates, Event QR Check-in, Campus Map, E-Voting) represent **future-phase features** whose detailed requirements are not yet defined, rather than features that were simply forgotten to be wired up.
1. The Home page’s “Scholarships & Opportunities” widget (currently 2 hardcoded entries) is conceptually similar to News/Planner content and may eventually be a filterable category within News rather than its own entity — but this is unconfirmed.

-----

## 19. Risks

1. **Organizational data mismatch (high impact)**: The platform’s stats and Colleges page claim “12 colleges/institutes,” while the PDF — the union’s own official organizational guide — documents **14 faculties** with their own union leadership. Shipping the platform with the 12-college taxonomy would misrepresent the union’s actual structure and could undermine the “comprehensive representation” pillar that is central to the union’s stated mission. This needs resolution before content population.
1. **Unverified leadership data**: The prototype names a President, 2 Deputies, and 12 Executive Office holders with specific portfolios — none of the Deputies or Office holders are corroborated by the supplied PDF (which lists only 4 generic, unnamed executive roles). If these names are inaccurate or outdated, publishing them could cause real reputational/organizational issues for the union (these are real people’s names being displayed in a leadership context).
1. **Internal contradiction in the prototype itself**: The Members directory page names a different person (“محمد العماري”) as “رئيس الاتحاد” (Union President) than the Home page’s Leadership Board (“محمد وسام الفراح”). If both pages ship as-is, the platform would present **two different presidents** to users — a serious credibility issue for an institutional platform.
1. **No real-time chat infrastructure**: The “online” presence counts, message persistence, and bot replies are entirely client-side/simulated. Building genuine multi-user chat across 7+ rooms (with potentially hundreds of concurrent students) is a non-trivial backend undertaking (real-time transport, presence, moderation, abuse prevention) that is currently unscoped.
1. **AI Assistant scope/accuracy**: If the AI assistant becomes a real LLM-backed feature, it risks providing inaccurate information about time-sensitive matters (exam dates, scholarship deadlines, course availability) unless connected to live, accurate data sources — and needs a content-moderation strategy for an Arabic-speaking student audience.
1. **No authentication/authorization**: Without real auth, none of the “personalized” features (enrollments, chat identity, suggestion/volunteer submissions tied to a person, role-based access for teacher/admin) can function correctly or securely. This is foundational and blocks several other modules.
1. **Undefined admin/CMS layer**: Virtually all content (news, courses, library, FAQ, planner, members, colleges, leadership, chat seed content) is currently hardcoded. Without a content-management capability, every content update would require a code change/deployment — likely not the intent for an active student organization that needs to post timely news/announcements.
1. **Missing real assets**: Real photographs for the President, both Deputies (if confirmed), all Executive Office holders, and 13 of 14 Faculty Union Presidents are not available (only generic silhouettes in the PDF). This is a content-readiness risk for the Members/Leadership/Colleges sections.
1. **Branding ambiguity**: Two different logo designs exist with no clear canonical choice; shipping without resolving this could lead to inconsistent identity across the platform, marketing materials, and the union’s existing Facebook/website presence (referenced but not detailed in the PDF’s closing slide).
1. **Localization/rendering risk**: Arabic-Indic numeral formatting (`toLocaleString("ar-EG")`) and general RTL rendering have been sources of bugs in related prior projects; careful QA is warranted, especially across the dark theme and various font-loading scenarios.
1. **External CDN dependencies**: Google Fonts and the Tabler Icons CDN are external dependencies; if unavailable (network restrictions, outages), the platform’s typography and iconography would degrade. Self-hosting may be warranted for reliability in the target region.
1. **Unscoped “Services” features**: E-voting, campus map, event QR check-in, attendance certificates, and form downloads are presented to users as available services (via tiles) but have no defined functionality — risk of user confusion/frustration if shipped as dead links, or scope creep if hastily implemented without requirements.
1. **Data model ambiguity between “News” and “Planner”**: Both seem to represent “things happening,” with the Home page’s “Upcoming Activities” sourced from Planner while “Latest News” is sourced from a separate News array — potential duplication or inconsistency if not reconciled in the data model.

-----

## 20. Conflicts Found

1. **Faculty/College count and taxonomy** — *(Critical)*
- **PDF (authoritative org chart)**: 14 faculties, explicitly enumerated and each with its own “Faculty Union” leadership (Section 11.4).
- **Prototype (Home stats, About page, Colleges page)**: “12 كلية ومعهد” (12 colleges/institutes), with a **different list of 12 names** that does not map 1:1 onto the PDF’s 14:
  - Prototype includes **الزراعة (Agriculture)** and **المعهد العالي للتقنية (Higher Institute of Technology)**, which do **not appear** in the PDF’s 14-faculty list.
  - PDF separately lists **كلية الهندسة** and **كلية هندسة النفط والغاز** as two faculties; the prototype merges these into a single “الهندسة والتقنية” (Engineering & Technology) entry.
  - PDF’s **كلية تقنية المعلومات** (Information Technology) vs. prototype’s **الحاسوب والمعلوماتية** (Computer Science & Informatics) — likely the same faculty under different naming, but not confirmed.
  - PDF’s separate **كلية الصيدلة**, **كلية التقنية الطبية**, **كلية طب وجراحة الفم والأسنان**, **كلية اللغات والترجمة**, and **كلية التربية البدنية وعلوم الرياضة** have **no clear counterparts** in the prototype’s 12-college list.
1. **Union President identity** — *(Critical)*
- **Home page Leadership Board**: محمد وسام الفراح is “رئيس الاتحاد العام” (matches the PDF).
- **Members Directory page**: محمد العماري is listed with role “رئيس الاتحاد” (President), a *different person*, with a *different* department/year (“كلية الهندسة - السنة الخامسة”).
- These two pages of the **same prototype** present two different individuals as “the President” — an internal contradiction independent of the PDF.
1. **Logo / brand mark**
- **IMG_0792.JPG**: 2015-dated graduation-cap-in-wreath emblem, “U.Z.S.U” lettering, credited to a named designer.
- **PDF (slides 1 & 15)**: a visually distinct torch/people circular emblem with different iconography and color treatment.
- **Prototype**: uses neither — only a plain placeholder text badge reading “U.Z.S.U.”
- No guidance exists on which (if either) is the canonical current logo, or whether a new unified mark is expected.
1. **Leadership names not corroborated**
- The prototype names a First Deputy (مالك علي كشلاف), Second Deputy (عبد المجيد محمد الحمري), and 12 specifically-titled Executive Office holders (Section 11.3) — **none of these appear in the supplied PDF**, which shows only 4 generic, unnamed executive roles (Vice President, Secretary, Academic Affairs Officer, Student Activities Officer). The source/accuracy of the prototype’s specific names is unverifiable from the supplied materials.
1. **“News” vs. “Planner” overlap**
- Both data sets describe time-bound activities/events (e.g., tournaments, ceremonies, campaigns), but are modeled as two separate arrays (`NEWS` with `type` values including “event”/“course”/“completed”, vs. `PLANNER` organized by month). The Home page draws “Latest News” from `NEWS` and “Upcoming Activities” from `PLANNER` — it’s unclear whether these should be unified, cross-referenced, or remain genuinely distinct content types.

-----

## 21. Missing Information

The following information is **not present** in any supplied file and would be needed before/during implementation:

1. Real identities and photographs for: both Deputy Presidents (if confirmed as real roles), the 4 generic Executive Office holders described in the PDF (Secretary, Academic Affairs Officer, Student Activities Officer, and the Vice President role — noting overlap with “Deputy”), and 13 of the 14 Faculty Union Presidents (only Dentistry’s — حسام الدين شقلابو — is named).
1. A final, vector-format logo/brand mark and any formal brand guidelines (typography pairing rules, logo usage/clear-space rules, color usage beyond the CSS tokens already captured).
1. Real (non-placeholder) content for: news items, training courses, library resources, FAQ entries, planner/activity events, and scholarship/opportunity listings.
1. Detailed functional requirements for the **Teacher** and **Admin** roles — currently only named, with no defined capabilities, dashboards, or permissions.
1. Authentication requirements: Is login tied to an existing university system (e.g., student information system / SSO)? What is the format of “رقم القيد” (registration number)? Is email verification required? Password policy?
1. Real-time chat requirements: expected concurrency, moderation policy, message retention, whether “online” presence should be real, whether messages should be persisted server-side and for how long.
1. AI Assistant requirements: should it remain rule-based, or be LLM-backed? If LLM-backed, what knowledge sources should it draw from (and how should those be kept current — e.g., exam schedules, scholarship deadlines)? What guardrails are needed for an Arabic-speaking student audience?
1. Notification system requirements: what events trigger notifications (new news post, chat mention, suggestion response, course seat availability, etc.), and via what channel (in-app only, email, push)?
1. Search functionality scope: what content should be searchable (news, courses, library, members, FAQ, all of the above)?
1. Detailed requirements for the unscoped Services tiles: E-Voting (التصويت الإلكتروني — eligibility, ballot design, result transparency), Campus Map (خريطة الجامعة — interactive vs. static, data source), Event QR Check-in (التسجيل عبر QR — generation/scanning flow), Attendance Certificates (شهادات حضور — generation/template/verification), Downloadable Forms (تحميل النماذج — which forms, source/owner).
1. Verification of the contact details shown (email `union@zu.edu.ly`, phone `+218 23 762 0000`, Facebook page name, office address/hours) — are these the union’s real current contact channels?
1. The relationship between ZU Connect and the union’s existing official website and Facebook page referenced in the PDF’s closing slide (are these to be linked, merged, replaced, or run in parallel?).
1. Multi-language requirements — confirm Arabic-only is sufficient, or whether an English (or other) version is needed for international students/partners (the PDF references international scholarship partnerships with Turkey, Tunisia, and Morocco).
1. Moderation/workflow requirements for Suggestions/Complaints and Volunteer registrations — who receives these, how are they tracked/responded to, and is there a status visible to the submitter?
1. Whether the “12 colleges” figure and the “14 faculties” figure can be reconciled into a single authoritative list, and if so, what that list is (see Conflict #1).
1. Resolution of the “two presidents” contradiction (Conflict #2) — which name is correct, and should the Members Directory data be corrected accordingly?
1. A decision on canonical branding (Conflict #3) — which logo, or a new design, and how it integrates with the existing “ZU Connect” wordmark and U.Z.S.U placeholder mark.

-----

## 22. Questions For The Owner

1. The PDF documents **14 faculties** with their own Faculty Unions, but the prototype’s stats, About page, and Colleges page reference **“12 colleges and institutes.”** Which figure (and which list of names) is currently accurate, and should the platform be built around the 14-faculty structure from the PDF?
1. The Home page names **محمد وسام الفراح** as the Union President (matching the PDF), but the Members Directory page names a different person, **محمد العماري**, as “رئيس الاتحاد.” Which is correct, and should the Members Directory content be corrected?
1. Are the names listed for the **two Deputy Presidents** (مالك علي كشلاف, عبد المجيد محمد الحمري) and the **12 Executive Office holders** (Section 11.3) accurate and current? If so, can corresponding photographs and contact details be provided?
1. The PDF lists only **4 generic Executive Office roles** (Vice President, Secretary, Academic Affairs Officer, Student Activities Officer), all unnamed. How does this 4-role structure relate to the prototype’s **12 named, more granular offices**? Has the union’s executive structure expanded/changed since the PDF was produced?
1. For the **14 Faculty Union Presidents**, only the Dentistry faculty’s president (حسام الدين شقلابو) is named in the PDF. Can the names and photographs for the remaining 13 be provided, or should the platform launch with these positions marked “to be announced”?
1. There are **two visually distinct union logos** in the supplied materials (the 2015 graduation-cap-and-wreath emblem, and the PDF’s torch/people emblem). Which is the current official logo — or is a new logo planned for ZU Connect specifically? Can a high-resolution/vector source file be provided?
1. Is **“ZU Connect”** the confirmed final product name, and is the relationship to “اتحاد طلبة جامعة الزاوية” / “U.Z.S.U” (i.e., platform name vs. organization name) correct as understood?
1. What should the **Teacher (أستاذ)** role be able to do on the platform? (e.g., post news, manage course content, view but not edit, etc.)
1. What should the **Admin (إدارة)** role be able to do? Is a full content-management back-office expected (managing news, courses, library, FAQ, planner, members, leadership board, chat moderation), or is admin scope narrower?
1. How should **authentication** work — is there an existing university student-information system or SSO to integrate with, or should ZU Connect manage its own accounts? What is the expected format of “رقم القيد” (student registration number)?
1. Should **Chat Rooms** become real multi-user, real-time chat? If so, are there constraints on infrastructure (e.g., must everything run on Render + Neon, or can a third-party real-time service be used)?
1. Should the **AI Assistant** remain a simple rule-based FAQ matcher, or become a genuine AI-backed assistant? If the latter, what information should it have access to, and how should time-sensitive info (exam dates, deadlines) be kept accurate?
1. For the unscoped **Services tiles** (Download Forms, Attendance Certificates, Event QR Check-in, Campus Map, E-Voting) — are these in scope for an initial version, or future phases? If in scope, can requirements be provided for each?
1. Are the contact details shown in the prototype (`union@zu.edu.ly`, `+218 23 762 0000`, Facebook page name, office address/hours) the union’s actual, current contact information to be used in production?
1. Does the union have an **existing website and/or Facebook page** (referenced in the PDF’s closing slide) that ZU Connect should link to, replace, or be integrated with?
1. Is **Arabic-only** the confirmed language scope, or should the platform support additional languages (e.g., for the international scholarship partners mentioned in the PDF — Turkey, Tunisia, Morocco)?
1. Who should receive and how should the union respond to **Suggestions/Complaints** and **Volunteer registrations** submitted through the platform? Is a tracking/status system expected for submitters?
1. Should **“News”** and **“Activity Planner”** remain separate content types, or be unified into a single “events/posts” model with different views/filters?
1. What is the source and refresh cadence for **statistics** shown on the platform (e.g., “5,240 طالب مسجل”, “320 ملف في المكتبة”, “48 نشاط هذا العام”) — should these be computed dynamically from real data once available, or remain editable figures?
1. Is there a target **launch timeline or phased rollout plan** (e.g., MVP with static content first, vs. full dynamic platform from day one) that should inform how this understanding is translated into an implementation roadmap?

-----

## 23. Final Architectural Understanding

**ZU Connect** is envisioned as the official digital platform of the **General Union of Zawia University Students**, serving a community of roughly 5,000+ students across what should likely be **14 faculties** (per the union’s own organizational guide, though the existing prototype currently reflects an older “12 colleges” framing that needs reconciliation). The platform’s identity is Arabic-first and RTL, built around the “Cairo” typeface and Tabler iconography, with a cohesive light/dark theming system based on a blue-and-white “brand” palette (deep blue #0c447c through light blue #e6f1fb) accented by warm orange (#ef9f27), plus a special **navy-and-gold (#0b1f3f / #d4af37) visual treatment reserved specifically for the union’s Leadership Board** — a deliberate echo of the PDF organizational guide’s own navy/gold leadership slides, signaling that this section of the platform carries particular institutional weight.

Structurally, the platform is a single-page application with **14 top-level sections** reachable via a sticky two-tier header (branding/utilities bar + scrollable navigation bar) and reinforced by a footer with quick links and contact information. The **Home page** acts as a dashboard: a welcoming hero, headline stats, the navy/gold **Leadership Board** (President → Deputies → grid of Executive Offices, mirroring the PDF’s General-Union → Executive-Offices → Faculty-Unions hierarchy), a preview of the latest news, a preview of upcoming activities and scholarship opportunities, and an AI assistant for quick self-service answers.

Beyond the Home page, the platform organizes into three broad functional groupings: **(1) Institutional/representation content** — About/History (mission, vision 2030, founding timeline), Members Directory (filterable by leadership/committees/representatives), and Colleges/Faculties (directory of the 14 faculties, each ideally linked to its own Faculty Union leadership profile per the PDF); **(2) Student services and community** — News & Activities feed, Training Courses (with enrollment workflow, seat tracking, and modal-based confirmations), Activity Planner (month-organized event timeline), Chat Rooms (per-faculty and topical discussion spaces), Digital Library (categorized academic resources with ratings and download/playback), and a Services hub indexing these plus additional planned-but-unscoped services (forms, certificates, QR check-in, campus map, e-voting); and **(3) Feedback and participation channels** — a Suggestions/Complaints form fulfilling the union’s “voice of truth and justice” mandate (paired with direct contact info and office hours), and a Volunteer program across six categories of civic/campus engagement.

A **Login page** establishes the concept of three user roles — Student, Teacher, and Admin — but currently only the visual selector exists; the actual authentication mechanism, session handling, and (critically) the **distinct capabilities of the Teacher and Admin roles** remain entirely undefined and represent one of the largest open areas for the next planning iteration. Similarly, nearly all platform content (news, courses, library items, FAQ, planner events, member/leadership records, chat seed data) is currently static demo data embedded in the front-end; a production system will need a data layer (per the brief, Neon PostgreSQL) and, almost certainly, an administrative content-management capability to keep this content current — since the union’s mission depends on timely communication (urgent exam announcements, scholarship deadlines, election notices, etc.).

The most significant **content-integrity issues** to resolve before building out real data are: reconciling the “12 colleges” vs. “14 faculties” discrepancy (and the differing name lists between the two); resolving the contradictory identification of the Union President across two pages of the prototype (محمد وسام الفراح vs. محمد العماري); verifying the accuracy of the named Deputies and 12 Executive Office holders against the PDF’s more conservative (4 generic, unnamed roles) structure; sourcing real names/photos for 13 of 14 Faculty Union Presidents; and selecting a single canonical logo from among the two distinct emblems supplied (the 2015 graduation-cap-and-wreath “U.Z.S.U” mark and the PDF’s torch/people emblem), neither of which is currently used in the prototype’s placeholder branding.

Functionally, the two modules requiring the most architectural investment beyond a standard content+CRUD platform are **Chat Rooms** (currently a fully client-side, single-user simulation with seeded messages and randomized bot replies — a real implementation needs genuine multi-user real-time messaging, presence, and moderation across at least 7 rooms) and the **AI Assistant** (currently a 6-rule keyword matcher — a real implementation may warrant LLM-backed responses, with careful grounding in accurate, time-sensitive university information).

In summary, the **visual design, component library, page inventory, and navigation model are well-specified** by the prototype and ready to guide implementation. What is **not yet specified** — and forms the basis of the open questions in Section 22 — is: (a) the authoritative organizational/content data (faculty list, leadership names, branding), (b) the real data model and admin/CMS capabilities behind every content module, (c) the authentication system and the Teacher/Admin role definitions, and (d) the technical approach for the two “live” features (Chat, AI Assistant). A development team should treat this document as the basis for a follow-up requirements/clarification round (Section 22) before committing to a data schema or implementation plan.