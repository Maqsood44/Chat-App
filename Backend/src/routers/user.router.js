import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()
import {
  registerUser,
  logInUser,
  logOut,
  refreshAccessToken,
  getAllUser,
  addFriend,
  rejectRequest, 
  acceptRequest
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

router.route("/register").post(upload.fields([{
    name: "profileImage",
     count:1}]),registerUser)
router.route("/login").post(logInUser)

// Protected routes
router.route("/logout").get(verifyJWT, logOut)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/getalluser").get(verifyJWT, getAllUser)
router.route("/addrequest/:requestId").put(verifyJWT, addFriend)
router.route("/acceptrequst/:acceptRequestId").put(verifyJWT, acceptRequest)
router.route("/rejectrequest/:acceptRequestId").put(verifyJWT, acceptRequest)


export default router
