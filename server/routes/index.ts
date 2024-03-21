import { Router } from "express";
import saveResultController from "../controllers/api/saveResults.controller";
import getResultsController from "../controllers/api/getResults.controller";

const router = Router();

router.post("/save-result", saveResultController);
router.get("/get-results", getResultsController);

export default router;
