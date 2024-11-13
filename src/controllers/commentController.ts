import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Post from '../models/Post';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
    userId?: string;
}

// Yorum Ekleme
export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
    const { content } = req.body;

    try {

        const postId = new mongoose.Types.ObjectId(req.params.postId)

        const newComment = new Comment({
            content,
            author: req.userId,
            post: postId,
        });

        await newComment.save();

        // Yorumu blog yazısına ekleyelim
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: newComment._id },
        });

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Yorum eklenirken bir hata oluştu', error });
    }
};

// Yorum Güncelleme
export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
    const { content } = req.body;

    try {
        const comment = await Comment.findOneAndUpdate(
            { _id: req.params.commentId, author: req.userId },
            { content },
            { new: true }
        );

        if (!comment) {
            res.status(404).json({ message: 'Yorum bulunamadı veya yetkiniz yok' });
            return;
        }

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Yorum güncellenirken bir hata oluştu', error });
    }
};

// Yorum Silme
export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findOneAndDelete({
            _id: req.params.commentId,
            author: req.userId,
        });

        if (!comment) {
            res.status(404).json({ message: 'Yorum bulunamadı veya yetkiniz yok' });
            return;
        }

        res.status(200).json({ message: 'Yorum başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Yorum silinirken bir hata oluştu', error });
    }
};

// Yoruma Yanıt Verme
export const replyToComment = async (req: AuthRequest, res: Response): Promise<void> => {
    const { content } = req.body;

    try {
        const reply = new Comment({
            content,
            author: req.userId,
            post: req.params.postId,
        });

        await reply.save();

        // Yanıtı ana yoruma ekleyelim
        await Comment.findByIdAndUpdate(req.params.commentId, {
            $push: { replies: reply._id },
        });

        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({ message: 'Yoruma yanıt verilirken bir hata oluştu', error });
    }
};
