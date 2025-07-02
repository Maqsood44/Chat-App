import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = mongoose.Schema(
  {
    fullName:{
      type: String,
      required:true
    },
    email: {
      type: String,
      lovercase: true,
      trim: true,
      required:true
    },
    password: {
      type: String,
      required:true
    },
    dob:{
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ["male", "female", "Other"]
    },
    profileImage:{
      type: String,
    },
    friends:[
      {
        type:mongoose.Types.ObjectId,
        ref: "User"
      }
    ],
    friendsRequest:[
      {
        type:mongoose.Types.ObjectId,
        ref: "User"
      }
    ],
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true })


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  if (this.password !== undefined) {
    this.password = await bcrypt.hash(this.password, 10)
  }


  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)

export default User
