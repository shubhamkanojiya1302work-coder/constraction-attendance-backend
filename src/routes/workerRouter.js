import {Router} from "express"
import { getWorkers,getWorkerById,createWorkerHandler } from "../controllers/workerController.js"

const router = Router();
router.get("/",getWorkers);
router.get("/:id",getWorkerById);
router.post("/",createWorkerHandler);
export default router