import { Router } from "express";
import { db, usersTable, referralsTable } from "@workspace/db";
import { eq, and, sql, count } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

const CODE_PREFIX = "ZU-";
const CODE_SUFFIX_LENGTH = 6;
const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const POINTS_PER_REFERRAL = 50;
const CODE_REGEX = /^ZU-[A-Z0-9]{6}$/;

function generateReferralCode(): string {
  const bytes = crypto.randomBytes(CODE_SUFFIX_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_SUFFIX_LENGTH; i++) {
    code += CODE_CHARS[bytes[i] % CODE_CHARS.length];
  }
  return `${CODE_PREFIX}${code}`;
}

function decodeToken(token: string): { id: number } | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
    );
    if (payload && typeof payload.id === "number") {
      return { id: payload.id };
    }
    return null;
  } catch {
    return null;
  }
}

function getUserId(req: any): number | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const decoded = decodeToken(auth.slice(7));
  return decoded?.id ?? null;
}

async function generateUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateReferralCode();
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.referralCode, code))
      .limit(1);
    if (existing.length === 0) return code;
  }
  throw new Error("تعذر إنشاء رمز دعوة فريد، حاول مرة أخرى");
}

const claimRateMap = new Map<string, { count: number; resetAt: number }>();

function checkClaimRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = claimRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    claimRateMap.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

router.post("/referrals/generate", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "يجب تسجيل الدخول أولاً", code: "UNAUTHORIZED" });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "المستخدم غير موجود", code: "USER_NOT_FOUND" });
      return;
    }

    if (user.referralCode) {
      res.json({
        code: user.referralCode,
        shareUrl: `${req.protocol}://${req.get("host")}/login?ref=${user.referralCode}`,
      });
      return;
    }

    const newCode = await generateUniqueCode();
    await db
      .update(usersTable)
      .set({ referralCode: newCode })
      .where(eq(usersTable.id, userId));

    res.json({
      code: newCode,
      shareUrl: `${req.protocol}://${req.get("host")}/login?ref=${newCode}`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في إنشاء الرمز", code: "CODE_GENERATION_FAILED" });
  }
});

router.post("/referrals/regenerate", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "يجب تسجيل الدخول أولاً", code: "UNAUTHORIZED" });
      return;
    }

    const newCode = await generateUniqueCode();
    await db
      .update(usersTable)
      .set({ referralCode: newCode })
      .where(eq(usersTable.id, userId));

    res.json({
      code: newCode,
      shareUrl: `${req.protocol}://${req.get("host")}/login?ref=${newCode}`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في تغيير الرمز", code: "CODE_GENERATION_FAILED" });
  }
});

router.post("/referrals/claim", async (req, res) => {
  try {
    const { code, refereeIdentifier } = req.body;
    if (!code || !refereeIdentifier) {
      res.status(400).json({ error: "الرجاء تقديم رمز الدعوة ومعرف المستخدم", code: "MISSING_FIELDS" });
      return;
    }

    if (!CODE_REGEX.test(code)) {
      res.status(400).json({ error: "رمز الدعوة غير صالح", code: "INVALID_CODE_FORMAT" });
      return;
    }

    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    if (!checkClaimRateLimit(ip)) {
      res.status(429).json({ error: "طلبات كثيرة جداً، حاول لاحقاً", code: "RATE_LIMITED" });
      return;
    }

    const [referrer] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.referralCode, code))
      .limit(1);

    if (!referrer) {
      res.status(404).json({ error: "رمز الدعوة غير موجود", code: "CODE_NOT_FOUND" });
      return;
    }

    const [referee] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.identifier, refereeIdentifier))
      .limit(1);

    if (!referee) {
      res.status(404).json({ error: "المستخدم غير موجود", code: "REFEREE_NOT_FOUND" });
      return;
    }

    if (referrer.id === referee.id) {
      res.status(400).json({ error: "لا يمكنك دعوة نفسك", code: "SELF_REFERRAL" });
      return;
    }

    const [existingClaim] = await db
      .select()
      .from(referralsTable)
      .where(eq(referralsTable.refereeId, referee.id))
      .limit(1);

    if (existingClaim) {
      res.status(400).json({ error: "تم استخدام رمز دعوة من قبل لهذا الحساب", code: "DUPLICATE_CLAIM" });
      return;
    }

    const [referral] = await db.insert(referralsTable).values({
      referrerId: referrer.id,
      refereeId: referee.id,
      code,
      status: "pending",
      refereeIp: ip,
      firstContactAt: new Date(),
    }).returning();

    const newPoints = referrer.points + POINTS_PER_REFERRAL;
    await db
      .update(usersTable)
      .set({ points: newPoints })
      .where(eq(usersTable.id, referrer.id));

    await db
      .update(referralsTable)
      .set({ status: "rewarded", pointsAwarded: POINTS_PER_REFERRAL, rewardedAt: new Date() })
      .where(eq(referralsTable.id, referral.id));

    res.json({
      success: true,
      pointsAwarded: POINTS_PER_REFERRAL,
      referrerNewTotal: newPoints,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في تسجيل الدعوة", code: "CLAIM_FAILED" });
  }
});

router.get("/referrals/stats", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "يجب تسجيل الدخول أولاً", code: "UNAUTHORIZED" });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "المستخدم غير موجود", code: "USER_NOT_FOUND" });
      return;
    }

    const allReferrals = await db
      .select()
      .from(referralsTable)
      .where(eq(referralsTable.referrerId, userId))
      .orderBy(referralsTable.createdAt);

    const totalReferrals = allReferrals.length;
    const completedReferrals = allReferrals.filter(r => r.status === "rewarded" || r.status === "completed").length;
    const totalPointsEarned = allReferrals.reduce((sum, r) => sum + r.pointsAwarded, 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyPointsEarned = allReferrals
      .filter(r => r.rewardedAt && new Date(r.rewardedAt) >= startOfMonth)
      .reduce((sum, r) => sum + r.pointsAwarded, 0);

    const [rankResult] = await db
      .select({ rank: sql<number>`COUNT(*) + 1` })
      .from(usersTable)
      .where(
        and(
          sql`${usersTable.points} > ${user.points}`,
          sql`${usersTable.referralCode} IS NOT NULL`
        )
      );

    const rank = rankResult?.rank ?? 1;

    const history = await Promise.all(
      allReferrals.map(async (ref) => {
        let refereeName: string | null = null;
        let refereeIdentifier: string | null = null;
        if (ref.refereeId) {
          const [refUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, ref.refereeId))
            .limit(1);
          if (refUser) {
            refereeName = refUser.name;
            refereeIdentifier = refUser.identifier;
          }
        }
        return {
          id: ref.id,
          refereeName,
          refereeIdentifier,
          status: ref.status,
          pointsAwarded: ref.pointsAwarded,
          firstContactAt: ref.firstContactAt?.toISOString() ?? null,
          completedAt: ref.completedAt?.toISOString() ?? null,
          rewardedAt: ref.rewardedAt?.toISOString() ?? null,
        };
      })
    );

    res.json({
      code: user.referralCode,
      shareUrl: user.referralCode
        ? `${req.protocol}://${req.get("host")}/login?ref=${user.referralCode}`
        : null,
      stats: {
        totalReferrals,
        completedReferrals,
        totalPointsEarned,
        monthlyPointsEarned,
        rank,
      },
      history,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في تحميل الإحصائيات", code: "STATS_FAILED" });
  }
});

export default router;
