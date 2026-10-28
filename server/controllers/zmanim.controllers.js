import { GeoLocation, ComplexZmanimCalendar } from "kosher-zmanim";
import { DateTime } from "luxon";

const TZ = "Asia/Jerusalem";

// minutes = כמה דקות לפני השקיעה מדליקים נרות (מנהג המקום)
const cities = [
    { name: "Jerusalem", lat: 31.7683, lng: 35.2137, elevation: 800, candleMinutes: 40 },
    { name: "Tel Aviv",  lat: 32.0853, lng: 34.7818, elevation: 5,   candleMinutes: 20 },
    { name: "Haifa",     lat: 32.7940, lng: 34.9896, elevation: 50,  candleMinutes: 30 }
];

// הספרייה מחזירה DateTime של luxon (בגרסה 0.9) - ממירים ל-HH:mm לפי שעון ישראל
const formatTime = (value) => {
    if (!value) return null;
    const dt = DateTime.isDateTime(value) ? value : DateTime.fromJSDate(new Date(value));
    return dt.setZone(TZ).toFormat("HH:mm");
};

/**
 * התאריכים של שישי ושבת הקרובים - לפי שעון ישראל (ולא לפי שעון השרת)
 */
const getUpcomingShabbatDates = () => {
    const now = DateTime.now().setZone(TZ);
    const dayOfWeek = now.weekday % 7; // luxon: שני=1 ... ראשון=7 -> כאן ראשון=0 ... שבת=6

    let daysToFri = (5 - dayOfWeek + 7) % 7;
    if (dayOfWeek === 6) daysToFri = 6;                          // היום שבת: מציגים את השבת הבאה
    else if (dayOfWeek === 5 && now.hour >= 20) daysToFri = 7;   // שישי בערב אחרי כניסת השבת: השבת הבאה

    const friday = now.startOf("day").plus({ days: daysToFri });
    return { friday, saturday: friday.plus({ days: 1 }) };
};

export const getAllCitiesZmanim = (req, res) => {
    try {
        const { friday, saturday } = getUpcomingShabbatDates();

        const result = cities.map(city => {
            const geoLocation = new GeoLocation(city.name, city.lat, city.lng, city.elevation, TZ);

            const fridayCalendar = new ComplexZmanimCalendar(geoLocation);
            fridayCalendar.setDate(friday);
            fridayCalendar.setCandleLightingOffset(city.candleMinutes);

            const saturdayCalendar = new ComplexZmanimCalendar(geoLocation);
            saturdayCalendar.setDate(saturday);

            return {
                cityName: city.name,
                candleLighting: formatTime(fridayCalendar.getCandleLighting()),
                sunsetFriday: formatTime(fridayCalendar.getSunset()),
                tzeisShabbat: formatTime(saturdayCalendar.getTzais()) // TODO: לבדוק עם הרב איזו שיטה לצאת השבת
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error calculating zmanim:", error);
        res.status(500).json({ message: "שגיאה בחישוב זמני השבת" });
    }
};
