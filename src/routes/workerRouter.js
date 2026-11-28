import {Router} from "express"
import { getWorkers,getWorkerById,createWorkerHandler, updateWorkerHandler } from "../controllers/workerController.js"


const router = Router();
router.get("/",getWorkers);
router.get("/:id",getWorkerById);
router.post("/",createWorkerHandler);
router.put("/:id",updateWorkerHandler);
export default router