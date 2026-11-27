//1. import everything from the user model as one object:  import * as User from "...js"
// 2. export an async controller getWorkers (req, res)
//    2a. await User.findAllWorkers() and store it
//    2b. send the workers as JSON

import { findAllWorkers, findWorkerById, createWorker} from "../models/user_main.js";   

export const getWorkers = async (req,res) =>{
   const workerData = await findAllWorkers();
   res.json(workerData);
}

export const getWorkerById = async(req,res) =>{
   const id = Number(req.params.id)
   const MAX_DB_INTEGER = 2147483647;
   if (!Number.isInteger(id) || id <= 0 || id > MAX_DB_INTEGER  )
   { 
      return res.status(400).json({message: "Invalid worker id"})
   }
   const worker = await findWorkerById(id);
      if (!worker)
      {
         return res.status(404).json({message: "worker not Found"})
      }
      return res.json(worker)
     
   
}

export const createWorkerHandler = async(req,res) =>{
   const {name,phone,trade} = req.body ?? {};
   const cleanName = name?.trim();
   const cleanTrade =trade?.trim();
   const cleanPhone = phone?.trim();
   if (!cleanName || !cleanTrade)
   {
      return res.status(400).json({message: "name and trade are required"})
   }

   const worker = await createWorker({
      name : cleanName,
      phone: cleanPhone || null,
      trade: cleanTrade,
   });
   res.status(201).json(worker)
  
}