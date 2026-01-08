import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("join-live-class", (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("live-chat-message", ({ roomId, message, user }) => {
        io.to(roomId).emit("new-message", { message, user });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
});

connectDB()
.then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

