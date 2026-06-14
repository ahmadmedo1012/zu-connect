import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statsRouter from "./stats";
import newsRouter from "./news";
import coursesRouter from "./courses";
import membersRouter from "./members";
import collegesRouter from "./colleges";
import libraryRouter from "./library";
import plannerRouter from "./planner";
import chatRouter from "./chat";
import suggestionsRouter from "./suggestions";
import volunteersRouter from "./volunteers";
import faqRouter from "./faq";
import leadershipRouter from "./leadership";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(newsRouter);
router.use(coursesRouter);
router.use(membersRouter);
router.use(collegesRouter);
router.use(libraryRouter);
router.use(plannerRouter);
router.use(chatRouter);
router.use(suggestionsRouter);
router.use(volunteersRouter);
router.use(faqRouter);
router.use(leadershipRouter);
router.use(authRouter);

export default router;
