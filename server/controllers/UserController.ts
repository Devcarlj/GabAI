import { Request, Response } from 'express';
import sendEmail from '../config/sendEmail.js';
import UserModel from '../models/User.js';
import bcryptjs from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefereshToken from '../utils/generatedRefreshToken.js';
import uploadImageCloudinary, { CLOUDINARY_FOLDERS, getPublicIdFromUrl } from '../utils/uploadImageCloudinary.js';
import generatedOtp from '../utils/generatedOtp.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import EmailSettingsModel from '../models/EmailSettings.js';

interface JwtPayload {
    id: string;
}

async function getEmailSettings(): Promise<any> {
    let settings = await EmailSettingsModel.findOne({});
    return settings || {};
}

// Register Controller
export async function registerUserController(request: Request, response: Response): Promise<Response> {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide email, name, and password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (user) {
            return response.json({
                message: "Email is already registered",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password: hashPassword
        });
        
        const save = await newUser.save();
        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

        try {
            const emailSettings = await getEmailSettings();
            if (emailSettings.registration !== false) {
                await sendEmail({
                    sendTo: email,
                    subject: "Verify your Command Center Account",
                    html: verifyEmailTemplate({ name, url: verifyEmailUrl })
                });
            }
        } catch (error) {
            console.error("Email failed to send:", error);
        }

        return response.json({
            message: "User registered successfully. Please check your email to verify.",
            error: false,
            success: true
        });

    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Verify Email Controller
export async function verifyEmailController(request: Request, response: Response): Promise<Response> {
    try {
        const { code } = request.body;

        const user = await UserModel.findOne({ _id: code });

        if (!user) {
            return response.status(400).json({
                message: "Invalid or expired code",
                error: true,
                success: false
            });
        }

        await UserModel.updateOne({ _id: code }, { verify_email: true });

        return response.json({
            message: "Email verification completed successfully.",
            success: true,
            error: false
        });

    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Login Controller
export async function loginController(request: Request, response: Response): Promise<Response> {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Please provide email and password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "User not registered",
                error: true,
                success: false
            });
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: "Account suspended or inactive. Please contact your administrator.",
                error: true,
                success: false
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            });
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefereshToken(user._id);

        await UserModel.findByIdAndUpdate(user._id, {
            last_login_date: new Date()
        });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        response.cookie('accessToken', accessToken, cookieOptions);
        response.cookie('refreshToken', refreshToken, cookieOptions);

        return response.json({
            message: "Logged in successfully",
            error: false,
            success: true,
            data: { accessToken, refreshToken }
        });

    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Logout Controller
export async function logoutController(request: Request, response: Response): Promise<Response> {
    try {
        const userId = request.userId;

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none" as const
        };

        response.clearCookie("accessToken", cookieOptions);
        response.clearCookie("refreshToken", cookieOptions);

        if (userId) {
            await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });
        }

        return response.json({
            message: "Logged out successfully",
            error: false,
            success: true
        });

    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Upload Avatar
export async function uploadUserAvatar(request: Request, response: Response): Promise<Response> {
    try {
        const userId = request.userId;
        const image = request.file;

        if (!image) {
            return response.status(400).json({ message: "No image file provided", error: true });
        }

        const user = await UserModel.findById(userId);

        if (user?.avatar && user.avatar.includes("cloudinary")) {
            try {
                const publicId = getPublicIdFromUrl(user.avatar);
                if (publicId) await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.error("Old avatar cleanup failed:", deleteError);
            }
        }

        const upload = await uploadImageCloudinary(image, CLOUDINARY_FOLDERS.AVATAR);

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        }, { new: true }).select('-password -refresh_token');

        return response.json({
            message: "Profile avatar updated successfully",
            success: true,
            error: false,
            data: updateUser
        });

    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Delete Avatar
export async function deleteUserAvatar(request: Request, response: Response): Promise<Response> {
    try {
        const userId = request.userId;
        const user = await UserModel.findById(userId);

        if (!user) {
            return response.status(400).json({ message: "User not found", error: true });
        }

        if (!user.avatar) {
            return response.status(400).json({ message: "No avatar exists to delete", error: true });
        }

        if (user.avatar.includes("cloudinary")) {
            const publicId = getPublicIdFromUrl(user.avatar);
            if (publicId) await cloudinary.uploader.destroy(publicId);
        }

        user.avatar = "";
        await user.save();

        return response.json({ message: "Avatar deleted successfully", success: true, error: false });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true });
    }
}

