import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    userId?: string;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Erişim engellendi. Token bulunamadı.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.userId = decoded.id; // userId'yi AuthRequest türünde tanımlıyoruz
        next();
    } catch (error) {
        res.status(401).json({ message: 'Geçersiz token.' });
    }
};

export default authMiddleware;
