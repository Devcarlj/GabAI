import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide Name"]
    },

    email: {
        type: String,
        required: [true, "Provide Email"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Provide Password"]
    },

    avatar: {
        type: String,
        default: ""
    },

    mobile: {
        type: Number,
        default: null
    },

    role: {
        type: String,
        enum: ["SUPERADMIN", "ADMIN", "USER"],
        default: "USER"
    },

    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },

    // Tracks if a dispatcher/user is currently deployed or managing an live incident
    isHandlingActiveTicket: {
        type: Boolean,
        default: false
    },

    // Reference pointer to the actual ticket document they are currently attending to
    currentActiveTicketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        default: null
    },

    // Replaced orderHistory with a history list of all tickets this account interacted with
    ticketHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }
    ],

    refresh_token: {
        type: String,
        default: ""
    },

    verify_email: {
        type: Boolean,
        default: false
    },

    last_login_date: {
        type: Date,
        default: null
    },

    forgot_password_otp: {
        type: String,
        default: null
    },

    forgot_password_expiry: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;