import "dotenv/config"
import app from "./app.js"
import { checkConnection } from "./config/db.js";
const port = process.env.PORT || 5000



const startServer = async() => {
    try { 
        
        const dbTime = await checkConnection();
        console.log(`Databases connected at ${dbTime}`);
        app.listen(port , ()=>{
            console.log(`server is running on port ${port}`);
        });
   }
   catch(error){
    console.error(error);
    process.exit(1);
   }
}
startServer()



