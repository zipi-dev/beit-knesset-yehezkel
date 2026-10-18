/**
 * מחלצת את כתובת התמונה הממוצעת (Thumbnail) מסרטון יוטיוב (תומך בלינקים רגילים, קצרים ו-Shorts)
 * @param {string} url - כתובת ה-URL של סרטון היוטיוב
 * @returns {string|null} - מחזיר את כתובת התמונה או null אם הקישור לא תקין
 */
const getYouTubeThumbnail = (url) => {
    if (!url || typeof url !== 'string' || url.length > 500) return null;
    
    // חיפוש ה-ID של הסרטון באמצעות Regex
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([\w-]{11})/);
    
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

/**
 * יוצרת כרטיס אירוע ויזואלי (DOM Element) בהתאם לסכימה של המשתמש
 * @param {Object} event - אובייקט האירוע שמגיע מהשרת
 * @returns {HTMLElement} - כרטיס האירוע המוכן להוספה לדף
 */
export const createEventCard = (event) => {
    // 1. יצירת אלמנט ה-article הראשי של הכרטיס
    const card = document.createElement('article');
    card.classList.add('event-card');

    // 2. טיפול במדיה: אם קיים mediaUrl (קישור ליוטיוב), ניצור תמונה עטופה בקישור
    if (event.mediaUrl) {
        const thumbnailUrl = getYouTubeThumbnail(event.mediaUrl);
        
        
        if (thumbnailUrl) {
            // יצירת תגית <a> 
            const link = document.createElement('a');
            link.href = event.mediaUrl;
            // הסרנו את link.target = '_blank' ואת link.rel כדי שייפתח באותו חלון
            link.classList.add('event-image-link');

            // יצירת תגית <img> לתצוגת התמונה הממוצעת של סרטון היוטיוב
            const image = document.createElement('img');
            image.src = thumbnailUrl;
            image.alt = event.name;
            image.classList.add('event-image');

            // הוספת התמונה לתוך הקישור, ואת הקישור לתוך הקארד
            link.appendChild(image);
            card.appendChild(link);
        }
    }

    // 3. יצירת קונטיינר פנימי לפרטי הטקסט של האירוע
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('event-info');

    // שם האירוע (name לפי הסכימה)
    const title = document.createElement('h3');
    title.textContent = event.name;
    title.classList.add('event-title');
    contentDiv.appendChild(title);

    // תאריך האירוע (eventDate לפי הסכימה) - המרה לתאריך קריא בעברית
    if (event.eventDate) {
        const dateElement = document.createElement('p');
        dateElement.classList.add('event-date');
        const formattedDate = new Date(event.eventDate).toLocaleDateString('he-IL');
        dateElement.textContent = `תאריך: ${formattedDate}`;
        contentDiv.appendChild(dateElement);
    }

    // תיאור האירוע (description.text לפי מבנה הסכימה שלך)
    if (event.description && event.description.text) {
        const descElement = document.createElement('p');
        descElement.textContent = event.description.text;
        descElement.classList.add('event-desc');
        contentDiv.appendChild(descElement);
    }

    // צלם האירוע (photographer לפי הסכימה) - שדה אופציונלי
    if (event.photographer) {
        const photoElement = document.createElement('p');
        photoElement.textContent = `צילום: ${event.photographer}`;
        photoElement.classList.add('event-photographer');
        contentDiv.appendChild(photoElement);
    }

    // צירוף אזור הטקסט לכרטיס הראשי
    card.appendChild(contentDiv);

    return card; // מחזיר את האלמנט המוגמר
};