/**
 * יוצרת כרטיס חוות דעת בודד (DOM Element) בהתאם לסכימה של המונגו
 * @param {Object} opinion - אובייקט חוות הדעת שמגיע מהשרת
 * @returns {HTMLElement} - כרטיס חוות הדעת המוכן להוספה לדף
 */
export const createOpinionCard = (opinion) => {
    const card = document.createElement('article');
    card.classList.add('opinion-card');

    // שם המשתמש (userName)
    const nameElem = document.createElement('h4');
    nameElem.textContent = opinion.userName;
    nameElem.classList.add('opinion-author');

    // דירוג כוכבים (rating 1-5) בהמרת מספר לכוכבים ויזואליים
    const ratingElem = document.createElement('div');
    ratingElem.classList.add('opinion-rating');
    ratingElem.textContent = '★'.repeat(opinion.rating) + '☆'.repeat(5 - opinion.rating);

    // תוכן התגובה (comment)
    const commentElem = document.createElement('p');
    commentElem.textContent = opinion.comment;
    commentElem.classList.add('opinion-comment');

    // תאריך כתיבת חוות הדעת (מתוך timestamps של מונגו)
    const dateElem = document.createElement('span');
    dateElem.classList.add('opinion-date');
    if (opinion.createdAt) {
        dateElem.textContent = new Date(opinion.createdAt).toLocaleDateString('he-IL');
    }

    // צירוף כל החלקים לכרטיס הראשי
    card.append(nameElem, ratingElem, commentElem, dateElem);
    
    return card;
};