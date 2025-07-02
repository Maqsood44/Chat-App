import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { sendMessage, fetchMessages } from "../controllers/message.controller.js"
const router = Router()


router.route("/sendmessege/:reciverId").post( verifyJWT, sendMessage)
router.route("/fetchmessages/:selecteduser").get( verifyJWT, fetchMessages)

export default router
