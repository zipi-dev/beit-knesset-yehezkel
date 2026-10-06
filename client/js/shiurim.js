import { API_URL } from './config.js';

//get shiurim from server
async function loadShiurim() {
    try {
        const response = await fetch(`${API_URL}/shiurim`);

        if (!response.ok) {
            throw new Error('שגיאה בשליפת השיעורים מהשרת');
        }

        const shiurimList = await response.json();
        
        // מעבירים את הנתונים לפונקציית התצוגה
        renderShiurim(shiurimList);

    } catch (error) {
        console.error('שגיאה:', error);
    }
}

//show shiurim in the page
function renderShiurim(shiurim) {
    const container = document.getElementById('shiurim-container');
    
    if (!container) return;

    container.textContent = ''; // איפוס הקונטיינר

    shiurim.forEach(shiur => {
        const card = document.createElement('div');
        card.className = 'shiur-card';

        // כותרת השיעור בעברית (על פי הסכמה: titleHebrew)
        const titleElement = document.createElement('h3');
        titleElement.textContent = shiur.titleHebrew;

        // תיאור השיעור
        const descElement = document.createElement('p');
        descElement.textContent = shiur.description || '';

        // תאריך השיעור
        const dateElement = document.createElement('span');
        dateElement.className = 'shiur-date';
        if (shiur.date) {
            dateElement.textContent = new Date(shiur.date).toLocaleDateString('he-IL');
        }

        // אם יש קישור למדיה (mediaUrl), נוסיף כפתור או נגן צפייה
        if (shiur.mediaUrl) {
            const mediaLink = document.createElement('a');
            mediaLink.href = shiur.mediaUrl;
            mediaLink.target = '_blank'; // פתיחה בלשונית חדשה
            mediaLink.textContent = 'צפה בשיעור';
            mediaLink.className = 'shiur-media-link';
            card.appendChild(mediaLink);
        }

        // חיבור כל הרכיבים לכרטיסייה
        card.appendChild(titleElement);
        card.appendChild(descElement);
        card.appendChild(dateElement);
        
        // הוספת הכרטיסייה לקונטיינר הראשי בעמוד
        container.appendChild(card);
    });
}

loadShiurim();