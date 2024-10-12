import { Router } from "express";
import { emailProcess } from "../controllers/email.controller.js";

const router = Router();

router.post("/", emailProcess);

export default router;
