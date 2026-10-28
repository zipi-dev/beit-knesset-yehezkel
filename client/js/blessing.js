/**
 * יוצרת כרטיס HTML עבור ברכה
 * @param {Object} blessing - נתוני הברכה מהמסד
 * @returns {HTMLElement}
 */
export const createBlessingCard = (blessing) => {
    const card = document.createElement('article');
    card.classList.add('blessing-card');

    // שם מבקש הברכה
    const nameTitle = document.createElement('h3');
    nameTitle.classList.add('blessing-title');
    nameTitle.textContent = blessing.name;
    card.appendChild(nameTitle);

    // שם האם
    const motherP = document.createElement('p');
    motherP.classList.add('blessing-mother');
    motherP.textContent = `בן/בת ${blessing.motherName}`;
    card.appendChild(motherP);

    // סוג הברכה (תגית)
    const typeSpan = document.createElement('span');
    typeSpan.classList.add('blessing-type-badge');
    typeSpan.textContent = blessing.blessingType;
    card.appendChild(typeSpan);

    // תאריך הוספה
    if (blessing.createdAt) {
        const dateP = document.createElement('p');
        dateP.classList.add('blessing-date');
        const formattedDate = new Date(blessing.createdAt).toLocaleDateString('he-IL');
        dateP.textContent = formattedDate;
        card.appendChild(dateP);
    }

    return card;
};