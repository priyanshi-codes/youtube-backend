import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';
import {upload} from "../middleware/multer.middleware.js"


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




export default router;