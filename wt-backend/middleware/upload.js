import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import  imageurl  from "../middleware/baseurl.js";
import path from "path";


    console.log("Show====>>>>")
    console.log(process.env.CLOUDINARY_name)
    console.log(process.env.CLOUDINARY_api_key)
    console.log(process.env.CLOUDINARY_secret_key)
     cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_name, 
        api_key:process.env.CLOUDINARY_api_key, 
        api_secret: process.env.CLOUDINARY_secret_key 
    });
    console.log("config==== " ,cloudinary.config())
const storage=multer.diskStorage({
    filename:(req,file,cb)=>{
        const filename=req.userId?req.userId+Date.now():Date.now().toString();
        cb(null,filename)
    },
    destination:(req, file, cb) => {
    cb(null, "./uploads/profilepics"); // Specify the destination folder for uploaded files
  }
    
})
const storage_message=multer.diskStorage({
    filename:(req,file, cb)=>{
         const ext = path.extname(file.originalname);
        const filename=`${file.originalname.split(".")[0]}-${Date.now().toString()}${ext}`;
        cb(null,filename)
    },
    destination:(req, file, cb) => {
    cb(null, "./uploads/message_images"); // Specify the destination folder for uploaded files
  }
});

const message_image_object=multer({
    storage: storage_message,
    fileFilter: (req, file, cb) => {    
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    }});


const imageobject=multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    }
});

    async function cloud_upload(file_path,userId) {
    try{
    const filePath = path.resolve(file_path["path"]);
    const path2=imageurl+"/uploads/"+file_path['filename'];
        // Configuration
        // configure cloudinary from environment if available
        
        // Upload an image
        // await  await cloudinary.uploader
        //     .destroy({"public_id":public_id})

        const uploadResult = await cloudinary.uploader
        .upload(
           filePath,
        {
           folder:"profilepics",
           public_id:`profile-${userId}`,
           overwrite: true,
        }        )
       
        console.log(uploadResult);
        return uploadResult;
    }
        catch(err){
            console.log("err=======>",err.message)
        };
    };

    async function message_image_upload(file_path,userId) {
    try{
    const filePath = path.resolve(file_path["path"]);
    // Cloudinary supports nested folders via a folder path with slashes
    const msg_image_upload = await cloudinary.uploader.upload(filePath,{
        folder: `messages/message_images-${userId}`,
        resource_type: "image",
        public_id: `message-${Date.now()}`,
    });
    return msg_image_upload;
    }
    catch(err){
        console.log("err=======>",err.message)
    };
    };

export  {imageobject , cloud_upload, message_image_upload, message_image_object};
