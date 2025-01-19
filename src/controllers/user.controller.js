import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import { channel } from "diagnostics_channel";


//making methods for generating access and refresh tokens because it is used multiple times in the code
const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user =await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        //how to send refreshtoken to database
        //or save refreshToken in database 
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false}) //to save only refresh token in db

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Error while generating tokens")    
        
    }

}

const registerUser = asyncHandler(async(req,res)=>{
    //steps to register a user
    //1-get user details from frontend 
    //2-validate user details- not empty, email format, password length
    //3-check if user already exists: username , email
    //4-check for images, check for avatar
    //5- upload them to cloudinary,avatar
    //create user object with all details- create entry in db
    //6-remove password and refresh filed from response 
    //check for user ceration
    //return response to frontend



//taking user details from frontend
const {fullname, email,username,password}= req.body
//console.log("email",email);
// console.log(req.body)


//validate user

//easy method to validate each
/*
if(fullname == ""){
    throw new ApiError(400,"fullname is required")
}
    */
    
   //second method
   
   if(
    [fullname , email, username, password].some((field)=> field?.trim() === "")
   ){
      throw new ApiError(400,"All fileds are required")
   }

   //check user already exists or not 
   const existedUser = await User.findOne({
    $or: [{ username },{ email }]
   })

   if(existedUser){
    throw new ApiError(409,"User already exists")
   }

   //check for images
   const avatarLocalPath = req.files?.avatar[0]?.path;
   console.log("avatarLocalPath",avatarLocalPath);
   //const coverImageLocalPath = req.files?.coverImage[0]?.path;
//checking coverimage is upload or not 
   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
       coverImageLocalPath = req.files.coverImage[0].path
   }

   if (!avatarLocalPath) {
    console.error("Avatar file is missing in req.files:", req.files);
    throw new ApiError(400, "Avatar file is required")
}

    //upload images to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        console.log("Avatar upload result:", avatar);
         throw new ApiError(400, "Avatar file is required")
    }
   

    //create user object and save it to db
  const user =  await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username :username.toLowerCase()
    })

    //check user is created or not in database
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //remove password and refresh token from response form db //wierd syntax
    )
    if(!createdUser){
        throw new ApiError(500,"Error while creating user")
    }

    //return response to frontend
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


})

const loginUser = asyncHandler(async(req,res)=>{
     //steps to login a user 
     //1-get data from req body
     //2-validate data from email amd username
     //3-find the user 
     //4-check password is correct or not
     //access and refresh tokens
     //send cookies to frontend
        //return response to frontend


//get data from req body
   const {email, username, password} = req.body

   if(!username && !email){
    throw new ApiError(400 , "Username or email is required")
   }

//find the user
 const user = await User.findOne({
    $or: [{username}, {email}]
  })

  if(!user){
    throw new ApiError(404 , "User not found")
  }

//check password is correct or not
     const isPasswordValid= await user.isPasswordCorrect(password)
    
     if(!isPasswordValid){
        throw new ApiError(401 , "Password is incorrect")
      }

//access and refresh tokens
  const {accessToken, refreshToken}=  await generateAccessAndRefreshTokens(user._id)

//send cookies to frontend
const loggedIndUser = await User.findByIdAndUpdate(user._id).select("-password -refreshToken")


//send cookies to frontend
   const options = {
    httpOnly: true,
    secure : true
   }

   return res.status(200)
   .cookie(
    "accessToken", accessToken, options
   )
   .cookie(
    "refreshToken", refreshToken, options
   )
   .json(
    new ApiResponse(
        200,
        {
            user: loggedIndUser, accessToken,
            refreshToken 

        },
     "User logged in successfully"
    )
   )



})

const logoutUser = asyncHandler(async(res,req)=>{
    //steps to logout a user
    //1-get refreshToken from cookies
    //2-find the user
    //3-remove refreshToken from user
    //4-save user
    //5-clear cookies
    //6-return response to frontend

    //get refreshToken from cookies

    //req.user came from middleware
   await User.findByIdAndUpdate(
        req.user._id,{
            $set: {
                refreshToken:undefined
            }
        },
        {
            new :true
        }

    )
    const options ={
        httpOnly: true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200, 
            "User logged out successfully"
        )
    )
   
      
          
      
   
                  
})

