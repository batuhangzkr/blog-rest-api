import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import likeRoutes from './routes/likeRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log('Veritabanına bağlantı başarılı'))
    .catch((error) => console.log('Veritabanı bağlantı hatası:', error));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route’lar
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/like', likeRoutes)
app.use('/api/comment', commentRoutes)

app.get('/', (req, res) => {
    res.send('Blog API Çalışıyor!');
});

// Sunucu Başlatma
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
