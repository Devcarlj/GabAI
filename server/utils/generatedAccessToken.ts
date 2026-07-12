import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generatedAccessToken = async (userId: mongoose.Types.ObjectId | string): Promise<string> => {
    if (!process.env.SECRET_KEY_ACCESS_TOKEN) {
        throw new Error("SECRET_KEY_ACCESS_TOKEN is missing from your system configuration environments.");
    }

    const token = jwt.sign(
        { id: userId.toString() }, 
        process.env.SECRET_KEY_ACCESS_TOKEN, 
        { expiresIn: '5h' }
    );

    return token;
};

export default generatedAccessToken;