import User from "../models/user.model.js"
import { ApiError } from "../uttils/apiErrors.js"
import { ApiResponse } from "../uttils/apiResponse.js"
import { asyncHandler } from "../uttils/AsyncHandle.js"
import { generateRefresAndAccessToken } from "../uttils/generateToken.js"
import { options } from "../contstents.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { uploadOnCloudinary } from "../uttils/Cloudinary.js"
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, dob, gender } = req.body
  console.log("Register data: ", fullName, email, password, dob, gender )
  try {
    if (
      [fullName, email, password, dob, gender].some((field) => {
        field?.trim == ""
      })
    ) {
      throw new ApiError(
        400,
        "missing required data",
      )
    }

    const findUser = await User.findOne({ email })
    if (findUser) {
      throw new ApiError(401, "User already exist")
    }

    const piLocalPath = Array.isArray(req.files?.profileImage) && req.files.profileImage.length > 0
    ? req.files.profileImage[0].path
    : null;
      let profileImage = ""

    if (piLocalPath) {
      profileImage = await uploadOnCloudinary(piLocalPath)
    }
    else {
      if (gender === "male"){
        profileImage = "./dp_male.png"
      }
      else {
        profileImage = "./dp_female.png"
      } 
    }

    const user = await User.create({
      fullName,
      email,
      password,
      dob,
      gender,
      profileImage: profileImage.url || profileImage,
    })

    const newUser = await User.findById(user._id).select(
      "-password -refreshToken",
    )

    if (!newUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
      .status(201)
      .json(new ApiResponse(201, newUser, "Register  successfully"))
  } catch (error) {
    console.log("Error in register controller: ",error.message)
    throw new ApiError(400, error.message)
  }
})

const logInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email) {
    throw new ApiError(401, "Please enter email")
  }
  if (!password) {
    throw new ApiError(401, "Please enter password")
  }
  try {
    const isUser = await User.findOne({ email })

    if (!isUser) {
      throw new ApiError(404, "this userusername or email doesn't exist")
    }

    const isPasswordCorrect = await isUser.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
      throw new ApiError(402, "invild cradential")
    }

    const { accessToken, refreshToken } = await generateRefresAndAccessToken(
      isUser._id,
    )

    isUser.refreshToken = refreshToken
    await isUser.save()

    const isloggedIn = await User.findById(isUser._id).select(
      "-password -refreshToken",
    )

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          202,
          {
            user: isloggedIn,
            accessToken,
            refreshToken,
          },
          "Log in successfully",
        ),
      )
  } catch (error) {
    console.log(error)
    throw new ApiError(400, error.message)
  }
})

const logOut = asyncHandler(async (req, res) => {
  console.log("ID in logout controller: ", req.user._id)
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      },
    )
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "logged Out"))
  } catch (error) {
    throw new ApiError(500, "something went wrong", error.message)
  }
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const isRefreshToken = req.cookies?.refreshToken || req.body
  console.log("API triggered")
  try {
    if (!isRefreshToken) {
      throw new ApiError(401, "unAutorized request")
    }
      const decodedToken = jwt.verify(
        isRefreshToken,
        process.env.REFRESHTOKEN_JWT_SECRET_KEY,
      )
      const user = await User.findById(decodedToken?.id).select(
        "-password",
      )
      if (!user){
        throw new ApiError(401, "Inviled Token")
      }

      if (user?.refreshToken !== isRefreshToken) {
        throw new ApiError(401, "Token is expired or used")
      }

      const { accessToken, refreshToken } = await generateRefresAndAccessToken(
        user?._id,
      )

      user.refreshToken = refreshToken
      await user.save()

      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            202,
            {
              accessToken,
              refreshToken: refreshToken,
              user:{
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
              }
            },
            "Access Token successfully refreshed",
          ),
        )
  } catch (error) {
    throw new ApiError(401,"RefreshToken error " + error.message)
  }
})

