
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


export default pool;

export const checkConnection = async() => {
  const dbData = await pool.query("SELECT NOW()");
  console.log(dbData.rows[0]);
return dbData.rows[0].now
}