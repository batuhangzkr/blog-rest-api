import { Request, Response } from 'express';
import Post from '../models/Post';


interface AuthRequest extends Request {
    userId?: string;
}


// Blog Yazısı Oluşturma
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    const { title, content, tags, category, publishedAt } = req.body;

    try {
        const newPost = new Post({
            title,
            content,
            author: req.userId,
            tags,
            category,
            publishedAt,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Blog yazısı oluşturulurken bir hata oluştu', error });
    }
};

// Blog Yazısı Güncelleme
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
    const { title, content, tags, category, publishedAt } = req.body;

    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.postId, author: req.userId },
            { title, content, tags, category, publishedAt },
            { new: true }
        );

        if (!post) {
            res.status(404).json({ message: 'Blog yazısı bulunamadı veya yetkiniz yok' });
            return;
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Blog yazısı güncellenirken bir hata oluştu', error });
    }
};

// Blog Yazısı Silme
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.postId, author: req.userId });

        if (!post) {
            res.status(404).json({ message: 'Blog yazısı bulunamadı veya yetkiniz yok' });
            return;
        }

        res.status(200).json({ message: 'Blog yazısı başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Blog yazısı silinirken bir hata oluştu', error });
    }
};

// Blog Yazısı Arama ve Filtreleme
export const searchPosts = async (req: Request, res: Response): Promise<void> => {
    const { author, tags, category, fromDate, toDate } = req.query;

    try {
        const query: any = {};
        if (author) query.author = author;
        if (tags) query.tags = { $in: tags };
        if (category) query.category = category;
        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate as string);
            if (toDate) query.createdAt.$lte = new Date(toDate as string);
        }

        const posts = await Post.find(query).populate('author', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Blog yazıları aranırken bir hata oluştu', error });
    }
};
