import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import { DBconnection } from "./db/index.js"
import http from "http"
import { Server } from 'socket.io';
import{ initialSocketEvent } from "./Socket/index.js"
import {app} from "./app.js"


const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initialSocketEvent(io)

// Make io available in req.app
app.set("io", io);

DBconnection()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.error("❌ DB connection failed:", error)
  })

// import express, { urlencoded } from  "express"
// import cors from "cors"
// import {Server} from "socket.io"
// import http from "http"
// import { DBconnection } from "./db/index.js"
// import{ initialSocketEvent } from "./Socket/index.js"



// const app = express()

// app.use(express.json({limit: "16kb"}))
// app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// app.use(cors({ origin:"*"}))

// app.post("/post", (req, res) => {
//   const {email, pass} = req.body
//   res.status(200).json({email, pass})
// })

// const server = http.createServer(app);

// // // ✅ Attach Socket.IO to HTTP server
// const io = new Server(server, {
//   cors: { origin: "*" }
// });

// initialSocketEvent(io)



// server.listen(3000, () => {console.log("Server is running on port nu. 300")})