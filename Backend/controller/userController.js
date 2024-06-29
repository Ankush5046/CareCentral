import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {User} from "../models/userSchema.js";
import dotenv from 'dotenv';
import {generateToken} from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
dotenv.config({path:"../config.env"});
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
 api_secret:process.env.CLOUDINARY_API_SECRET,
});
export const patientRegister=catchAsyncError(async(req,res,next)=>{
    const {firstName,lastName,email,phone,password,gender,dob,nic,role,
    }=req.body;
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role
    ){
        return next(new ErrorHandler("Please Fill Full Form!",400));
    }
    let user=await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User Already Registered",400));
    }
    user = await User.create({firstName,lastName,email,phone, password,gender,dob,nic,role,
    });
    generateToken(user,"User Registered!",200,res);
});
    export const login=catchAsyncError(async(req,res,next)=>{
        const{email,password,confirmPassword,role}=req.body;
        if(!email || !password || !confirmPassword || !role){
            return next(new ErrorHandler("Please Provide All Details!",400));
        }
        if(password !== confirmPassword){
            return next(new ErrorHandler("Password and Confrim Password do not match!",400));
        }
        let user=await User.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler("Invalid Password or Email!",400));
        }
        const isPasswordMatched=await user.comparePassword(password);
        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid Password or Email!",400));
        }
        if(role!==user.role){
            return next(new ErrorHandler("User Role does not Match",400)); 
        }
        generateToken(user,"User Login Successfully!",200,res);
    });
    export const addNewAdmin=catchAsyncError(async(req,res,next)=>{
        const {
            firstName,lastName,email,phone,password,gender,dob,nic,}=req.body;
        if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic){
            return next(new ErrorHandler("Please Fill Full Form!",400));
        }
            let isRegistered=await User.findOne({email});
            if(isRegistered){
                return next(new ErrorHandler(`${isRegistered.role} with This Email Already Exist`,400));
            }
            const admin=await User.create({ firstName,lastName,email,phone,password,gender,dob,nic,role:"Admin",});
            res.status(200).json({
                success:true,
                message:"New Admin Registered",
            });
        });
           export const getAllDoctors=catchAsyncError(async(req,res,next)=>{
            const doctors=await User.find({role:"Doctor"});
            res.status(200).json({
                success:true,
                doctors,
            });
        });
        export const getUserDetails=catchAsyncError(async(req,res,next)=>{
        const user=req.user;
        res.status(200).json({
        success:true,
       user,
        });
        });
        export const logoutAdmin=catchAsyncError(async(req,res,next)=>{
            res.status(200).cookie("adminToken","",{
             httpOnly:true,
             expires:new Date(Date.now()),
            }).json({
                success:true,
                message:"Admin Logged Out Successfully!"
            });
        });
        export const logoutPatient=catchAsyncError(async(req,res,next)=>{
            res.status(200).cookie("patientToken","",{
             httpOnly:true,
             expires:new Date(Date.now()),
            }).json({
                success:true,
                message:"Patient Logged Out Successfully!"
            });
        });
       export const addNewDoctor=catchAsyncError(async(req,res,next)=>{
        if(!req.files || Object.keys(req.files).length===0 ){
            return next(new ErrorHandler("Doctor Avatar Required",400));
        }
        const {docAvatar}=req.files;
        const allowedFormats=["image/png","image/jpeg","image/webp"];
        if(!allowedFormats.includes(docAvatar.mimetype)){
            return next(new ErrorHandler("File Format Not Supported",400));
        }
        const {firstName,lastName,email,phone,password,gender,dob,nic,doctorDepartment}=req.body;
        if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment){
            return next(new ErrorHandler("Please Provide Full Details",400));
        }
        let isRegistered=await User.findOne({email});
        if(isRegistered){
            return next(new ErrorHandler(`${isRegistered.role} already exist with this email`,400)); 
        }
        const cloudinaryResponse=await cloudinary.uploader.upload(docAvatar.tempFilePath);
        if(!cloudinaryResponse || cloudinaryResponse.error){
            console.error("Cloudinary Error",cloudinaryResponse.error || "Unknown Cloudinary Error");
            return next(
                new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
              );
        };
        let doctor=await User.create({
            firstName,lastName,email,phone,password,gender,dob,nic,doctorDepartment,role:"Doctor",
            docAvatar:{
                public_id:cloudinaryResponse.public_id,
                url:cloudinaryResponse.secure_url,
            },
        });
        res.status(200).json({
            success:true,
            message:"New Doctor Registered",
            doctor,
        })
       });