// Update User Details
export async function updateUserDetails(request: Request, response: Response): Promise<Response> {
    try {
        const userId = request.userId;
        const { name, email, mobile, password } = request.body;

        let hashPassword = "";
        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt);
        }

        const updatedFields: any = {};
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (mobile) updatedFields.mobile = mobile;
        if (password) updatedFields.password = hashPassword;

        const updateUser = await UserModel.findByIdAndUpdate(userId, updatedFields, { new: true })
            .select('-password -refresh_token');

        return response.json({
            message: "Profile details updated successfully",
            error: false,
            success: true,
            data: updateUser
        });

    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Forgot Password Request
export async function forgotPasswordController(request: Request, response: Response): Promise<Response> {
    try {
        const { email } = request.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email is not registered",
                error: true,
                success: false
            });
        }

        const otp = generatedOtp();
        const expireTime = Date.now() + 60 * 60 * 1000; // 1 hour

        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime)
        });

        try {
            const emailSettings = await getEmailSettings();
            if (emailSettings.forgotPassword !== false) {
                await sendEmail({
                    sendTo: email,
                    subject: "Reset Password OTP Verification",
                    html: forgotPasswordTemplate({ name: user.name, otp: otp })
                });
            }
        } catch (error) {
            console.error("Recovery email failed to dispatch:", error);
        }

        return response.json({
            message: "Verification OTP dispatched. Please inspect your email inbox.",
            error: false,
            success: true
        });

    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Verify OTP
export async function verifyOtpForgotPassword(request: Request, response: Response): Promise<Response> {
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                message: "Please provide email and OTP code",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({ message: "Email not registered", error: true, success: false });
        }

        if (!user.forgot_password_expiry || user.forgot_password_expiry < new Date()) {
            return response.status(400).json({ message: "OTP code has expired", error: true, success: false });
        }

        if (String(otp) !== String(user.forgot_password_otp)) {
            return response.status(400).json({ message: "Invalid verification OTP code", error: true, success: false });
        }

        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: null,
            forgot_password_expiry: null
        });

        return response.json({
            message: "OTP validation successful.",
            error: false,
            success: true
        });

    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Reset Password Action
export async function resetPassword(request: Request, response: Response): Promise<Response> {
    try {
        const { email, newPassword, confirmPassword } = request.body;

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide email, newPassword, and confirmPassword fields"
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({ message: "Email is not registered", error: true, success: false });
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({ message: "Passwords do not match", error: true, success: false });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);
        
        await UserModel.findByIdAndUpdate(user._id, { password: hashPassword });

        return response.json({
            message: "Password reset completed successfully",
            error: false,
            success: true
        });

    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Refresh Token Execution
export async function refreshToken(request: Request, response: Response): Promise<Response> {
    try {
        const token = request.cookies?.refreshToken || request.headers?.authorization?.split(" ")[1];

        if (!token) {
            return response.status(401).json({ message: "Token missing", error: true, success: false });
        }

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY_REFRESH_TOKEN as string) as JwtPayload;

        if (!verifyToken) {
            return response.status(401).json({ message: "Token expired or corrupted", error: true, success: false });
        }

        const newAccessToken = await generatedAccessToken(verifyToken.id);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        response.cookie('accessToken', newAccessToken, cookieOptions);

        return response.json({
            message: "Renewed session authentication state successfully",
            error: false,
            success: true,
            data: { accessToken: newAccessToken }
        });

    } catch (error: any) {
        return response.status(401).json({
            message: error.message || "Invalid or expired authorization tokens",
            error: true,
            success: false
        });
    }
}

// Get Authenticated User Profile
export async function userDetails(request: Request, response: Response): Promise<Response> {
    try {
        const userId = request.userId;
        const user = await UserModel.findById(userId)
            .select('-password -refresh_token')
            .populate('currentActiveTicketId')
            .populate('ticketHistory');

        if (!user) {
            return response.status(401).json({ message: "User session context missing", error: true, success: false });
        }

        return response.json({
            message: "User operational dashboard context loaded",
            data: user,
            error: false,
            success: true
        });
    } catch (error: any) {
        return response.status(500).json({ message: "Dashboard session read fault", error: true, success: false });
    }
}