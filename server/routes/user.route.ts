import { Router } from "express";
import {
    registerUserController,
    verifyEmailController,
    loginController,
    logoutController,
    uploadUserAvatar,
    deleteUserAvatar,
    updateUserDetails,
    forgotPasswordController,
    verifyOtpForgotPassword,
    resetPassword,
    refreshToken,
    userDetails
} from "../controllers/UserController.js";
import auth from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import upload from "../middleware/multer.js";

const authRouter = Router();

// Authentication Lifecycle Endpoints
authRouter.post("/register", authLimiter, registerUserController);
authRouter.post("/verify-email", verifyEmailController);
authRouter.post("/login", authLimiter, loginController);
authRouter.post("/logout", auth, logoutController);
authRouter.post("/refresh-token", refreshToken);

// Account Profile Recovery Management 
authRouter.post("/forgot-password", authLimiter, forgotPasswordController);
authRouter.post("/verify-otp", authLimiter, verifyOtpForgotPassword);
authRouter.patch("/reset-password", resetPassword);

// Authorized Operational Details & Avatar Settings
authRouter.get("/user-details", auth, userDetails);
authRouter.put("/update-profile", auth, updateUserDetails);
authRouter.patch("/avatar/upload", auth, upload.single("avatar"), uploadUserAvatar);
authRouter.delete("/avatar/delete", auth, deleteUserAvatar);

export default authRouter;