import createHeader from './header.js';
import createFooter from './footer.js';
import { getActiveSchedule } from '../services/scheduleService.js';
import { getZmanim } from '../services/zmanimService.js';
import { createScheduleCard } from './schedule.js';
import { createZmanimCard } from './zmanim.js';

document.addEventListener('DOMContentLoaded', () => {
    initSchedulePage();
});



/**
 * פונקציה ראשית המאחדת את טעינת לוח התפילות וזמני השבת בטעינה אחת
 */
async function initSchedulePage() {
    createHeader();
    await Promise.all([
        loadClientSchedule(),
        loadZmanim()
    ]);
    createFooter();
}

/**
 * טעינת לוח זמני התפילות
 */
async function loadClientSchedule() {
    const container = document.getElementById('schedule-container');
    if (!container) return;

    try {
        const activeSchedule = await getActiveSchedule();

        if (!activeSchedule) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'אין כרגע לוח זמנים פעיל להצגה.';
            container.replaceChildren(emptyMsg);
            return;
        }

        const cardElement = createScheduleCard(activeSchedule);
        container.replaceChildren(cardElement);

    } catch (error) {
        console.error('שגיאה בטעינת לוח התפילות:', error);
        const errorElem = document.createElement('p');
        errorElem.textContent = 'אירעה שגיאה בטעינת לוח התפילות.';
        errorElem.classList.add('error-message');
        container.replaceChildren(errorElem);
    }
}

/**
 * טעינת זמני השבת ההלכתיים עבור הערים
 */
async function loadZmanim() {
    const container = document.getElementById('zmanim-container');
    if (!container) return;

    try {
        const zmanimArray = await getZmanim();

        if (!zmanimArray || zmanimArray.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'לא נתקבלו זמני שבת.';
            container.replaceChildren(emptyMsg);
            return;
        }

        const zmanimGrid = document.createElement('div');
        zmanimGrid.classList.add('zmanim-grid');

        zmanimArray.forEach(cityZmanim => {
            const card = createZmanimCard(cityZmanim);
            zmanimGrid.appendChild(card);
        });

        container.replaceChildren(zmanimGrid);

    } catch (error) {
        console.error('שגיאה בטעינת זמני השבת:', error);
        const errorElem = document.createElement('p');
        errorElem.textContent = 'אירעה שגיאה בטעינת זמני השבת.';
        errorElem.classList.add('error-message');
        container.replaceChildren(errorElem);
    }
}