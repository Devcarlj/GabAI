import UserModel from "../models/User.js";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generatedRefereshToken = async (userId: mongoose.Types.ObjectId | string): Promise<string> => {
    if (!process.env.SECRET_KEY_REFRESH_TOKEN) {
        throw new Error("SECRET_KEY_REFRESH_TOKEN is missing from your system configuration environments.");
    }

    const token = jwt.sign(
        { id: userId.toString() }, 
        process.env.SECRET_KEY_REFRESH_TOKEN, 
        { expiresIn: '7d' }
    );

    await UserModel.updateOne(
        { _id: userId }, 
        { refresh_token: token }
    );

    return token;
};

export default generatedRefereshToken;