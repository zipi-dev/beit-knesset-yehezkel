import { model, Schema } from "mongoose";

// סכימה פנימית המייצגת תפילה בודדת
const prayerSchema = new Schema({
    name: { type: String, required: true, trim: true }, // שם התפילה (למשל: "שחרית", "מוסף", "נעילה")
    time: { type: String, required: true, trim: true }, // שעת התפילה (למשל: "07:30")
    notes: { type: String, trim: true } // הערות לגבאי (למשל: "הודו", "בבית המדרש למטה")
});

// הסכימה המרכזית של לוח הזמנים
const scheduleSchema = new Schema({
    title: { type: String, required: true, trim: true }, // כותרת הלוח (למשל: "ימי חול חורף", "ראש השנה")
    date: { type: Date }, // אופציונלי: תאריך ספציפי אם הלוח מיועד לשבת או חג מסוים
    isActive: { type: Boolean, default: false }, // מאפשר לגבאי להגדיר בלחיצת כפתור איזה לוח מוצג כעת באתר
    prayers: [prayerSchema] // מערך המכיל את כל התפילות שהגבאי יצר ללוח הזה
}, {
    timestamps: true
});

export const Schedule = model('schedules', scheduleSchema);