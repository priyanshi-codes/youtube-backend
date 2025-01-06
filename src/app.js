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







//routes import 
import userRouter from "./routes/user.route.js";


//routes declaration
//app.use("/users",userRouter) //(url,router u want to use) //when someone types users then control goes to userRouter
//http:??localhost:8000/users/register 
app.use("/api/v1/users",userRouter)//standard practice by defining your api version
//http:??localhost:8000/api/vi/users/register


export {app};