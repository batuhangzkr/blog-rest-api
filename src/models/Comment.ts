import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    post: mongoose.Schema.Types.ObjectId;
    likes: number;
    replies: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    likes: { type: Number, default: 0 }, // Yorum beğenileri
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Yanıt olarak yapılan yorumlar
}, { timestamps: true }); // createdAt ve updatedAt otomatik olarak eklenecek

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
