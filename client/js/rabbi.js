import { DEFAULT_RABBI_IMAGE } from '../config.js';

export const createRabbiCard = (rabbi, { onEdit, onDelete } = {}) => {
    const rabbiItem = document.createElement('div');
    rabbiItem.classList.add('rabbi-item');

    const img = document.createElement('img');
    img.src = rabbi.imageUrl || DEFAULT_RABBI_IMAGE;
    img.alt = rabbi.name || 'הרב';
    img.classList.add('rabbi-avatar');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = rabbi.name;
    nameSpan.classList.add('rabbi-name');

    rabbiItem.append(img, nameSpan);

    // A button inside the card. stopPropagation - so the click will not also filter the shiurim
    const addButton = (text, handler) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = text;
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            handler(rabbi);
        });
        rabbiItem.appendChild(btn);
    };

    if (onEdit) addButton('עריכת פרטים', onEdit);
    if (onDelete) addButton('מחיקת מנהל', onDelete);

    return rabbiItem;
};