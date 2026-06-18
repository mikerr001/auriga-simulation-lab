import { Router, type IRouter } from "express";
import healthRouter from "./health";
import scenariosRouter from "./scenarios";
import simulationsRouter from "./simulations";
import benchmarksRouter from "./benchmarks";
import observatoryRouter from "./observatory";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scenariosRouter);
router.use(simulationsRouter);
router.use(benchmarksRouter);
router.use(observatoryRouter);
router.use(dashboardRouter);

export default router;
