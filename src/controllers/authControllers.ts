import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail kullanıyorsanız
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Bu e-posta ile bir kullanıcı zaten mevcut' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // E-posta doğrulama kodu oluşturma
        const verificationCode = crypto.randomBytes(20).toString('hex');

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verificationCode,
        });

        await newUser.save();

        // E-posta gönderme
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'E-posta Doğrulama',
            text: `Merhaba ${username}, hesabınızı doğrulamak için aşağıdaki kodu kullanın: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('E-posta gönderilirken hata oluştu:', error);
            } else {
                console.log('E-posta gönderildi:', info.response);
            }
        });

        res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi. Lütfen e-posta adresinizi doğrulayın.' });
    } catch (error) {
        res.status(500).json({ message: 'Kayıt olurken bir hata oluştu', error });
    }
};

// E-posta Doğrulama
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { email, verificationCode } = req.body;

    try {
        const user = await User.findOne({ email, verificationCode });
        if (!user) {
            res.status(400).json({ message: 'Geçersiz doğrulama kodu veya e-posta' });
            return;
        }

        user.isEmailVerified = true;
        user.verificationCode = ''; // Doğrulama kodunu temizleyelim
        await user.save();

        res.status(200).json({ message: 'E-posta başarıyla doğrulandı' });
    } catch (error) {
        res.status(500).json({ message: 'E-posta doğrulanırken bir hata oluştu', error });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Geçersiz kimlik bilgileri' });
            return;
        }

        // E-posta doğrulaması kontrolü
        if (!user.isEmailVerified) {
            res.status(403).json({ message: 'Lütfen e-posta adresinizi doğrulayın' });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: 'Geçersiz kimlik bilgileri' });
            return;
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Giriş başarılı', token });
    } catch (error) {
        res.status(500).json({ message: 'Giriş yaparken bir hata oluştu', error });
    }
};

