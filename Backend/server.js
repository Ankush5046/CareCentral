import {app} from "./app.js";
import cloudinary from "cloudinary";
import dotenv from 'dotenv';
dotenv.config({path:"./config.env"});
cloudinary.v2.config({
    cloudname:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});
app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`);
});