import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();


//middleware 
//how to take data from different forms

//1-from cross origin 
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
})) //use only in middlewares 

//2-from json data
app.use(express.json({
    limit :"16kb"
}))

//3-from url encoded data
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
//images, fevicon stored in this folder 
app.use(express.static("public"))


//cookies-parser use is that i can easily access the cookies in user browser through my server and also set the user cookies 
app.use(cookieParser())


export {app};