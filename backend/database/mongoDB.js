const mongoose = require('mongoose');

const connectDB =()=>{
    try{
        mongoose.connect(process.env.DATABASE_MONGO.replace("<db_password>",process.env.MONGODB_PASS))
        .then(()=> {
            console.log("✅ MongoDB Connected Successfully");
            console.log(`📦 Database : ${process.env.DB_NAME}`);
            // console.log(`🖥️ Host      : ${process.env.DATABASE_MONGO}`);
        })
    }
    catch(err){
        console.error("❌ Database Connection Failed");
        console.error(err.message);
        process.exit(1);
    }
    
}
module.exports = connectDB;