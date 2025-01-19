import {Router} from 'express';
import {loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage, getUserChannelProfile,
    getWatchHistory
} 
from '../controllers/user.controller.js';
import {upload} from "../middleware/multer.middleware.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();

// Debugging Middleware to log raw request body and headers
// router.use((req, res, next) => {
    // console.log("Before Multer Middleware:");
    // console.log("Request Headers:", req.headers);
    // console.log("Request Body (Raw):", req.body);
    // next(); // Pass to the next middleware
// });
router.route("/register").post(
    upload.fields([
       {
        name: "avatar",
        maxCount:1
       },
       {
        name:"coverImage",
        maxCount: 1
       }
    ]),
    // (req, res, next) => {
       // Log after Multer processes the request
        // console.log("After Multer Middleware:");
        // console.log("Request Body (Parsed):", req.body);
        // console.log("Request Files:", req.files);
        // next(); // Pass to the controller
    // },
    registerUser
)

router.route("/login").post(loginUser)

//secured routes 
//adding middlewares
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)


router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

//patch- when you take user from body
//when you have to update only one field
router
.route("/update-cover-image")
.patch(
    verifyJWT,
     upload.single("coverImage"), updateUserCoverImage
    )

//when u take user from url/params
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/watch-history").get(verifyJWT, getWatchHistory)



export default router;