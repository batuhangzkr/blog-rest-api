import { Request, Response } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';

export const likePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            res.status(404).json({ message: 'Blog yazısı bulunamadı' });
            return;
        }

        post.likes += 1;
        await post.save();

        res.status(200).json({ message: 'Blog yazısı beğenildi', likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: 'Beğenme işlemi sırasında bir hata oluştu', error });
    }
};

export const likeComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            res.status(404).json({ message: 'Yorum bulunamadı' });
            return;
        }

        comment.likes += 1;
        await comment.save();

        res.status(200).json({ message: 'Yorum beğenildi', likes: comment.likes });
    } catch (error) {
        res.status(500).json({ message: 'Beğenme işlemi sırasında bir hata oluştu', error });
    }
};
