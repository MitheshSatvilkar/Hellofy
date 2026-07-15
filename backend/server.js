require("dotenv").config({ path: "./config.env" });

const http = require("http");
const app = require("./app");
const connectDB = require("./database/mongoDB");
const { initializeSocket } = require("./socket");

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION");
  console.error(err);
  process.exit(1);
});

const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } 
  catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

process.on("unhandledRejection", (err) => {
  console.error(err);

  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server Closed");
  });
});