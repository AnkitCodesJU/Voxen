import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/ApiError.js"

const app = express()

console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



//routes import
import userRouter from './routes/user.routes.js'
import liveClassRouter from './routes/liveClass.routes.js'
import searchRouter from './routes/search.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/live-classes", liveClassRouter)
app.use("/api/v1/search", searchRouter)
// http://localhost:8000/api/v1/users/register

// Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            data: err.data
        })
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    })
})

export { app }
