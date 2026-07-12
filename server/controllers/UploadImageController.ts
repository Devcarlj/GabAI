import { Request, Response } from "express";
import uploadImageCloudinary, { CLOUDINARY_FOLDERS } from "../utils/uploadImageCloudinary.js";

export const uploadImagesController = async (request: Request, response: Response): Promise<Response> => {
    try {
        const file = request.file;

        if (!file) {
            return response.status(400).json({
                message: "No document image asset file provided inside request package",
                error: true,
                success: false
            });
        }

        // Defaults to incidents folder asset collection if no custom scope folder is passed
        const folder = request.body.folder || CLOUDINARY_FOLDERS.INCIDENTS || "triage_incidents";
        const upload = await uploadImageCloudinary(file, folder);

        return response.json({
            message: "Triage asset imagery storage write complete",
            data: upload, // Holds .url tracking links and security .public_id metrics
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
};

export default uploadImagesController;