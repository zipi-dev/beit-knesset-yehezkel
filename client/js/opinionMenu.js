import { getOpinions, addOpinion } from '../services/opinionService.js';
import { createOpinionCard } from './opinion.js';

// 1. הפעלה אוטומטית ברגע שהדף נטען
document.addEventListener('DOMContentLoaded', () => {
    loadOpinions();
    setupFormListener();
});

// 2. פונקציה להבאת חוות הדעת מהשרת והצגתן
async function loadOpinions() {
    const container = document.getElementById('opinions-container');
    if (!container) return;

    try {
        const opinions = await getOpinions();
        renderOpinionsList(opinions, container);
    } catch (error) {
        console.error('שגיאה בטעינת חוות הדעת:', error);
        const errorElement = document.createElement('p');
        errorElement.textContent = 'אירעה שגיאה בטעינת חוות הדעת.';
        errorElement.classList.add('error-message');
        container.replaceChildren(errorElement);
    }
}

// 3. פונקציית רינדור הרשימה (משתמשת ב-replaceChildren וב-createElement בלבד)
function renderOpinionsList(opinions, container) {
    if (!opinions || opinions.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'אין עדיין חוות דעת. היו הראשונים לכתוב!';
        emptyMsg.classList.add('no-opinions-message');
        container.replaceChildren(emptyMsg);
        return;
    }

    // מעבר על כל חוות דעת והמרתה לכרטיס HTML בעזרת createOpinionCard
    const cards = opinions.map(opinion => createOpinionCard(opinion));
    container.replaceChildren(...cards);
}

// 4. פונקציה המטפלת בשליחת טופס הוספת חוות דעת חדשה
function setupFormListener() {
    const form = document.getElementById('add-opinion-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // מונע ריענון אוטומטי של הדף

        // איסוף הנתונים מהשדות בטופס ה-HTML
        const opinionData = {
            userName: document.getElementById('userName').value.trim(),
            rating: Number(document.getElementById('rating').value),
            comment: document.getElementById('comment').value.trim()
        };

        try {
            await addOpinion(opinionData); // שליחה לשרת דרך ה-Service
            alert('חוות הדעת נשלחה בהצלחה!');
            form.reset();     // איפוס שדות הטופס
            loadOpinions();   // רענון רשימת חוות הדעת במסך כדי לראות את החדשה
        } catch (error) {
            console.error('שגיאה בשליחת חוות הדעת:', error);
            alert('אירעה שגיאה בשליחת חוות הדעת, אנא נסו שוב.');
        }
    });
}