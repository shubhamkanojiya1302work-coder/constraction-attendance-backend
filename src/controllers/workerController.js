//1. import everything from the user model as one object:  import * as User from "...js"
// 2. export an async controller getWorkers (req, res)
//    2a. await User.findAllWorkers() and store it
//    2b. send the workers as JSON

import {
  findAllWorkers,
  findWorkerById,
  createWorker,
  updateWorker,
} from "../models/user_main.js";
const MAX_DB_INTEGER = 2147483647;

export const getWorkers = async (req, res) => {
  const workerData = await findAllWorkers();
  res.json(workerData);
};

export const parseWorkerId = (id) => {
  const cleanId = Number(id);

  if (!Number.isInteger(cleanId) || cleanId <= 0 || cleanId > MAX_DB_INTEGER) {
    return null;
  }
  return cleanId;
};

export const getWorkerById = async (req, res) => {
  const id = parseWorkerId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid worker id" });
  }
  const getData = await findWorkerById(id);
  if (!getData)
      {
         return res.status(404).json({message: "worker not Found"})
      }
  res.json(getData);
};

export const createWorkerHandler = async (req, res) => {
  const { name, phone, trade } = req.body ?? {};
  const cleanName = name?.trim();
  const cleanTrade = trade?.trim();
  const cleanPhone = phone?.trim();
  if (!cleanName || !cleanTrade) {
    return res.status(400).json({ message: "name and trade are required" });
  }
  try {
    const worker = await createWorker({
      name: cleanName,
      phone: cleanPhone || null,
      trade: cleanTrade,
    });
    res.status(201).json(worker);
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ message: "A worker with this phone number already exists" });
    }
    throw error;
  }
};

export const updateWorkerHandler = async (req, res) => {
  const id = parseWorkerId(req.params.id);
  if (id === null){
   return res.status(400).json({message: "Invalid Id"})
  }
  const { name, phone, trade } = req.body ?? {};
  const cleanName = name?.trim();
  const cleanPhone = phone?.trim();
  const cleanTrade = trade?.trim();
  if (!cleanName || !cleanTrade) {
    return res.status(400).json({ message: "Name and trade are required" });
  }

  try {
    const updateUser = await updateWorker(id, {
      name: cleanName,
      phone: cleanPhone || null,
      trade: cleanTrade,
    });
    if (!updateUser) {
      return res.status(404).json({ message: "Worker Not found" });
    }

    res.status(200).json(updateUser);
  } catch (error) {

   if(error.code === "23505"){
      return res.status(409).json({message:"phone already used by other worker"});
   }
   throw error;
  }
};
