import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

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
    


export { registerUser }