import { ApiError } from "../uttils/apiErrors.js"
import { asyncHandler } from "../uttils/AsyncHandle.js"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET_KEY);
    if (!decodedToken?.id) {
      throw new ApiError(401, "Invalid token payload");
    }

    const user = await User.findById(decodedToken.id).select(
      "-password -refreshToken"
    );
    
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("verifyJWT Error:", error.message);
    throw new ApiError(401, error.message || "Unauthorized access");
  }
});
