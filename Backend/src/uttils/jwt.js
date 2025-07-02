import jwt from "jsonwebtoken";

export function generateAccessToken(id) {
    return jwt.sign({id}, process.env.ACCESS_TOKEN_JWT_SECRET_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
export function generateRefreshToken(id) {
    return jwt.sign({id}, process.env.REFRESHTOKEN_JWT_SECRET_KEY, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}