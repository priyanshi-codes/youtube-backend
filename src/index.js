//require("dotenv").config({path : './env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ 
    path: "./env" 
});



connectDB()













/*
import express from "express";
const app = express();

//ifess arrow function //always start from semicolon
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_name}`);
        app.on("error",(error)=>{
            console.log("server error");
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`server started at port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("Error", error);
        throw error
        
    }
})()
//another approach of connecting database
//always use try catch and async await for database connection 
*/
