// Desc: Middleware for authentication
// Import necessary modules
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js"


export const verifyJWT = asyncHandler(async(req,_,next)=>{ //_, we are not using response or not response is not needed
try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
       if(!token){
        throw new ApiError(401, "Unauthorized request")
       }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decodedToken?._.id).select("-password -refreshToken")
    
    if(!user){
        throw new ApiError(401 , "Invalid Access Token")
    }
    
    req.user = user;
    next();
} catch (error) {

    throw new ApiError(401,"Invalid access Token")
    
}


})