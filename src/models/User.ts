import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profileImage?: string;
    isEmailVerified: boolean;
    verificationCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    verificationCode: { type: String }, // E-posta doğrulama kodu
}, { timestamps: true });

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
