const {Pool} = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

const connectDB =async()=>{
    try{
        const client = await pool.connect();
        console.log("✅ PostgreSQL Connected Successfully");
        console.log(`📦 Database : ${process.env.DB_NAME}`);
        console.log(`🖥️ Host      : ${process.env.DB_HOST}:${process.env.DB_PORT}`);

        client.release();
        return pool;
    }
    catch(err){
        console.error("❌ Database Connection Failed");
        console.error(err.message);

        process.exit(1);
    }
}

module.exports = { pool,connectDB }

