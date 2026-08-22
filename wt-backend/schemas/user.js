import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    "email":{
        required:true,
        type:String,
        unique:true
    },
    "password":{
        required:true,
        type:String
    },
    "name":{
        required:true,
        type:String
    },
    "profilePic":{
        url:{
            type:String,
            default:""
        },
        public_id:{
            type:String,
            default:""

        }
    },
    bio:{
        type:String,
        default:"Hey, I am using ChatVerse!!"
    },
    refreshToken:{
        type:String,
        default:""
    }
},
{timestamps:true})
const User= mongoose.model("User",userSchema);
export default User;
