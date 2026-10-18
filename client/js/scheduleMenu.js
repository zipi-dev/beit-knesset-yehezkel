import { getActiveSchedule } from '../services/scheduleService.js';
import { createScheduleCard } from './scheduleCard.js';

// הפעלה אוטומטית ברגע שהדף נטען
document.addEventListener('DOMContentLoaded', () => {
    loadClientSchedule();
});

/**
 * טעינת לוח הזמנים הפעיל והצגתו للمתפלל
 */
async function loadClientSchedule() {
    const container = document.getElementById('schedule-container');
    if (!container) return;

    try {
        // מביאים את הלוח הפעיל שהוגדר בשרת
        const activeSchedule = await getActiveSchedule();

        if (!activeSchedule) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'אין כרגע לוח זמנים פעיל להצגה.';
            container.replaceChildren(emptyMsg);
            return;
        }

        // יוצרים את הכרטיס ומציגים במסך
        const cardElement = createScheduleCard(activeSchedule);
        container.replaceChildren(cardElement);

    } catch (error) {
        console.error('שגיאה בטעינת לוח הזמנים:', error);
        const errorElem = document.createElement('p');
        errorElem.textContent = 'אירעה שגיאה בטעינת לוח הזמנים.';
        errorElem.classList.add('error-message');
        container.replaceChildren(errorElem);
    }
}