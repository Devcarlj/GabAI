import mongoose from "mongoose";

const emailSettingsSchema = new mongoose.Schema({
    // Account System Toggles
    registration: {
        type: Boolean,
        default: true
    },
    emailVerification: {
        type: Boolean,
        default: true
    },
    forgotPassword: {
        type: Boolean,
        default: true
    },

    // 🚨 Emergency & Triage Notification Toggles
    criticalTicketAlert: {
        type: Boolean,
        default: true // Sends urgent notifications to Admins/Superadmins for CRITICAL or HIGH priority tickets
    },
    ticketAssignmentUpdate: {
        type: Boolean,
        default: true // Notifies a field responder or handler when they are assigned to an active ticket
    },
    ticketResolutionSummary: {
        type: Boolean,
        default: true // Sends a summary to relevant personnel when an incident ticket is closed/resolved
    }
}, { timestamps: true });

const EmailSettingsModel = mongoose.model("EmailSettings", emailSettingsSchema);

export default EmailSettingsModel;