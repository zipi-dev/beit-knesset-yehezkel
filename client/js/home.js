import createHeader from './header.js';
import createFooter from './footer.js';
import { getZmanim } from '../services/zmanimService.js';

/**
 * פס זמני שבת בדף הבית. אם השרת לא זמין - הפס פשוט נשאר מוסתר (הדף ממשיך לעבוד).
 */
const loadShabbatStrip = async () => {
    const strip = document.getElementById('shabbat-strip');
    if (!strip) return;

    try {
        const zmanim = await getZmanim();
        const city = zmanim.find(z => z.cityName === 'Tel Aviv') || zmanim[0];
        if (!city || !city.candleLighting) return;

        const parts = [
            ['הדלקת נרות', city.candleLighting],
            ['צאת השבת', city.tzeisShabbat]
        ].filter(([, time]) => time);

        strip.replaceChildren(...parts.map(([label, time]) => {
            const item = document.createElement('span');
            item.classList.add('shabbat-item');
            item.textContent = `${label}: ${time}`;
            return item;
        }));
        strip.classList.remove('hidden');
    } catch (error) {
        console.error('שגיאה בטעינת זמני השבת לדף הבית:', error);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    createHeader();          // prepend - נכנס לראש ה-body
    createFooter();          // append  - נכנס לסוף ה-body
    await loadShabbatStrip();
});
