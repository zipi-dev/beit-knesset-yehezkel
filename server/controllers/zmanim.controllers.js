import { GeoLocation, ComplexZmanimCalendar } from "kosher-zmanim";

// הגדרת מערך מרכזי הכולל את הנתונים לכל עיר
const cities = [
    { name: "Jerusalem", lat: 31.7683, lng: 35.2137, elevation: 800 },
    { name: "Tel Aviv", lat: 32.0853, lng: 34.7818, elevation: 5 },
    { name: "Haifa", lat: 32.7940, lng: 34.9896, elevation: 50 }
];

/**
 * פונקציית עזר להמרת אובייקט Date של ג'אווהסקריפט לשעת מחרוזת נקייה (HH:mm)
 */
const formatTime = (dateObj) => {
    if (!dateObj) return null;
    return new Date(dateObj).toLocaleTimeString('he-IL', { 
        timeZone: 'Asia/Jerusalem', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
};

/**
 * פונקציה ראשית המחזירה את זמני היום עבור כל הערים (ירושלים, תל אביב, חיפה)
 * @param {Date} targetDate - תאריך אופציונלי (ברירת מחדל: היום)
 */
export const getAllCitiesZmanim = (targetDate = new Date()) => {
    return cities.map(city => {
        const geoLocation = new GeoLocation(
            city.name, 
            city.lat, 
            city.lng, 
            city.elevation, 
            "Asia/Jerusalem"
        );
        
        const calendar = new ComplexZmanimCalendar(geoLocation);
        // הגדרת התאריך המבוקש בלוח האסטרונומי
        calendar.setDate(targetDate);

        return {
            cityName: city.name,
            sunset: formatTime(calendar.getSunset()),
            candleLighting: formatTime(calendar.getCandleLighting()),
            tzeis: formatTime(calendar.getTzais()),
            sunrise: formatTime(calendar.getSunrise()) // המלצה: נוסף גם הנץ חמה
        };
    });
};
//???
/**
 * פונקציה שליפה לעיר ספציפית לפי שם (למקרה שצריך רק את חיפה או ירושלים)
 */
// export const getCityZmanimByName = (cityName, targetDate = new Date()) => {
//     const allZmanim = getAllCitiesZmanim(targetDate);
//     return allZmanim.find(c => c.cityName.toLowerCase() === cityName.toLowerCase());
// };