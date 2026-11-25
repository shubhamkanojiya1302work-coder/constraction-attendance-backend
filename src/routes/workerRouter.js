import {Router} from "express"
import { getWorkers } from "../controllers/workerController.js"

const router = Router();
router.get("/",getWorkers);

export default router