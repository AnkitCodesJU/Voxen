import { Server } from "socket.io";

const initializeSocketIO = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected", socket.id);

        /**
         * CHAT EVENTS
         */
        socket.on("join-live-class", (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
            // Notify others in the room
            socket.to(roomId).emit("user-connected", socket.id);
        });

        socket.on("live-chat-message", ({ roomId, message, user }) => {
            // Broadcast to everyone in the room INCLUDING sender (or excluding, depending on frontend needs)
            // Usually for chat, we want to see our own message confirms, so frontend handles optimistic UI
            // Here we broadcast to everyone in room:
            io.to(roomId).emit("new-message", { message, user });
        });

        /**
         * VIDEO / WEBRTC SIGNALING EVENTS
         */
        
        // When a user wants to leave explicitly
        socket.on("leave-live-class", (roomId) => {
            socket.leave(roomId);
            console.log(`Socket ${socket.id} left room ${roomId}`);
            socket.to(roomId).emit("user-disconnected", socket.id);
        });

        // WebRTC Signaling: Offer
        socket.on("offer", ({ roomId, offer }) => {
            // Broadcast offer to other peers in the room
            socket.to(roomId).emit("offer", { offer, senderId: socket.id });
        });

        // WebRTC Signaling: Answer
        socket.on("answer", ({ roomId, answer }) => {
            // Broadcast answer to other peers in the room
            socket.to(roomId).emit("answer", { answer, senderId: socket.id });
        });

        // WebRTC Signaling: ICE Candidate
        socket.on("ice-candidate", ({ roomId, candidate }) => {
            // Broadcast candidate to other peers in the room
            socket.to(roomId).emit("ice-candidate", { candidate, senderId: socket.id });
        });


        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);
            // Ideally we should track which room they were in to emit 'user-disconnected'
            // For now, if we depend on simple socket.leave logic, we rely on room broadcast
            // But we can't emit to room after disconnect easily without tracking.
            // For MVP, relying on heartbeat or explicit leave. 
            // Or loop through rooms this socket was in (before full disconnect - complex in v4?)
            // socket.rooms is empty on 'disconnect'. 'disconnecting' event has rooms.
        });

        socket.on("disconnecting", () => {
             // socket.rooms is a Set containing the socket id and other rooms
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    socket.to(room).emit("user-disconnected", socket.id);
                }
            }
        });
    });

    return io;
};

export { initializeSocketIO };
