import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';


interface AuthRequest extends Request {
    userId?: string;
}

// Profil Görüntüleme
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId); // req.userId JWT doğrulaması sonrası eklenecek
        if (!user) {
            res.status(404).json({ message: 'Kullanıcı bulunamadı' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Profil getirilirken bir hata oluştu', error });
    }
};



// Profil Fotoğrafı Yükleme
export const uploadProfilePhoto = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: 'Kullanıcı bulunamadı' });
            return;
        }

        // Multer ile yüklenen dosyanın adını profileImage olarak kaydet
        if (req.file) {
            user.profileImage = req.file.filename;
            await user.save();
            res.status(200).json({ message: 'Profil fotoğrafı başarıyla yüklendi', profileImage: user.profileImage });
        } else {
            res.status(400).json({ message: 'Lütfen bir dosya yükleyin' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Profil fotoğrafı yüklenirken bir hata oluştu', error });
    }
};

// Profil Güncelleme
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const { username, email, password, profileImage } = req.body;

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: 'Kullanıcı bulunamadı' });
            return;
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (profileImage) user.profileImage = profileImage;

        await user.save();
        res.status(200).json({ message: 'Profil başarıyla güncellendi' });
    } catch (error) {
        res.status(500).json({ message: 'Profil güncellenirken bir hata oluştu', error });
    }
};
