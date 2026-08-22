import mongoose from 'mongoose';
const messageSchema= new mongoose.Schema(
    {
        senderId:{
            type: mongoose.Types.ObjectId,
            ref:"User",
            required:true
        },
        
        receiverId:{
            type: mongoose.Types.ObjectId,
            ref:"User",
            required:true
        },
        content:{
            type:String
        },
         image:{
        url:{
            type:String,
            default:""
        },
        public_id:{
            type:String,
            default:""

        }
    },
        seen:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true
    }
)

const Message=mongoose.model("Message",messageSchema);
export default Message;