// const getAllUser = asyncHandler(async (req, res) => {
//   const currentUser = new mongoose.Types.ObjectId(req.user?._id)
//   try {
//     const allUsers = await User.find({_id: {$ne: currentUser}}).select("-password -refreshToken")
//     res.status(200).json(
//       new ApiResponse(200, allUsers, "Users fatch successfully")
//     )
//   } catch (error) {
//     console.log(error.message)
//     throw new ApiError(500, "", error.message)
//   }
// })

const getAllUser = asyncHandler(async (req, res) => {
  const currentUserId = new mongoose.Types.ObjectId(req.user?._id);

  try {
    const usersWithUnseenCounts = await User.aggregate([
      {
        $match: { _id: { $ne: currentUserId } },
      },
      {
        $lookup: {
          from: "messages", // or "messages" depending on your real collection
          let: { senderId: "$_id" }, // this is each user you’re viewing
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$senderId", "$$senderId"] },          // 👈 FROM that user
                    { $eq: ["$reciverId", currentUserId] },        // 👈 TO current user
                    { $eq: ["$seen", false] },                     // 👈 Only unseen
                  ],
                },
              },
            },
            {
              $count: "unseenCount",
            },
          ],
          as: "unseenMessages",
        },
      },
      {
        $addFields: {
          unseenCount: {
            $cond: [
              { $gt: [{ $size: "$unseenMessages" }, 0] },
              { $arrayElemAt: ["$unseenMessages.unseenCount", 0] },
              0,
            ],
          },
        },
      },
      {
        $project: {
          password: 0,
          refreshToken: 0,
          unseenMessages: 0,
        },
      },
    ]);

    res
      .status(200)
      .json(new ApiResponse(200, usersWithUnseenCounts, "Users fetched successfully"));
  } catch (error) {
    console.log("Get all users error:", error.message);
    throw new ApiError(500, "Failed to fetch users", error.message);
  }
});


const addFriend = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { requestId } = req.params;

  try {
    // Make sure the requested user exists
    const requestedUser = await User.findById(requestId);
    if (!requestedUser) {
      throw new ApiError(404, "User not found");
    }

    // Get the current user with friends and friend requests
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      throw new ApiError(404, "Current user not found");
    }

    // Check if already a friend
    if (currentUser.friends.includes(requestId)) {
      return res.status(409).json(
        new ApiResponse(409, {}, "User is already your friend")
      );
    }

    // Check if request already sent
    if (currentUser.friendsRequest.includes(requestId)) {
      return res.status(409).json(
        new ApiResponse(409, {}, "Request already sent to this user")
      );
    }

    // Otherwise, add to friend request list
    currentUser.friendsRequest.push(requestId);
    await currentUser.save();

    res.status(200).json(
      new ApiResponse(200, currentUser, "Friend request sent successfully")
    );
  } catch (error) {
    console.log("Add Friend Error:", error.message);
    throw new ApiError(500, "Internal server error", error.message);
  }
});
// Reject friend request
const rejectRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { rejectRequestId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friendsRequest: new mongoose.Types.ObjectId(rejectRequestId) },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(
      new ApiResponse(200, updatedUser, "Friend request rejected successfully")
    );
  } catch (error) {
    console.log("Reject Request Error:", error.message);
    throw new ApiError(500, "Internal server error", error.message);
  }
});

// accept Friend Request
const acceptRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { acceptRequestId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friendsRequest: acceptRequestId },
        $addToSet: { friends: acceptRequestId },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(
      new ApiResponse(200, updatedUser, "Friend request accepted")
    );
  } catch (error) {
    console.log("Accept Friend Error:", error.message);
    throw new ApiError(500, "Internal server error", error.message);
  }
});

export { 
    registerUser,
    logInUser,
    logOut,
    refreshAccessToken,
    getAllUser,
    addFriend,
    rejectRequest,
    acceptRequest
  }

