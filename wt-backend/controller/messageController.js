import User from "../schemas/user.js";
import Message from "../schemas/message.js";
import mongoose from "mongoose";
import {message_image_upload} from "../middleware/upload.js";
import {io} from "../utils/socket.js";
import {userSocketMap} from "../utils/socket.js";

export const getUsers=async(req,res)=>{
    try{
        const  userId=req?.userId;
        console.log('userId: ', userId)
        console.log("isValidObjectId:", mongoose.isValidObjectId(userId));

       const filteredUsers= await User.find({_id:{$ne: userId}}).select("-password");

        const unseenMessages={};
        const promises= filteredUsers.map(async (user)=>{
        const msgcount= await Message.find({receiverId:userId,
            senderId:user._id,seen:false}).countDocuments();
        
        if (msgcount>0){
            unseenMessages[user._id]=msgcount;
        }

        })
        // Wait for all promises to resolve at the same time using Promise.all
        await Promise.all(promises);
        console.log("unseenMessages====>>>",unseenMessages);
        res.status(200).json({sucess:true,users:filteredUsers,unseenMessages:unseenMessages});

    }
    catch(error){
        console.log("error====>>>","message from getusers=>",error.message);
        res.status(500).json({success:false,message:`message from getusers=>${error.message}`});
    }

}


export const getMessages=async(req,res)=>{
    try{
        const id=req.params.id;
        console.log("IDIIDI: ",id)
        const myID=req?.userId;
        console.log("req?userID: ",myID)
        const messages=await Message.find({
            $or:[
                {senderId:myID,receiverId:id},
                {senderId:id,receiverId:myID}

            ]
        })
        const updateMessage=await Message.updateMany({
            senderId:id,receiverId:myID}
            ,{seen:true}
        )
        res.status(200).json({success:true,messages:messages});
    }
    catch(error){
        console.log("error====>>>","message from getmessages",error.message);
        res.status(500).json({success:false,message:`message from getmessages=>${error.message}`});
    }
}
export const markMessagesSeen=async(req,res)=>{
    try{
        const id=req.params.id;
        await Message.findByIdAndUpdate(id,{seen:true});  
        res.status(200).json({success:true,message:"Message marked as seen"});    
    }    
    catch(error){
     console.log("error====>>>",error.message);
     res.status(500).json({success:false,message:error.message});
    }
}   

export const sendMessage=async(req,res)=>{
    console.log("body=>",req.body)
    try{
      const {content} = req.body;
      const file = req?.file;
      const userid=req.userId;
      const receiverId = req.params.id;
      const senderId = req.userId;
      console.log("===>>>",file,senderId,receiverId)
      let msgdata={};
    //   if(image){
    //      const uploadResponse = await cloudinary.uploader.upload(image);
    //      imageUrl = uploadResponse.secure_url;
    //     }

    if (!receiverId || !senderId ) {
        return res.status(400).json({ success: false, message: "User ID and content are required." });
    }
    msgdata.senderId=senderId;
    msgdata.receiverId=receiverId;
    msgdata.content=content||"";

    if (file) {
            const cloud_img = await message_image_upload(file, senderId);
            console.log("cloudinary_details of message images===>>>>", cloud_img)
            msgdata.image = {
                url: cloud_img.secure_url,
                public_id: cloud_img.public_id
            };
        }
        const newMessage = await Message.create(
            msgdata
        );
        console.log("newMessage====>>>",newMessage);
        //update the message in socket
        //Emit the new message in reciever socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.json({success:true, newMessage});
        //to display the message to reciever in real time(we neeed socket.io)
    }
    catch(error){
        console.log("error",error.message)
        res.status(500).json({success:true, message:`message from sendmessage=>${error.message}`});
    }
}

