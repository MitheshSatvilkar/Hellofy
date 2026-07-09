const { Server } = require("socket.io");

let io;
const connectedUsers = new Map();

function initializeSocket(server) {
    try{
        io = new Server(server, {
            cors: {
                origin: "http://localhost:5173",
                credentials: true,
            },
        });

        io.on("connection", (socket) => {
            console.log("Socket Connected:", socket.id);

            // Client sends its userId after connection
            socket.on("register", (userId) => {
                connectedUsers.set(userId, socket.id);
                console.log(`User ${userId} connected with socket ${socket.id}`)
            });

            socket.on("disconnect", () => {
                // Remove disconnected user
                for (const [userId, socketId] of connectedUsers.entries()) {
                    if (socketId === socket.id) {
                        connectedUsers.delete(userId);
                        console.log(`User ${userId} disconnected`);
                        break;
                    }
                }

                console.log("Socket Disconnected:", socket.id);
            });

        });

    }
    catch(err){
        console.log(err);
    }
    
}

const emitToUser = (userId, event, data) => {
    try{
        const socketId = connectedUsers.get(userId.toString());
        if (!socketId) return false;
        io.to(socketId).emit(event,data);
        return true;
    }
    catch(err){
        console.log(err);
    }
    
};


const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
module.exports = {
    initializeSocket,
    emitToUser
};