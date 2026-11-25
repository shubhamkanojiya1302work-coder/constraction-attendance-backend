// 1. import the pool (default export) from ../config/db.js
// 2. export an async function called findAllWorkers
//    2a. await a query that selects id, user_name, user_phone, trade, is_active, created_at
//        from user_main, only workers who are active, sorted by name (ORDER BY user_name)
//    2b. return all the rows (not just the first one this time)
import pool from "../config/db.js"

export const findAllWorkers = async() =>{
const allWorker = await pool.query("SELECT id,user_name,user_phone,trade,is_active,created_At FROM user_main WHERE is_active=TRUE AND user_role = 'worker' ORDER BY user_name");
// console.log(allWorker);
return allWorker.rows
}

