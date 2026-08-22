import express from "express";
const router=express.Router();
import {getUsers,getMessages,markMessagesSeen,sendMessage} from "../controller/messageController.js";
import jwt from "jsonwebtoken";
import {message_image_object} from "../middleware/upload.js";
const authenticateToken = (req, res, next) => {
    try {
        // const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");//req.cookies?.token ||
        //  req.cookies.Token ||
        const token =req.cookies.Token || req.header("Authorization")?.replace(/^Bearer\s+/i, "") ;
        if (!token) {
            return res.status(401).json({ success: false, message: "Token missing" });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = payload.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token", error: error.message });
    }
};
router.get("/contacts-unseen-messages",authenticateToken, getUsers);
router.get("/read-messages/:id",authenticateToken, getMessages);
router.put("/mark-seen/:id",authenticateToken, markMessagesSeen);
router.post("/send-message/:id",authenticateToken,message_image_object.single("image"), sendMessage);
export default router;