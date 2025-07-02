import mongoose from "mongoose"

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    seen:{
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },
)

const Maessages = mongoose.model("Message", messageSchema)
export default Maessages

// const chatSchema = mongoose.Schema({
//     senderId:{
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "User",
//         required: true
//     },
//     reciverId:{
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "User",
//         required: true
//     },
//     message:{
//         type : String,
//         required: true
//     },
//     media:{
//         type : String,
//     },
//     status:{
//         type : String,
//         enum : ["sent", "read"]
//     },
// },
// {timestamps : true})

// const Chat = mongoose.model("Chat", chatSchema)
// export default Chat
