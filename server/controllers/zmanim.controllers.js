import { GeoLocation, ComplexZmanimCalendar } from "kosher-zmanim";

const cities = [
    { name: "Jerusalem", lat: 31.7683, lng: 35.2137, elevation: 800 },
    { name: "Tel Aviv", lat: 32.0853, lng: 34.7818, elevation: 5 },
    { name: "Haifa", lat: 32.7940, lng: 34.9896, elevation: 50 }
];

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
 * פונקציית עזר למציאת תאריך יום שישי הקרוב ויום שבת הקרוב
 */
const getUpcomingShabbatDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0: ראשון, ..., 5: שישי, 6: שבת
    
    // חישוב כמה ימים נשארו עד יום שישי הקרוב
    let daysToFri = (5 - dayOfWeek + 7) % 7;
    if (dayOfWeek === 6) {
        daysToFri = 6; // אם היום שבת, נכוון לשבת הבאה
    } else if (dayOfWeek === 5 && now.getHours() > 19) {
        daysToFri = 7; // אם כבר עבר הערב של שישי, נכוון לשבת הבאה
    }

    const friday = new Date(now);
    friday.setDate(now.getDate() + daysToFri);

    const saturday = new Date(friday);
    saturday.setDate(friday.getDate() + 1);

    return { friday, saturday };
};

export const getAllCitiesZmanim = (req, res) => {
    try {
        const { friday, saturday } = getUpcomingShabbatDates();

        const result = cities.map(city => {
            const geoLocation = new GeoLocation(
                city.name, 
                city.lat, 
                city.lng, 
                city.elevation, 
                "Asia/Jerusalem"
            );
            
            // לוח עבור יום שישי (הדלקת נרות וכניסת שבת)
            const fridayCalendar = new ComplexZmanimCalendar(geoLocation);
            fridayCalendar.setDate(friday);

            // לוח עבור יום שבת (צאת שבת)
            const saturdayCalendar = new ComplexZmanimCalendar(geoLocation);
            saturdayCalendar.setDate(saturday);

            return {
                cityName: city.name,
                candleLighting: formatTime(fridayCalendar.getCandleLighting()),
                sunsetFriday: formatTime(fridayCalendar.getSunset()),
                tzeisShabbat: formatTime(saturdayCalendar.getTzais()), // צאת שבת (מוצ"ש)
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error calculating zmanim:", error);
        res.status(500).json({ message: "שגיאה בחישוב זמני השבת" });
    }
};