// const registerUser = asyncHandler(async (req, res) => {
//   const { username, email, password, profilepic, dob, userType } = req.body
//   try {
//     // check user is guest
//     if (!userType) {
//       throw new ApiError(400, "user type is required")
//     }

//     if (userType == "guest") {
//       if (!username) {
//         throw new ApiError(400, "username is required")
//       }
//     } else if (
//       [username, email, password, dob].some((field) => {
//         field?.trim == ""
//       })
//     ) {
//       throw new ApiError(
//         400,
//         "username, email, passowrd and date of birth are required",
//       )
//     }

//     const findUser = await User.findOne({ $or: [{ username }, { email }] })
//     if (findUser) {
//       throw new ApiError(401, "User already exist")
//     }

//     //   // code for profile picture upload

//     const user = await User.create({
//       username,
//       userType,
//       email,
//       password,
//       dob,
//       profilepic,
//     })

//     const newUser = await User.findById(user._id).select(
//       "-password -refreshToken",
//     )

//     const { accessToken, refreshToken } = await generateRefresAndAccessToken(
//       newUser._id,
//     )

//     if (!newUser) {
//       throw new ApiError(500, "Something went wrong while registering the user")
//     }

//     if (newUser.userType == "guest") {
//       newUser.status = true
//       await newUser.save()
//       return res
//         .status(201)
//         .cookie("accessToken", accessToken, options)
//         .json(new ApiResponse(201, newUser, "Register successfully"))
//     }
//     return res
//       .status(201)
//       .json(new ApiResponse(201, newUser, "Register  successfully"))
//   } catch (error) {
//     console.log("register function", error)
//     throw new ApiError(400, error)
//   }
// })

// const logInUser = asyncHandler(async (req, res) => {
//   const { email, username, password } = req.body

//   if (!username && !email) {
//     throw new ApiError(401, "Please enter email or username")
//   }
//   if (!password) {
//     throw new ApiError(401, "Please enter password")
//   }
//   try {
//     const isUser = await User.findOne({
//       $or: [{ username }, { email }],
//     })

//     if (!isUser) {
//       throw new ApiError(404, "this userusername or email doesn't exist")
//     }

//     const isPasswordCorrect = await isUser.isPasswordCorrect(password)
//     if (!isPasswordCorrect) {
//       throw new ApiError(402, "invild cradential")
//     }

//     const { accessToken, refreshToken } = await generateRefresAndAccessToken(
//       isUser._id,
//     )

//     isUser.refreshToken = refreshToken
//     isUser.status = true
//     await isUser.save()

//     const isloggedIn = await User.findById(isUser._id).select(
//       "-password -refreshToken",
//     )

//     res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", refreshToken, options)
//       .json(
//         new ApiResponse(
//           202,
//           {
//             user: isloggedIn,
//             accessToken,
//             refreshToken,
//           },
//           "Log in successfully",
//         ),
//       )
//   } catch (error) {
//     console.log(error)
//     throw new ApiError(400, error.message)
//   }
// })

// const logOut = asyncHandler(async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         $unset: {
//           status: 1, // it removee the value and set the actual value
//           refreshToken: 1,
//         },
//       },
//       {
//         new: true,
//       },
//     )
//     if (req?.user?.userType == "guest") {
//       await User.findByIdAndDelete(req?.user?._id)
//     }
//     return res
//       .status(200)
//       .clearCookie("accessToken", options)
//       .clearCookie("refreshToken", options)
//       .json(new ApiResponse(200, {}, "logged Out"))
//   } catch (error) {
//     console.log(error.message)
//     // throw new ApiError(500, "something wen wrong", error.message)
//   }
// })

// const refreshAccessToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken = req.cookies?.refreshToken || req.header.body.refreshToken

//   if (!incomingRefreshToken) {
//     throw new ApiError(402, "", error)
//   }
// })

// export { registerUser, logInUser, logOut, refreshAccessToken }
