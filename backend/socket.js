const { Server } = require("socket.io");

let io;
const connectedUsers = new Map();

function initializeSocket(server) {
  try {
    const allowedOrigins = [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    io = new Server(server, {
      cors: {
        origin: (origin, callback) => {
          // Allow Postman or requests with no Origin
          if (!origin) return callback(null, true);

          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }

          return callback(new Error("Socket.IO CORS: Origin not allowed"));
        },
        credentials: true,
        methods: ["GET", "POST"],
      },

      transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
      console.log(`✅ Socket Connected: ${socket.id}`);

      // Register User
      socket.on("register", (userId) => {
        if (!userId) return;

        connectedUsers.set(userId.toString(), socket.id);

        console.log(
          `✅ User ${userId} registered with socket ${socket.id}`
        );
      });

      // Disconnect
      socket.on("disconnect", () => {
        for (const [userId, socketId] of connectedUsers.entries()) {
          if (socketId === socket.id) {
            connectedUsers.delete(userId);

            console.log(`❌ User ${userId} disconnected`);

            break;
          }
        }

        console.log(`Socket Disconnected: ${socket.id}`);
      });

      socket.on("error", (err) => {
        console.error("Socket Error:", err);
      });
    });
  } catch (err) {
    console.error("Socket Initialization Error:", err);
  }
}

const emitToUser = (userId, event, data) => {
  try {
    if (!io) return false;

    const socketId = connectedUsers.get(userId.toString());
    if (!socketId) return false;
    
    io.to(socketId).emit(event, data);
    return true;
  } 
  catch (err) {
    console.error(err);
    return false;
  }
};

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = {
  initializeSocket,
  emitToUser,
  delay,
};