//end point for refrensh access token
const refreshAccessToken = asyncHandler(async(req,res)=>{
    //steps to refresh access token
    //1-get refreshToken from cookies
    //2-find the user
    //3-check refreshToken is valid or not
    //4-generate new access and refresh tokens
    //5-save new refreshToken to user
    //6-send new access token to frontend
    //7-return response to frontend

    //get refreshToken from cookies
    const incomingRefreshToken =req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(400, "Refresh token is required")
    }

    //checking refresh token is same as db or not

    try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

   const user = await User.findById(decodedToken?._id)

   if(!user){
       throw new ApiError(404, "invalid refresh token")
   }

   if(incomingRefreshToken!== user?.refreshToken){
         throw new ApiError(401, "refresh token is invalid")
   }
     const options={
            httpOnly:true,
            secure:true
     }

    const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newrefreshToken , options)
    .json(
        new ApiResponse(
            200,
            {
                accessToken,
                refreshToken: newrefreshToken
            },
            "Access token refreshed successfully"
        )
    )
} catch (error) {
      throw new ApiError(401, "Invalid refresh token")
}




    

})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword , newPassword}= req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400 , "Invalid old Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200)
    .json(
        new ApiResponse(
            200, 
            "Password changed successfully"
        )
    )

})

const getCurrentUser = asyncHandler(async(res,req)=>{
    return res.status(200)
    .json(new ApiResponse(
        200, req.user, "current user fetched succesfully")
)
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname, email} = req.body

    if(!(fullname || email)){
        throw new ApiError(400, "Atleast one field is required")
    }

   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname: fullname || req.user?.fullname,
                email: email || req.user?.email 
            }
        },
        {new :true}
    ).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            "Account details updated successfully"
        )
    )
})

//files updation
const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is missing")    
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading avatar")
    }

    //update avatar filed in db
   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set:{
                avatar: avatar.url
          }
        },
        {new :true}
    ).select("-password")


    //todo : delete old avatar from cloudinary
    const oldAvatar = req.user?.avatar
    if(oldAvatar){
        const publicId = oldAvatar.split("/").pop().split(".")[0]
        await cloudinary.uploader.destroy(publicId)
    }


    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Avatar updated successfully"
        )
    )
})

const  updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new newApiError(400, "Error while uploading cover image")
    }

    //update cover image filed in db

   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {
            new :true
        }
    ).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Cover image updated successfully"
        )   
    )
})


const getUserChannelProfile = asyncHandler(async(req,res)=>{

    const {username} = req.params

    if(!username.trim()){
        throw new ApiError(400, "Username is missing")
    }

    const channel = await User.aggregate([

        //first pipeline
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        //second pipeline
        //count no. of subscriber for particular channel
        {
            $lookup:{
                from : "subscriptions",
                localField:"_id",
                foreignField:"channel",
                as : "subscribers"
            }
        },
        //third pipeline
        //no. of channels subscribed by particular channel or no. of subscribed channel
        {
            $lookup:{
                from : "subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as : "channelsSubscribed"
            }
        },
        //fourth pipeline
  //count the no. of subscriber from subscriber field and also cont the no. of channel subscribed by particular channel
        {
            $addFields:{
                subscriberCount:{
                    $size: "$subscribers"
                },
                channelSubscribedCount:{
                    $size: "$channelsSubscribed"
                },
//check the user is subscribed or not
                isSubscribed:{
                    $cond:{
                        if:{
                             $in:[req.user?._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else:false
                    }
                }
            }
        },
        //fifth pipeline
        //project the fields : select the fields to show in response
         {
            $project: {
                fullname :1,
                username:1,
                avatar:1,
                coverImage:1,
                subscriberCount:1,
                channelSubscribedCount:1,
                isSubscribed:1
            }
        }

    ])

    if(!channel?.length)
        {
            throw new ApiError(404, "Channel not found")
    }
    console.log("channel",channel);

    return res.status(
        200
    ).json(
        new ApiResponse(
            200,
            channel[0],
            "Channel profile fetched successfully"
        )
    )

})

const getWatchHistory = asyncHandler(async(req, res)=>{
    const user = await User.aggregate([
        //pipeline1 
        //filter user by id
        {
            $match:{
                //convert id into string because in mobgodb id is in string format 
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        //pipeline2
        //find the watch history
        {
            $lookup:{
                from : "videos",
                localField : "watchHistory",
                foreignField : "_id",
                as : "watchHistory",
                //subpipeline
                //project the fields to show in response
                pipeline:[
                    {
                        $lookup:{
                            from : "users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            //subpipeline
                            //project the fields to show in response
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                },
                                {
                                   $addFields:{
                                    owner :{
                                        $first: "owner"
                                    }
                                   } 
                                }
                            ]
                        }
                    }
                ]
            }

        }
    ])

    return res(200).json(
        new ApiResponse(
            200, 
            user[0].watchHistory ,
            "Watch history fetched successfully"
        )
    )

})


    
export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
 }