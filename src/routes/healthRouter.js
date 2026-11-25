import { Router } from "express";   
import {getDbHealth, getHealth} from "../controllers/healthController.js"
const router = Router();

router.get("/health",getHealth) 
router.get("/health/db",getDbHealth)

export default router
