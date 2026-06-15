import { Router } from "express";
import statsRouter from "./stats";
import usersRouter from "./users";
import rolesRouter from "./roles";
import moderationRouter from "./moderation";
import referralsRouter from "./referrals";
import announcementsRouter from "./announcements";
import activityRouter from "./activity";
import analyticsRouter from "./analytics";
import gamificationRouter from "./gamification";
import liveRouter from "./live";
import settingsRouter from "./settings";
import integrationsRouter from "./integrations";
import telegramRouter from "./telegram";
import auditRouter from "./audit";
import contentRouter from "./content";
import filesRouter from "./files";

const router = Router();

router.use(statsRouter);
router.use(usersRouter);
router.use(rolesRouter);
router.use(moderationRouter);
router.use(referralsRouter);
router.use(announcementsRouter);
router.use(activityRouter);
router.use(analyticsRouter);
router.use(gamificationRouter);
router.use(liveRouter);
router.use(settingsRouter);
router.use(integrationsRouter);
router.use(telegramRouter);
router.use(auditRouter);
router.use(contentRouter);
router.use(filesRouter);

export default router;
