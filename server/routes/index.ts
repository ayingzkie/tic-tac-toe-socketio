import { Router } from "express";
import saveResultController from "../controllers/api/saveResultController";

const router = Router();

router.post("/save-result", saveResultController);

export default router;
