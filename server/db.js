import "dotenv/config"
import mysql from "mysql2/promise"

/* const pool = mysql.createPool({
    host:"localhost",
    user:"laraveluser",
    password:"123456789",
    database:"prueba_express_js"
}); */

const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "",
    database: process.env.DB_NAME || "prueba_express_js"
}); 

export default pool;