import mongoose, { Schema, Document } from 'mongoose';

interface IPost extends Document {
    title: string;
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    tags: string[];
    category: string;
    likes: number;
    comments: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }], // Etiketler
    category: { type: String, required: true }, // Kategori
    likes: { type: Number, default: 0 }, // Beğeni sayısı
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Yorumlar
    publishedAt: { type: Date }, // Yayınlanma tarihi
}, { timestamps: true }); // createdAt ve updatedAt otomatik olarak eklenecek

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;
