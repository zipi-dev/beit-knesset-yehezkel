import { addLikeToOpinion } from '../services/opinionService.js';

/**
 * יוצרת כרטיס חוות דעת בודד (DOM Element) בהתאם לסכימה של המונגו
 * @param {Object} opinion - אובייקט חוות הדעת שמגיע מהשרת כולל{likedByMy}
 * @returns {HTMLElement} - כרטיס חוות הדעת המוכן להוספה לדף
 */



export const createOpinionCard = (opinion) => {
    const card = document.createElement('article');
    card.classList.add('opinion-card');

    // שם המשתמש (userName)
    const nameElem = document.createElement('h4');
    nameElem.textContent = opinion.userName;
    nameElem.classList.add('opinion-author');

   
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
//  כפתור לייק
    const likeBtn = document.createElement('button');
    likeBtn.classList.add('like-btn');
    likeBtn.textContent = `👍 ${opinion.likes || 0}`;

     const markAsLiked = () => {
        likeBtn.disabled = true;
        likeBtn.classList.add('liked');
        likeBtn.title = 'כבר סימנת לייק';
    };
 
    // אם המבקר כבר נתן לייק (נקבע בשרת) - הכפתור נעול מההתחלה
    if (opinion.likedByMe) markAsLiked();
 
    likeBtn.addEventListener('click', async () => {
        likeBtn.disabled = true; // מונע לחיצה כפולה בזמן שהבקשה בדרך
        try {
            const result = await addLikeToOpinion(opinion._id);
            likeBtn.textContent = `👍 ${result.likes}`;
            markAsLiked();
        } catch (error) {
            if (error.status === 409) {
                markAsLiked(); // כבר נתן לייק - נשאר נעול
            } else {
                likeBtn.disabled = false;
                alert('לא ניתן היה לעדכן את הלייק.');
            }
        }
    });
 
    card.append(nameElem, commentElem, dateElem, likeBtn);
    return card;
};