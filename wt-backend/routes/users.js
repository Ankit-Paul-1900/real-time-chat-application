import express from "express";
import User from "../schemas/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { cloud_upload, imageobject } from "../middleware/upload.js";
const router = express.Router();

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

router.get("/", async (req, res) => {
    res.status(200).json({ success: true, message: "User route is working fine" })
});

router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -refreshToken -__v");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ "success": true,"message": "User profile fetched successfully", "user": user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user details", error: error.message });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "Please provide email, password, name" })
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(password, salt);
        const payload = { email, name, password: hashedpassword };
        const newUser = new User(payload);
        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully" })
    }
    catch (error) {
        res.status(500).json({ message: "Error in registering user", error: error.message })
    }
}
);


router.post("/auth/refresh", async (req, res) => {
  
    try {

        const refreshToken = req.cookies.refreshToken;

        console.log("REFRESH TOKEN:", !!refreshToken);

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        console.log("REFRESH USER:", decoded.userId);

        const newAccessToken = jwt.sign(
            {
                userId: decoded.userId
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        );

        res.cookie(
            "accessToken",
            newAccessToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
                path: "/"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Access token refreshed"
        });

    } catch (error) {

        console.error(
            "REFRESH ERROR:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
    }
)

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email, password" })
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ "success": false, "message": "User not found " })
        }
        const passwordCheck = await bcryptjs.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(401).json({ "success": false, "message": "Invalid credentials" })
        }
        const token = jwt.sign({ userId: user?._id }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" });
        res.cookie("Token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production"? "none" : "lax",
            maxAge: 15 * 60 * 1000,
            path: "/"
        }
        )
        const refreshtoken = jwt.sign({ userId: user?._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: "1d" });
       

    res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:process.env.NODE_ENV === "production"? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
        user.refreshToken = refreshtoken;
        await user.save();


        res.status(200).json({ "success": true, "message": "User logged in successfully", access_token: token, refresh_token: refreshtoken })

    }
    catch (error) {
        res.status(500).json({ message: "Error in logging in user", error: error.message })
    }
});

router.patch("/edit",
     imageobject.single('profilepic'),
      authenticateToken, 
     async (req, res) => {
    const file = req?.file;
    var userid = req.userId;
    const data = req.body;
    try{
        
        const user = await User.findById(userid);
        if (!user) {
           return  res.status(400).json({ message: `User not found!!` });
        }

        if (!file && !data) {
           return  res.status(400).json({ message: "Please provide data or an image to update." })
        }

        if (file) {
            const cloud_img = await cloud_upload(file,userid);
            console.log("cloudinary_details===>>>>", cloud_img)
            data.profilePic = {
                url: cloud_img.secure_url,
                public_id: cloud_img.public_id
            };
        }
        if (data || Object.keys(data).length > 0){
        const resp=    await User.findByIdAndUpdate(
            userid,
            { $set: data },
            {
                returnDocument: "after",           // Return updated document
                runValidators: true,           // Validate updated fields
            }).select("-password -refreshToken -__v");
        
        return res.status(200).json({"message":"Updated successfully","success":true,"data":resp})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:err.message,success:false});
    }
}
)
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    console.log("Logging out user with ID:", req.userId);
    // Optional: Remove refresh token from DB
    await User.findByIdAndUpdate(req.userId, {
      $unset: { refreshToken: "" },
    });

    // Clear the cookie
    res.clearCookie("Token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Use the same value as when setting the cookie
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Use the same value as when setting the cookie
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
});
router.get("/all-users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password -refreshToken");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;