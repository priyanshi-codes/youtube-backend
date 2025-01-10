import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


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

   if((!username || !email)){
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
    


export { 
    registerUser,
    loginUser,
    logoutUser
 }