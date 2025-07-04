import Maessages from "../models/chat.model.js"
import { ApiError } from "../uttils/apiErrors.js"
import { ApiResponse } from "../uttils/apiResponse.js"
import { asyncHandler } from "../uttils/AsyncHandle.js"
import User from "../models/user.model.js"
import { io } from "../index.js"
import {users} from "../Socket/index.js"
import mongoose from "mongoose"

const sendMessage = asyncHandler(async (req, res) => {
  const { reciverId } = req.params;
  const {  message } = req.body;
  console.log("reciver ID: ", reciverId)
  console.log("sender ID: ", req.user?._id)
  console.log("Message: ", message)
  try {
  
    if (!reciverId || !message || !req.user?._id) {
      throw new ApiError(400, "Required data missing");
    }
  
    const isReciver = await User.findById(reciverId);
    if (!isReciver) {
      throw new ApiError(404, "Receiver not found");
    }
  
    const savedMessage = await Maessages.create({
      senderId: req.user?._id,
      reciverId,
      message,
    });
  
    // ✅ Access socket.io instance from req.app
    const io = req.app.get("io");
    const receiverSocketId = users[reciverId];
  
    if (receiverSocketId) {
      console.log(`📡 Emitting to receiver socket ID: ${receiverSocketId}`);
  
      io.to(receiverSocketId).emit("private-message", {
        from: req.user?._id,
        message,
      });
    } else {
      console.warn(`⚠️ User ${reciverId} is not connected`);
    }
  
    res
      .status(200)
      .json(new ApiResponse(200, savedMessage, "Message sent successfully"));
  }
   catch (error) {
    console.log("Error in send Message controller", error.message)
    throw new ApiError(500, "", error.message)
  }
 
});

const fetchMessages = asyncHandler(async (req, res) => {
  const { selecteduser } = req.params;

  try {
    if (!selecteduser) {
      throw new ApiError(400, "Please select a friend to fetch messages.");
    }

    const currentUserId = req.user?._id;

    // 🟡 Step 1: Mark all unseen messages as seen where current user is the receiver
    await Maessages.updateMany(
      {
        senderId: new mongoose.Types.ObjectId(selecteduser),
        reciverId: new mongoose.Types.ObjectId(currentUserId),
        seen: false,
      },
      {
        $set: { seen: true },
      }
    );

    // 🟢 Step 2: Fetch all messages (after marking seen)
    const messages = await Maessages.aggregate([
      {
        $match: {
          $or: [
            {
              senderId: new mongoose.Types.ObjectId(currentUserId),
              reciverId: new mongoose.Types.ObjectId(selecteduser),
            },
            {
              senderId: new mongoose.Types.ObjectId(selecteduser),
              reciverId: new mongoose.Types.ObjectId(currentUserId),
            },
          ],
        },
      },
      {
        $sort: { createdAt: 1 }, // Oldest to newest
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $project: {
          message: 1,
          createdAt: 1,
          senderId: 1,
          reciverId: 1,
          seen: 1,
          senderName: "$sender.fullName",
        },
      },
    ]);

    res.status(200).json(new ApiResponse(200, messages, ""));
  } catch (error) {
    console.log("Error in fetch message controller:", error.message);
    throw new ApiError(500, "Failed to fetch messages", error.message);
  }
});

  

  export { sendMessage, fetchMessages }