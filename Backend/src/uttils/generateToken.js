import { ApiError } from "./apiErrors.js";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../uttils/jwt.js";

export const generateRefresAndAccessToken = async (userId) => {
  try {
    const accessToken = await generateAccessToken(userId);
    const refreshToken = await generateRefreshToken(userId);
    
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token",error.message);
  }
};
