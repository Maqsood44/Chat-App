import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// Route imports
import userRouter from "./routers/user.router.js"
import chatRouter from "./routers/chat.router.js"

const app = express()


// Middlewares
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// app.use(cors({ origin: process.env.ORIGIN || "*", credentials: true }))
app.use(cors());
app.use(cookieParser())
app.use(express.static("public"))


// Routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/chat", chatRouter)



export { app }
