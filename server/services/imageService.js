// שירות תמונות: העלאה ומחיקה ב-Cloudinary
import cloudinary from '../config/cloudinary.js';

/**
 * מעלה תמונה (שנמצאת בזיכרון כ-buffer) ל-Cloudinary
 * @returns {Promise<{url: string, publicId: string}>}
 *   url      - הכתובת שמציגים באתר
 *   publicId - "תעודת הזהות" של התמונה ב-Cloudinary (צריך אותה כדי למחוק אותה אחר כך)
 */
export const uploadImageBuffer = (buffer, folder = 'events') =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: `beit-knesset/${folder}`, resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        stream.end(buffer);
    });

// מוחק תמונה מ-Cloudinary. אם המחיקה נכשלת - לא מפילים את הבקשה, רק רושמים בלוג
export const deleteImage = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
    }
};
