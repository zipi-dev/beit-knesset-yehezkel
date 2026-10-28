import createHeader from './header.js';
import createFooter from './footer.js';
import { getBlessings, createBlessing } from '../services/blessingService.js';
import { createBlessingCard } from './blessing.js';

document.addEventListener('DOMContentLoaded', () => {
    initBlessingPage();
});

async function initBlessingPage() {
    createHeader();
    await loadBlessings();
    setupBlessingForm();
    createFooter();
}

/**
 * טעינת הברכות והצגתן בעמוד
 */
async function loadBlessings() {
    const container = document.getElementById('blessings-container');
    if (!container) return;

    try {
        const blessings = await getBlessings();

        if (!blessings || blessings.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'אין ברכות להצגה כרגע. תהיו הראשונים לברך!';
            emptyMsg.style.textAlign = 'center';
            container.replaceChildren(emptyMsg);
            return;
        }

        container.replaceChildren();
        blessings.forEach(blessingData => {
            const card = createBlessingCard(blessingData);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('שגיאה בטעינת הברכות:', error);
        const errorElem = document.createElement('p');
        errorElem.textContent = 'אירעה שגיאה בטעינת הברכות.';
        errorElem.classList.add('error-message');
        container.replaceChildren(errorElem);
    }
}

/**
 * טיפול בשליחת טופס הוספת ברכה חדשה
 */
function setupBlessingForm() {
    const form = document.getElementById('blessing-form');
    if (!form) return;
    const status = document.getElementById('blessing-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    const showStatus = (text, isError) => {
        status.textContent = text;
        status.classList.toggle('error-message', isError);
        status.classList.toggle('success-message', !isError);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newBlessing = {
            name: document.getElementById('blessing-name').value.trim(),
            motherName: document.getElementById('blessing-mother').value.trim(),
            blessingType: document.getElementById('blessing-type').value
        };

        submitBtn.disabled = true;
        try {
            await createBlessing(newBlessing);
            form.reset();
            await loadBlessings();
            showStatus('הבקשה נוספה בהצלחה, ותועבר לרב.', false);
        } catch (error) {
            console.error('שגיאה בשמירת הברכה:', error);
            showStatus('שגיאה בשמירת הברכה. בדקו שהשמות מכילים אותיות בלבד ונסו שוב.', true);
        } finally {
            submitBtn.disabled = false;
        }
    });
}