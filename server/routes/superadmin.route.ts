import { Router } from "express";
import {
    getEmailSettings,
    updateEmailSettings,
    getAdmins,
    addAdmin,
    removeAdmin,
    checkUserByEmail,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
} from "../controllers/superAdminController.js";
import auth from "../middleware/auth.js";
import { superadmin } from "../middleware/role.js";

const superAdminRouter = Router();

// Secure entire route branch under authenticated Super Admin permissions
superAdminRouter.use(auth, superadmin);

// System Trigger Flags Configuration
superAdminRouter.get("/email-settings", getEmailSettings);
superAdminRouter.put("/email-settings", updateEmailSettings);

// Dispatcher Registry Verification & Clearances
superAdminRouter.get("/admins", getAdmins);
superAdminRouter.post("/admins/add", addAdmin);
superAdminRouter.post("/admins/remove", removeAdmin);

// Operational User Base Auditing & Directory
superAdminRouter.post("/search-email", checkUserByEmail);
superAdminRouter.get("/users", getAllUsers);
superAdminRouter.get("/users/:id", getUserById);
superAdminRouter.put("/users/:id", updateUserById);
superAdminRouter.delete("/users/:id", deleteUserById);

export default superAdminRouter;