//1. import everything from the user model as one object:  import * as User from "...js"
// 2. export an async controller getWorkers (req, res)
//    2a. await User.findAllWorkers() and store it
//    2b. send the workers as JSON

import { findAllWorkers } from "../models/user_main.js";   

export const getWorkers = async (req,res) =>{
   const workerData = await findAllWorkers();
   res.json(workerData);
}