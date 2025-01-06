import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'; // Node.js file system module

import { v2 as cloudinary } from 'cloudinary';


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

// Upload an image

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if (!localFilePath) {
            return null;    
        }
        //upload the file on cloudinary \
       const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        console.log("File uploaded successfully on cloudinary !!", response.url);
        return response;
    } catch (error) {
       fs.unlinkSync(localFilePath); //delete the file from the local storage(temporary file as the upload operation got failed)
         console.log("Error while uploading the file on cloudinary", error);
        
    }
}


export default uploadOnCloudinary;
const uploadResult = await cloudinary.uploader
.upload(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
        public_id: 'shoes',
    }
)
.catch((error) => {
    console.log(error);
});



 