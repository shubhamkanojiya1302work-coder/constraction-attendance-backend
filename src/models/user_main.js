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


export const findWorkerById = async(id) =>{
    const workerById = await pool.query("SELECT id,user_name,user_phone,trade,is_active,created_At FROM user_main WHERE id=$1 AND user_role = 'worker'",[id])
    return workerById.rows[0]
   
}

export const createWorker = async({name , phone, trade})=>{
    const result = await pool.query(
        `INSERT INTO user_main (user_name,user_phone,user_role,trade) 
        VALUES ($1 , $2,'worker',$3) 
        RETURNING id, user_name, user_phone, trade, is_active, created_at`
        ,[name,phone,trade]
    );

    return result.rows[0];

}