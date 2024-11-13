import multer from 'multer';
import path from 'path';

// Dosyanın nereye ve hangi isimle kaydedileceğini belirleyen ayarlar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Dosyalar uploads klasörüne kaydedilecek
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

// Dosya türü kontrolü
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Yalnızca JPEG veya PNG dosyaları yüklenebilir.'), false);
    }
};

// Multer yapılandırması
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: fileFilter,
});

export default upload;
