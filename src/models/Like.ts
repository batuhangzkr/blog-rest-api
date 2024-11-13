import mongoose, { Schema, Document } from 'mongoose';

interface ILike extends Document {
    user: mongoose.Schema.Types.ObjectId;
    post?: mongoose.Schema.Types.ObjectId;
    comment?: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}

const LikeSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Like = mongoose.model<ILike>('Like', LikeSchema);
export default Like;
