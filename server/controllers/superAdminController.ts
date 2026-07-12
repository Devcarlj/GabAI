import { Request, Response } from "express";
import UserModel from "../models/User.js";
import EmailSettingsModel from "../models/EmailSettings.js";
import mongoose from "mongoose";

async function getOrCreateEmailSettings() {
    let settings = await EmailSettingsModel.findOne({});
    if (!settings) {
        settings = await EmailSettingsModel.create({});
    }
    return settings;
}

// Read System Email Settings
export async function getEmailSettings(request: Request, response: Response): Promise<Response> {
    try {
        const settings = await getOrCreateEmailSettings();
        return response.json({
            message: "Incident triggers configuration state read",
            error: false,
            success: true,
            data: settings
        });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

// Save Updated System Email Settings
export async function updateEmailSettings(request: Request, response: Response): Promise<Response> {
    try {
        const {
            registration,
            emailVerification,
            forgotPassword,
            criticalTicketAlert,
            ticketAssignmentUpdate,
            ticketResolutionSummary
        } = request.body;

        const settings = await getOrCreateEmailSettings();

        if (registration !== undefined) settings.registration = registration;
        if (emailVerification !== undefined) settings.emailVerification = emailVerification;
        if (forgotPassword !== undefined) settings.forgotPassword = forgotPassword;
        if (criticalTicketAlert !== undefined) settings.criticalTicketAlert = criticalTicketAlert;
        if (ticketAssignmentUpdate !== undefined) settings.ticketAssignmentUpdate = ticketAssignmentUpdate;
        if (ticketResolutionSummary !== undefined) settings.ticketResolutionSummary = ticketResolutionSummary;

        await settings.save();

        return response.json({
            message: "System emergency notifications routing adjusted successfully.",
            error: false,
            success: true,
            data: settings
        });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

// Read All Registered Administrators
export async function getAdmins(request: Request, response: Response): Promise<Response> {
    try {
        const admins = await UserModel.find({ role: 'ADMIN' })
            .select('_id name email avatar createdAt last_login_date status isHandlingActiveTicket')
            .sort({ createdAt: -1 });

        return response.json({
            message: "Command center management directory successfully loaded",
            error: false,
            success: true,
            data: admins
        });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

// Promote User Account to Administrator Role
export async function addAdmin(request: Request, response: Response): Promise<Response> {
    try {
        const { email } = request.body;

        if (!email) {
            return response.status(400).json({ message: "Account mapping parameter 'email' missing", error: true, success: false });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(404).json({ message: "Account matching target criteria missing", error: true, success: false });
        }

        if (user.role === 'SUPERADMIN') {
            return response.status(400).json({ message: "Super Admin authorization states cannot be altered", error: true, success: false });
        }

        if (user.role === 'ADMIN') {
            return response.status(400).json({ message: "User account holds command credentials already", error: true, success: false });
        }

        user.role = 'ADMIN';
        await user.save();

        return response.json({
            message: `${user.name} elevated to Admin workspace clearances successfully`,
            error: false,
            success: true,
            data: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

// Demote Administrator Account Back to Basic User Permissions
export async function removeAdmin(request: Request, response: Response): Promise<Response> {
    try {
        const { email } = request.body;

        if (!email) {
            return response.status(400).json({ message: "Email parameter required", error: true, success: false });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(404).json({ message: "User registration file missing", error: true, success: false });
        }

        if (user.role === 'SUPERADMIN') {
            return response.status(400).json({ message: "Super Admin privileges cannot be stripped", error: true, success: false });
        }

        if (user.role !== 'ADMIN') {
            return response.status(400).json({ message: "Account does not possess dispatcher clearance rules", error: true, success: false });
        }

        user.role = 'USER';
        await user.save();

        return response.json({
            message: `${user.name} demoted to standard user level access restrictions`,
            error: false,
            success: true
        });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

// Lookup Account by Email Vector
export async function checkUserByEmail(request: Request, response: Response): Promise<Response> {
    try {
        const { email } = request.body;

        if (!email) {
            return response.status(400).json({ message: "Target search string missing", error: true, success: false });
        }

        const user = await UserModel.findOne({ email }).select('_id name email role avatar status isHandlingActiveTicket');

        if (!user) {
            return response.status(404).json({ message: "Account record file not found within directory", error: true, success: false });
        }

        return response.json({ message: "Registry record targeted", error: false, success: true, data: user });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

// Load and Paginate User Registry Documents
export async function getAllUsers(request: Request, response: Response): Promise<Response> {
    try {
        const page = Math.max(1, parseInt(request.query.page as string) || 1);
        const limit = Math.min(50, parseInt(request.query.limit as string) || 20);
        const search = ((request.query.search as string) || '').trim();
        const status = (request.query.status as string) || '';

        const query: any = { role: { $in: ['USER', 'ADMIN'] } };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (status && ['Active', 'Inactive', 'Suspended'].includes(status)) {
            query.status = status;
        }

        const total = await UserModel.countDocuments(query);
        const users = await UserModel.find(query)
            .select('_id name email avatar role status mobile verify_email last_login_date createdAt isHandlingActiveTicket')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return response.json({
            message: 'User workspace registry array loaded',
            error: false,
            success: true,
            data: { users, total, page, totalPages: Math.ceil(total / limit) }
        });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

// Fetch Full Profile Specs by ID Reference Block
export async function getUserById(request: Request, response: Response): Promise<Response> {
    try {
        const id = request.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: 'Malformed data serialization handle inside request parameters', error: true, success: false });
        }

        const user = await UserModel.findById(id)
            .select('-password -refresh_token -forgot_password_otp -forgot_password_expiry');

        if (!user) {
            return response.status(404).json({ message: 'Registry account path target missing', error: true, success: false });
        }

        if (user.role === 'SUPERADMIN') {
            return response.status(403).json({ message: 'Access Restricted. Super Admin properties isolated.', error: true, success: false });
        }

        return response.json({ message: 'User file data read complete', error: false, success: true, data: user });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

// Administrative Directory Updates
export async function updateUserById(request: Request, response: Response): Promise<Response> {
    try {
        const id = request.params.id as string;
        const { name, mobile, status } = request.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: 'Malformed object handling request reference', error: true, success: false });
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return response.status(404).json({ message: 'Target entry node missing in DB storage', error: true, success: false });
        }

        if (user.role === 'SUPERADMIN') {
            return response.status(403).json({ message: 'Super Admin node instances are protected from basic dashboard mutations', error: true, success: false });
        }

        if (name !== undefined) user.name = name;
        if (mobile !== undefined) user.mobile = mobile;
        if (status !== undefined && ['Active', 'Inactive', 'Suspended'].includes(status)) {
            user.status = status;
        }

        await user.save();

        return response.json({
            message: `Operational registry state file for ${user.name} modified successfully`,
            error: false,
            success: true,
            data: { _id: user._id, name: user.name, email: user.email, mobile: user.mobile, status: user.status, role: user.role }
        });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

// Permanent Database Purge Action
export async function deleteUserById(request: Request, response: Response): Promise<Response> {
    try {
        const id = request.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: 'Target payload object format validation mismatch', error: true, success: false });
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return response.status(404).json({ message: 'Account context footprint missing', error: true, success: false });
        }

        if (user.role === 'SUPERADMIN') {
            return response.status(403).json({ message: 'Action prohibited. Isolated system instance.', error: true, success: false });
        }

        await UserModel.findByIdAndDelete(id);

        return response.json({
            message: `Account database instance record tracking ${user.name} permanently purged.`,
            error: false,
            success: true
        });
    } catch (error: any) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}