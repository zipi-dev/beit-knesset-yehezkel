/**
 * יוצרת אלמנט HTML המציג את זמני השבת לעיר מסוימת
 * @param {Object} zmanimData - אובייקט זמנים עבור עיר ספציפית
 * @returns {HTMLElement}
 */
export const createZmanimCard = (zmanimData) => {
    const card = document.createElement('article');
    card.classList.add('zmanim-card');

    // כותרת העיר (תרגום שמות הערים לעברית)
    const cityTitle = document.createElement('h3');
    const cityNamesHebrew = {
        'Jerusalem': 'ירושלים',
        'Tel Aviv': 'תל אביב',
        'Haifa': 'חיפה'
    };
    cityTitle.textContent = cityNamesHebrew[zmanimData.cityName] || zmanimData.cityName;
    cityTitle.classList.add('zmanim-city-title');
    card.appendChild(cityTitle);

    // רשימת הזמנים
    const ul = document.createElement('ul');
    ul.classList.add('zmanim-list');

    const items = [
        { label: 'הדלקת נרות (שישי)', time: zmanimData.candleLighting },
        { label: 'שקיעת החמה (שישי)', time: zmanimData.sunsetFriday },
        { label: 'צאת השבת (מוצ"ש)', time: zmanimData.tzeisShabbat }
    ];

    items.forEach(item => {
        if (item.time) {
            const li = document.createElement('li');
            li.classList.add('zmanim-item');

            const labelSpan = document.createElement('span');
            labelSpan.textContent = `${item.label}: `;
            labelSpan.classList.add('zmanim-label');

            const timeSpan = document.createElement('span');
            timeSpan.textContent = item.time;
            timeSpan.classList.add('zmanim-time');

            li.appendChild(labelSpan);
            li.appendChild(timeSpan);
            ul.appendChild(li);
        }
    });

    card.appendChild(ul);
    return card;
};