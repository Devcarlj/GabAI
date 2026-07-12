import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const trimEnv = (value: string | undefined): string | undefined =>
    value?.trim() || undefined;

const configureCloudinary = () => {
    const cloudName = trimEnv(process.env.CLOUDINARY_CLOUD_NAME);
    const apiKey = trimEnv(process.env.CLOUDINARY_API_KEY);
    const apiSecret = trimEnv(process.env.CLOUDINARY_API_SECRET_KEY);

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error(
            'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET_KEY.'
        );
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });
};

configureCloudinary();

const enrichCloudinaryError = (error: unknown): Error => {
    const cloudinaryError = error as { http_code?: number; message?: string };
    if (cloudinaryError?.http_code === 403) {
        return new Error(
            'Cloudinary rejected the upload (403). Your API key lacks upload permissions. ' +
            'In Cloudinary Console go to Settings > API Keys, assign an upload-enabled role to your key ' +
            '(or use the root API key), then update your Cloudinary credentials in server/.env.'
        );
    }

    if (error instanceof Error) {
        return error;
    }

    return new Error(cloudinaryError?.message || String(error));
};

/** Folder structural configurations updated specifically for the Incident Command Triage Hub mapping */
export const CLOUDINARY_FOLDERS = {
    AVATAR: 'triage_command/avatar',
    INCIDENTS: 'triage_command/incidents',
};

/**
 * Parses out Cloudinary public_id from resource URLs across any specific folder depth
 */
export const getPublicIdFromUrl = (url: string | undefined | null): string | null => {
    if (!url || !url.includes('cloudinary')) return null;
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // After "upload", cross the API version identifier block (e.g. v177...), then gather the clean asset paths
    const pathWithExt = parts.slice(uploadIndex + 2).join('/');
    return decodeURIComponent(pathWithExt.replace(/\.[^/.]+$/, '')); // strike file extensions and decode URI symbols
};

interface ExpressFileMock {
    buffer: Buffer;
    arrayBuffer?: () => Promise<ArrayBuffer>;
}

const uploadImageCloudinary = async (image: any, folder: string = CLOUDINARY_FOLDERS.INCIDENTS): Promise<UploadApiResponse> => {
    let buffer: Buffer;
    
    if (image?.buffer) {
        buffer = image.buffer;
    } else if (typeof image?.arrayBuffer === 'function') {
        buffer = Buffer.from(await image.arrayBuffer());
    } else {
        throw new Error("Invalid format footprint: Cloudinary uploader could not read file data streams.");
    }

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET_KEY) {
        throw new Error(
            'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET_KEY.'
        );
    }
    const uploadImage = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, uploadResult) => {
            if (error) {
                return reject(enrichCloudinaryError(error));
            }
            if (!uploadResult) {
                return reject(new Error("Cloudinary engine context processed an empty return payload."));
            }
            return resolve(uploadResult);
        }).end(buffer);
    });

    return uploadImage;
};

export const deleteImageCloudinary = async (publicId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error("Cloudinary Error:", error);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

export const deleteFolderCloudinary = async (folderPath: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        cloudinary.api.delete_folder(folderPath, (error: unknown, result: unknown) => {
            if (error) {
                console.error("Cloudinary Folder Error:", error);
                resolve(error);
            } else {
                resolve(result);
            }
        });
    });
};

export default uploadImageCloudinary;