import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { createServer } from "http";
import { initializeSocketIO } from "./socket/index.js";

const httpServer = createServer(app);
initializeSocketIO(httpServer);

connectDB()
.then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

