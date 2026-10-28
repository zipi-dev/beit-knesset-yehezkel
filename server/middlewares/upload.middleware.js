// multer = הספרייה שמקבלת קובץ שנשלח מהדפדפן.
// memoryStorage = הקובץ נשאר בזיכרון לרגע, ומיד עובר ל-Cloudinary (לא נשמר בדיסק של השרת).
import multer from 'multer';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_SIZE },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
        cb(new Error('ניתן להעלות רק תמונות מסוג JPG, PNG, WEBP או GIF'));
    }
}).single('image'); // 'image' = שם השדה ששולחים מהדפדפן

// עוטפים את multer כדי ששגיאות העלאה יחזרו ללקוח כשגיאה ברורה (400) ולא כשגיאת שרת
export const uploadImage = (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) return next();
        const message = err.code === 'LIMIT_FILE_SIZE'
            ? 'התמונה גדולה מדי (מקסימום 5MB)'
            : err.message;
        next({ status: 400, type: 'Upload Error', error: { message } });
    });
};
