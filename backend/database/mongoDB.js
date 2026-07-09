const mongoose = require('mongoose');

const connectDB =()=>{
    try{
        console.log(process.env.DATABASE_LOCAL);
        mongoose.connect(process.env.DATABASE_LOCAL)
        .then(()=> {
            console.log("✅ MongoDB Connected Successfully");
            console.log(`📦 Database : ${process.env.DB_NAME}`);
            console.log(`🖥️ Host      : ${process.env.DB_HOST}:${process.env.DB_PORT}`);

        })
    }
    catch(err){
        console.error("❌ Database Connection Failed");
        console.error(err.message);

        process.exit(1);
    }
    
}
module.exports = connectDB;