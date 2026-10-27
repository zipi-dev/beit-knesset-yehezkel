import createHeader from './header.js';
import createFooter from './footer.js';
import { getOpinions, addOpinion } from '../services/opinionService.js';
import { createOpinionCard } from './opinion.js';


async function initOpinionPage() {
    createHeader();
    setupFormListener();
    await loadOpinions();
    createFooter();
}

//  הפעלה אוטומטית ברגע שהדף נטען
document.addEventListener('DOMContentLoaded', () => {
    initOpinionPage();
});

//  פונקציה להבאת חוות הדעת מהשרת והצגתן
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

//  פונקציית רינדור הרשימה (משתמשת ב-replaceChildren וב-createElement בלבד)
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
    const form = document.getElementById('opinion-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // מונע ריענון אוטומטי של הדף


        const submitBtn = form.querySelector('button[type="submit"]');
        const opinionData = {
            userName: document.getElementById('userName').value.trim(),
            comment: document.getElementById('comment').value.trim()
        };
 
        submitBtn.disabled = true;
        try {
            await addOpinion(opinionData);
            alert('חוות הדעת נשלחה בהצלחה!');
            form.reset();
            await loadOpinions(); // רענון הרשימה כדי לראות את החדשה
        } catch (error) {
            console.error('שגיאה בשליחת חוות הדעת:', error);
            // אם השרת החזיר הודעה (למשל ולידציה) מציגים אותה
            alert(error.message || 'אירעה שגיאה בשליחת חוות הדעת, אנא נסו שוב.');
        } finally {
            submitBtn.disabled = false;
        }
    });
}