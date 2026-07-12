import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

// Extend Express Request interface to recognize our custom injected properties
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: {
                _id: string;
                role: "SUPERADMIN" | "ADMIN" | "USER";
                email: string;
            };
        }
    }
}

interface JwtPayload {
    id: string;
    role: "SUPERADMIN" | "ADMIN" | "USER";
}

const auth = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.cookies?.accessToken || request.headers.authorization?.split(" ")[1];

        if (!token) {
            return response.status(401).json({
                message: "Provide token",
                error: true,
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN as string) as JwtPayload;
        if (!decode) {
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            });
        }

        request.userId = decode.id;
        next();
    } catch (error) {
        return response.status(401).json({
            message: "Invalid or expired token",
            error: true,
            success: false
        });
    }
};

/** 
 * Identifies the user if a token is present, but doesn't fail for guest access
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN as string) as JwtPayload;
            if (decoded) {
                req.userId = decoded.id;
            }
        }
        next();
    } catch (error) {
        next(); // Silent fallback for optional auth
    }
};

/** 
 * If a userId is present, fetches operational details and attaches to req.user
 */
export const optionalUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.userId) {
            const user = await UserModel.findById(req.userId).select('role email');
            if (user) {
                req.user = {
                    _id: user._id.toString(),
                    role: user.role as "SUPERADMIN" | "ADMIN" | "USER",
                    email: user.email
                };
            }
        }
        next();
    } catch (error) {
        next();
    }
};

export default auth;