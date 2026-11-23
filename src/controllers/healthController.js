import { checkConnection } from "../config/db.js"


export const getHealth = (req,res) => 
    res.json({ 
        status: "ok",
        message: "Construction Attendance API is running"
     })
 
export const getDbHealth = async (req,res) =>
{
    res.json({
        status:"ok",
        message: "Db connected",
        time: await checkConnection()
    })


}

