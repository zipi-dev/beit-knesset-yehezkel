import createHeader from './header.js';
import createFooter from './footer.js';
import { getEvents } from '../services/eventService.js';
import { createEventCard } from './events.js';


/**
 * פונקציה ראשית האחראית על טעינת האירועים מהשרת והצגתם בעמוד
 */
const loadEventsPage = async () => {
    // איתור קונטיינר האירועים בתוך ה-HTML
    const container = document.getElementById('events-container');
    if (!container) return; // הגנה: אם האלמנט לא קיים בדף הנוכחי, נעצור

    try {
        // קריאה לשרת דרך ה-Service לקבלת כל האירועים במסד הנתונים
        const events = await getEvents();
        
        // שליחת רשימת האירועים והקונטיינר לפונקציית הרינדור
        renderEventsList(events, container);
    } catch (err) {
        console.error('שגיאה בטעינת האירועים:', err);
        
        // יצירת הודעת שגיאה ויזואלית בטוחה במקרה שהשרת לא זמין
        const errorElement = document.createElement('p');
        errorElement.textContent = 'אירעה שגיאה בטעינת האירועים, אנא נסו שוב מאוחר יותר.';
        errorElement.classList.add('error-message');
        container.replaceChildren(errorElement);
    }
};

/**
 * פונקציה שמקבלת את מערך האירועים ובונה את התצוגה שלהם בעמוד
 */
const renderEventsList = (events, container) => {
    // בדיקה האם רשימת האירועים ריקה או לא קיימת
    if (!events || events.length === 0) {
        const emptyElement = document.createElement('p');
        emptyElement.textContent = 'אין אירועים קרובים כרגע.';
        emptyElement.classList.add('no-events-message');
        container.replaceChildren(emptyElement);
        return;
    }

    // שימוש ב-map כדי להפוך כל אובייקט אירוע לכרטיס HTML באמצעות createEventCard
    const cardElements = events.map(event => createEventCard(event));
    
    // הזרקת כל הכרטיסים המובילים לקונטיינר בבת אחת בצורה נקייה ובטוחה (ללא innerHTML)
    container.replaceChildren(...cardElements);
};
async function initEventsPage() {
    createHeader();
    await loadEventsPage();
    createFooter();
}
// האזנה לאירוע טעינת מסמך ה-HTML (DOMContentLoaded) והפעלת תהליך הטעינה
document.addEventListener('DOMContentLoaded', () => 
   {
   initEventsPage(); 
   });

