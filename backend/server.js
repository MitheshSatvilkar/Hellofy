const app = require("./app");
const dotenv = require("dotenv");
const http = require("http");
const { initializeSocket } = require("./socket");

dotenv.config({path: "./config.env"});


process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// const {connectDB} = require("./database/db");
const connectDB = require("./database/mongoDB");

//Socket Connection
const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.port;
server.listen(PORT, async()=>{
    console.log("====================================");
    console.log("🚀 Server Started Successfully");
    console.log(`🌐 URL  : http://127.0.0.1`);
    console.log(`📌 Port : ${PORT}`);
    console.log("====================================");

    //Connect to Postgres DB
    await connectDB();
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  console.log(err)
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
