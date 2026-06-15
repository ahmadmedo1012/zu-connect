import { db, pool } from "./index";
import { eq, sql } from "drizzle-orm";
import {
  newsTable,
  coursesTable,
  membersTable,
  collegesTable,
  libraryTable,
  plannerTable,
  chatRoomsTable,
  faqTable,
  leadershipTable,
  usersTable,
  adminRolesTable,
  adminUsersTable,
  telegramEventMappingsTable,
  systemSettingsTable,
} from "./schema";

async function seed() {
  console.log("Seeding database...");

  await db.insert(newsTable).values([
    { title: "انطلاق أسبوع الطالب الجامعي", body: "تنطلق فعاليات أسبوع الطالب الجامعي لهذا العام تحت شعار 'يد واحدة لمستقبل أفضل'، وتتضمن محاضرات وورش عمل ومسابقات ثقافية.", category: "أخبار", date: "15 يونيو 2026", viewCount: 156 },
    { title: "جدول الامتحانات النهائية للفصل الدراسي الثاني", body: "تم اعتماد جدول الامتحانات النهائية للفصل الدراسي الثاني 2025-2026. يرجى مراجعة كلياتكم لمعرفة الجداول التفصيلية.", category: "عاجل", date: "10 يونيو 2026", viewCount: 423 },
    { title: "دورة برمجة مجانية بالتعاون مع شركة تقنية", body: "يعلن الاتحاد عن تنظيم دورة برمجة مجانية بالتعاون مع إحدى شركات التقنية. الدورة تشمل أساسيات Python وتطبيقاتها.", category: "دورات", date: "5 يونيو 2026", viewCount: 89 },
    { title: "معرض مشاريع الطلاب 2026", body: "شهدت كلية الهندسة والتقنية معرض مشاريع الطلاب السنوي بمشاركة 50 مشروعاً مبتكراً في مختلف المجالات الهندسية.", category: "فعاليات", date: "1 يونيو 2026", viewCount: 234 },
    { title: "ختام بطولة الشطرنج على مستوى الجامعة", body: "اختتمت بطولة الشطرنج الجامعية بمشاركة 40 طالباً من مختلف الكليات. حصد المركز الأول الطالب أحمد المجري.", category: "أنشطة منجزة", date: "25 مايو 2026", viewCount: 67 },
    { title: "اتفاقية تعاون مع جامعة طرابلس", body: "وقع الاتحاد العام اتفاقية تعاون مع جامعة طرابلس لتعزيز التبادل الطلابي والأنشطة المشتركة.", category: "أخبار", date: "20 مايو 2026", viewCount: 112 },
    { title: "حملة التبرع بالدم", body: "نظم الاتحاد حملة للتبرع بالدم بالتعاون مع المركز الوطني لنقل الدم، بمشاركة أكثر من 200 طالب.", category: "أنشطة منجزة", date: "15 مايو 2026", viewCount: 198 },
  ]);

  await db.insert(coursesTable).values([
    { title: "مقدمة في تطوير الويب", description: "دورة شاملة في أساسيات تطوير الويب باستخدام HTML, CSS, JavaScript", instructor: "أ. محمد سالم", duration: "4 أسابيع", level: "مبتدئ", category: "تقنية وبرمجة", totalSeats: 30, enrolledCount: 12, colorScheme: 0 },
    { title: "الذكاء الاصطناعي للمبتدئين", description: "تعلم أساسيات الذكاء الاصطناعي وتعلم الآلة مع تطبيقات عملية", instructor: "د. علياء النعيمي", duration: "5 أسابيع", level: "مبتدئ", category: "تقنية وبرمجة", totalSeats: 25, enrolledCount: 8, colorScheme: 1 },
    { title: "الإنجليزية للأغراض الأكاديمية", description: "دورة مكثفة لتحسين مهارات اللغة الإنجليزية الأكاديمية", instructor: "أ. سارة العماري", duration: "6 أسابيع", level: "متوسط", category: "لغات", totalSeats: 35, enrolledCount: 20, colorScheme: 2 },
    { title: "مهارات العرض والتقديم", description: "طور مهاراتك في التحدث أمام الجمهور والعرض الفعال", instructor: "د. خالد الزروق", duration: "3 أسابيع", level: "متوسط", category: "مهارات شخصية", totalSeats: 20, enrolledCount: 5, colorScheme: 3 },
    { title: "إدارة المشاريع الصغيرة", description: "تعلم أساسيات إدارة المشاريع بدءاً من التخطيط وحتى التنفيذ", instructor: "أ. نور البشير", duration: "4 أسابيع", level: "متقدم", category: "إدارة وأعمال", totalSeats: 20, enrolledCount: 15, colorScheme: 4 },
    { title: "قواعد البيانات SQL", description: "دورة عملية في تصميم وإدارة قواعد البيانات باستخدام SQL", instructor: "م. هشام المنصوري", duration: "5 أسابيع", level: "متوسط", category: "تقنية وبرمجة", totalSeats: 25, enrolledCount: 3, colorScheme: 5 },
    { title: "فن التحدث أمام الجمهور", description: "تغلب على رهبة المسرح وكن متحدثاً واثقاً", instructor: "أ. ليلى الرويمي", duration: "3 أسابيع", level: "مبتدئ", category: "مهارات شخصية", totalSeats: 30, enrolledCount: 22, colorScheme: 6 },
    { title: "كتابة السيرة الذاتية", description: "تعلم كيفية كتابة سيرة ذاتية احترافية تجذب انتباه أصحاب العمل", instructor: "أ. يوسف الشريف", duration: "أسبوعان", level: "مبتدئ", category: "مهارات شخصية", totalSeats: 40, enrolledCount: 10, colorScheme: 7 },
    { title: "اللغة التركية - مستوى أول", description: "دورة تمهيدية في اللغة التركية للمبتدئين", instructor: "أ. فاطمة الخليفي", duration: "6 أسابيع", level: "مبتدئ", category: "لغات", totalSeats: 30, enrolledCount: 18, colorScheme: 8 },
  ]);

  await db.insert(membersTable).values([
    { name: "محمد العماري", role: "رئيس الاتحاد", department: "كلية الهندسة", year: "السنة الرابعة", category: "القيادة التنفيذية", initials: "م.ع" },
    { name: "سارة الأحمدي", role: "نائب الرئيس", department: "كلية الطب", year: "السنة الثالثة", category: "القيادة التنفيذية", initials: "س.ا" },
    { name: "عبدالله المنصوري", role: "الأمين العام", department: "كلية القانون", year: "السنة الرابعة", category: "القيادة التنفيذية", initials: "ع.م" },
    { name: "فاطمة الخليفي", role: "أمين الصندوق", department: "كلية الاقتصاد", year: "السنة الثالثة", category: "القيادة التنفيذية", initials: "ف.خ" },
    { name: "يوسف الشريف", role: "رئيس اللجنة الثقافية", department: "كلية الآداب", year: "السنة الثانية", category: "رؤساء اللجان", initials: "ي.ش" },
    { name: "ليلى الرويمي", role: "رئيس لجنة الأنشطة", department: "كلية التربية", year: "السنة الثالثة", category: "رؤساء اللجان", initials: "ل.ر" },
    { name: "خالد الزروق", role: "رئيس اللجنة التقنية", department: "كلية الحاسوب", year: "السنة الرابعة", category: "رؤساء اللجان", initials: "خ.ز" },
    { name: "نور البشير", role: "رئيس لجنة العلاقات", department: "كلية الإعلام", year: "السنة الثالثة", category: "رؤساء اللجان", initials: "ن.ب" },
    { name: "أحمد الجبالي", role: "ممثل كلية الهندسة", department: "كلية الهندسة والتقنية", year: "السنة الثالثة", category: "ممثلو الكليات", initials: "أ.ج" },
    { name: "رنا العامري", role: "ممثلة كلية الطب", department: "كلية الطب البشري", year: "السنة الثانية", category: "ممثلو الكليات", initials: "ر.ع" },
    { name: "سالم القاضي", role: "ممثل كلية القانون", department: "كلية القانون والعلوم السياسية", year: "السنة الثالثة", category: "ممثلو الكليات", initials: "س.ق" },
    { name: "هدى المهدي", role: "ممثلة كلية الصيدلة", department: "كلية الصيدلة", year: "السنة الثانية", category: "ممثلو الكليات", initials: "ه.م" },
  ]);

  await db.insert(collegesTable).values([
    { name: "كلية الهندسة والتقنية", studentCount: 850, hasNews: true, hasSchedules: true, hasFiles: true, hasActivities: true, icon: "settings" },
    { name: "كلية الطب البشري", studentCount: 620, hasNews: true, hasSchedules: true, hasFiles: true, hasActivities: false, icon: "heart-pulse" },
    { name: "كلية الصيدلة", studentCount: 350, hasNews: true, hasSchedules: false, hasFiles: true, hasActivities: true, icon: "flask" },
    { name: "كلية القانون والعلوم السياسية", studentCount: 500, hasNews: true, hasSchedules: true, hasFiles: true, hasActivities: true, icon: "scale" },
    { name: "كلية الاقتصاد والأعمال", studentCount: 450, hasNews: false, hasSchedules: true, hasFiles: false, hasActivities: true, icon: "bar-chart" },
    { name: "كلية الحاسوب والمعلوماتية", studentCount: 380, hasNews: true, hasSchedules: true, hasFiles: true, hasActivities: true, icon: "monitor" },
    { name: "كلية العلوم الأساسية", studentCount: 300, hasNews: false, hasSchedules: false, hasFiles: false, hasActivities: false, icon: "atom" },
    { name: "كلية الآداب والإنسانيات", studentCount: 420, hasNews: true, hasSchedules: false, hasFiles: true, hasActivities: true, icon: "book-open" },
    { name: "كلية التربية", studentCount: 370, hasNews: false, hasSchedules: true, hasFiles: false, hasActivities: true, icon: "graduation-cap" },
    { name: "كلية الإعلام والاتصال", studentCount: 250, hasNews: true, hasSchedules: false, hasFiles: true, hasActivities: false, icon: "radio" },
    { name: "كلية الزراعة", studentCount: 200, hasNews: false, hasSchedules: false, hasFiles: true, hasActivities: true, icon: "sprout" },
    { name: "المعهد العالي للتقنية", studentCount: 300, hasNews: true, hasSchedules: true, hasFiles: true, hasActivities: true, icon: "wrench" },
  ]);

  await db.insert(libraryTable).values([
    { title: "ملخص شامل: الخوارزميات", subtitle: "قسم علوم الحاسوب - 45 صفحة", type: "ملخصات", rating: 4.5, downloadCount: 230, college: "كلية الحاسوب" },
    { title: "القانون التجاري الليبي", subtitle: "كتاب مرجعي - 320 صفحة", type: "كتب PDF", rating: 4.0, downloadCount: 180, college: "كلية القانون" },
    { title: "التنمية الاقتصادية في ليبيا بعد 2011", subtitle: "بحث علمي محكم", type: "بحوث", rating: 3.5, downloadCount: 95, college: "كلية الاقتصاد" },
    { title: "محاضرات الكيمياء العضوية", subtitle: "تسجيلات الفصل الدراسي الأول", type: "تسجيلات", rating: 4.8, downloadCount: 310, college: "كلية الصيدلة" },
    { title: "تشريح الجهاز العصبي", subtitle: "ملخصات كلية الطب - 60 صفحة", type: "ملخصات", rating: 4.7, downloadCount: 420, college: "كلية الطب" },
    { title: "أساسيات إدارة المشاريع", subtitle: "كتاب PDF - 200 صفحة", type: "كتب PDF", rating: 4.2, downloadCount: 150, college: "كلية الهندسة" },
  ]);

  await db.insert(plannerTable).values([
    { title: "بطولة كرة القدم بين الكليات", description: "بطولة رياضية تجمع فرق من مختلف الكليات", date: "15 مايو 2026", month: "مايو 2026", icon: "trophy" },
    { title: "ورشة كتابة البحث العلمي", description: "ورشة تدريبية عن أساسيات كتابة الأبحاث العلمية", date: "20 مايو 2026", month: "مايو 2026", icon: "pen-tool" },
    { title: "حفل تكريم الطلاب المتفوقين", description: "حفل تكريم لأوائل الكليات للفصل الدراسي الأول", date: "5 يونيو 2026", month: "يونيو 2026", icon: "award" },
    { title: "ورشة الذكاء الاصطناعي", description: "ورشة تطبيقية في تقنيات الذكاء الاصطناعي", date: "12 يونيو 2026", month: "يونيو 2026", icon: "cpu" },
    { title: "حملة نظافة الحرم الجامعي", description: "مبادرة تطوعية لنظافة وتجميل الحرم الجامعي", date: "1 يوليو 2026", month: "يوليو 2026", icon: "trash-2" },
    { title: "معرض الكتاب الجامعي", description: "معرض للكتاب بمشاركة دور نشر محلية", date: "10 يوليو 2026", month: "يوليو 2026", icon: "book" },
    { title: "المؤتمر الطلابي الوطني", description: "المؤتمر السنوي للاتحادات الطلابية على المستوى الوطني", date: "5 أغسطس 2026", month: "أغسطس 2026", icon: "users" },
    { title: "بداية برنامج التدريب الصيفي", description: "انطلاق برنامج التدريب الميداني للطلاب", date: "15 أغسطس 2026", month: "أغسطس 2026", icon: "briefcase" },
  ]);

  await db.insert(chatRoomsTable).values([
    { name: "الغرفة العامة", description: "نقاشات عامة بين جميع الطلاب", onlineCount: 42, icon: "message-circle" },
    { name: "كلية الهندسة", description: "نقاشات طلاب كلية الهندسة", onlineCount: 15, icon: "settings" },
    { name: "كلية الطب والصيدلة", description: "نقاشات طلاب كلية الطب والصيدلة", onlineCount: 12, icon: "heart-pulse" },
    { name: "كلية الحاسوب", description: "نقاشات طلاب كلية الحاسوب والمعلوماتية", onlineCount: 18, icon: "monitor" },
    { name: "كلية القانون", description: "نقاشات طلاب كلية القانون والعلوم السياسية", onlineCount: 8, icon: "scale" },
    { name: "الفعاليات والأنشطة", description: "مناقشة الفعاليات والأنشطة الجامعية", onlineCount: 10, icon: "calendar" },
    { name: "المساعدة والدعم", description: "للاستفسارات والمساعدة الفنية", onlineCount: 5, icon: "help-circle" },
  ]);

  await db.insert(faqTable).values([
    { question: "كيف أستطيع تقديم اقتراح أو شكوى؟", answer: "يمكنك تقديم اقتراحك أو شكواك عبر صفحة 'اقترح / تواصل' في القائمة الرئيسية، حيث ستجد نموذجاً لإرسال رسالتك إلى إدارة الاتحاد.", category: "عام" },
    { question: "كيف يمكنني التسجيل في الدورات التدريبية؟", answer: "تصفح الدورات المتاحة في صفحة 'الدورات التدريبية'، ثم اضغط على زر 'تسجيل' للدورة التي ترغب فيها. يمكنك إلغاء التسجيل في أي وقت.", category: "خدمات" },
    { question: "كيف يمكنني الانضمام لفريق التطوع؟", answer: "قم بزيارة صفحة 'تطوع معنا' واملأ نموذج التسجيل. سيتم التواصل معك من قبل فريق التطوع.", category: "خدمات" },
    { question: "أين يمكنني إيجاد الملخصات والمراجع الدراسية؟", answer: "جميع الملخصات والمراجع متاحة في صفحة 'المكتبة' الإلكترونية، ويمكنك تصفحها حسب التخصص ونوع المادة.", category: "خدمات" },
    { question: "كيف أعرف الأنشطة القادمة في الجامعة؟", answer: "يمكنك الاطلاع على جميع الأنشطة القادمة من خلال صفحة 'الأنشطة القادمة' والتي تعرض الفعاليات مرتبة حسب الشهر.", category: "عام" },
    { question: "من هم أعضاء مجلس الاتحاد الحالي؟", answer: "يمكنك التعرف على جميع أعضاء مجلس الاتحاد من خلال صفحة 'أعضاء الاتحاد' التي تعرض القيادة التنفيذية ورؤساء اللجان وممثلي الكليات.", category: "عام" },
    { question: "كيف يمكنني التواصل مع ممثل كليتي؟", answer: "تصفح صفحة 'أعضاء الاتحاد' واختر فئة 'ممثلو الكليات' لتجد معلومات ممثل كليتك وطرق التواصل معه.", category: "خدمات" },
    { question: "هل يمكن للطلاب المشاركة في الانتخابات الطلابية؟", answer: "نعم، يمكن لجميع الطلاب المسجلين المشاركة في الانتخابات الطلابية. سيتم الإعلان عن مواعيد التصويت الإلكتروني عبر صفحة الخدمات.", category: "عام" },
  ]);

  await db.insert(leadershipTable).values([
    { name: "عبد الإله عبد الرؤوف راشد", role: "مكتب شؤون الطلبة" },
    { name: "أنور المقطوف", role: "مكتب العلاقات العامة" },
    { name: "محمد هشام البشكار", role: "مكتب الشؤون الإدارية" },
    { name: "عبد العزيز دخيل", role: "مكتب العضوية" },
    { name: "إسلام غريبي", role: "مكتب الإعلام" },
    { name: "أيهم نصرات", role: "مكتب البرامج والأنشطة" },
    { name: "عبد الكريم يحي", role: "مكتب الشؤون القانونية" },
    { name: "أبرار علي سعيد", role: "مكتب شؤون الطالبات" },
    { name: "عبد الرؤوف الطاهر", role: "مكتب المنظومة والتحول الرقمي" },
    { name: "إبراهيم يوسف ساسي", role: "مكتب الأنشطة الرياضية" },
    { name: "قاسم عبد السلام النمروش", role: "مكتب شؤون الخريجين" },
    { name: "أبوبكر بكير", role: "مكتب المتابعة والتطوير" },
  ]);

  await db.insert(usersTable).values([
    { identifier: "2021001", password: "student123", name: "أحمد الطالب", role: "student" },
    { identifier: "teacher@zu.edu.ly", password: "teacher123", name: "د. محمد المدرس", role: "teacher" },
    { identifier: "admin@zu.edu.ly", password: "admin123", name: "إبراهيم المدير", role: "admin" },
  ]).onConflictDoNothing();

  // Seed admin roles
  await db.insert(adminRolesTable).values([
    {
      name: "super_admin",
      label: "مدير عام",
      level: 100,
      permissions: [
        "admin.view", "admin.users", "admin.roles", "admin.live",
        "admin.moderation", "admin.complaints", "admin.referrals",
        "admin.gamification", "admin.announcements", "admin.files",
        "admin.activity", "admin.analytics", "admin.integrations",
        "admin.telegram", "admin.settings", "admin.audit", "admin.content",
        "admin.content.create", "admin.content.edit", "admin.content.delete",
        "admin.users.ban", "admin.users.edit_role",
        "admin.moderation.resolve", "admin.moderation.escalate",
        "admin.announcements.publish", "admin.settings.system",
        "admin.settings.integrations", "*",
      ],
    },
    {
      name: "admin",
      label: "مدير",
      level: 50,
      permissions: [
        "admin.view", "admin.users", "admin.live",
        "admin.moderation", "admin.complaints", "admin.referrals",
        "admin.gamification", "admin.announcements",
        "admin.activity", "admin.analytics", "admin.content",
        "admin.content.create", "admin.content.edit", "admin.content.delete",
        "admin.users.ban", "admin.moderation.resolve", "admin.moderation.escalate",
        "admin.announcements.publish",
      ],
    },
    {
      name: "moderator",
      label: "مشرف",
      level: 20,
      permissions: [
        "admin.view", "admin.live", "admin.moderation", "admin.complaints",
        "admin.announcements", "admin.activity", "admin.analytics",
        "admin.moderation.resolve", "admin.moderation.escalate",
        "admin.announcements.publish",
      ],
    },
  ]).onConflictDoNothing();

  // Link admin user to super_admin role (upsert: skip if already linked)
  const [adminUser] = await db.select().from(usersTable).where(eq(usersTable.identifier, "admin@zu.edu.ly")).limit(1);
  if (adminUser) {
    const [superAdminRole] = await db.select().from(adminRolesTable).where(eq(adminRolesTable.name, "super_admin")).limit(1);
    if (superAdminRole) {
      const [existingLink] = await db.select().from(adminUsersTable)
        .where(eq(adminUsersTable.userId, adminUser.id)).limit(1);
      if (!existingLink) {
        await db.insert(adminUsersTable).values({
          userId: adminUser.id,
          roleId: superAdminRole.id,
          isActive: true,
        });
      }
    }
  }

  // Seed telegram event mappings
  await db.insert(telegramEventMappingsTable).values([
    { eventType: "new_registration", enabled: true, priority: "normal" },
    { eventType: "new_referral", enabled: true, priority: "normal" },
    { eventType: "referral_rewarded", enabled: true, priority: "high" },
    { eventType: "new_complaint", enabled: false, priority: "normal" },
    { eventType: "new_suggestion", enabled: false, priority: "normal" },
    { eventType: "system_alert", enabled: true, priority: "urgent" },
    { eventType: "announcement_published", enabled: true, priority: "normal" },
  ]).onConflictDoNothing();
  // Seed system settings
  await db.insert(systemSettingsTable).values([
    { key: "site_name", value: JSON.parse('"ZU Connect"'), type: "string", category: "general", description: "اسم المنصة" },
    { key: "maintenance_mode", value: JSON.parse("false"), type: "boolean", category: "general", description: "وضع الصيانة" },
    { key: "max_upload_size", value: JSON.parse("10"), type: "number", category: "features", description: "الحد الأقصى لحجم الرفع (MB)" },
  ]).onConflictDoNothing();

  console.log("Seed complete!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
