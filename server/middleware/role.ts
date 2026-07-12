import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User.js";

export const superadmin = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.userId;

        if (!userId) {
            return response.status(401).json({
                message: "Unauthorized. Session identification missing.",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId);

        if (!user || user.role !== 'SUPERADMIN') {
            return response.status(403).json({
                message: "Access denied. Super Admin permissions required.",
                error: true,
                success: false
            });
        }

        next();
    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const admin = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.userId;

        if (!userId) {
            return response.status(401).json({
                message: "Unauthorized. Session identification missing.",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId);

        if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
            return response.status(403).json({
                message: "Access denied. Admin command clearance required.",
                error: true,
                success: false
            });
        }

        next();
    } catch (error: any) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};