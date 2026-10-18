/**
 * יוצרת אלמנט HTML המציג לוח זמני תפילות ואת רשימת התפילות שבו עבור הלקוח
 * @param {Object} schedule - אובייקט הלוח מהשרת
 * @returns {HTMLElement}
 */
export const createScheduleCard = (schedule) => {
    const card = document.createElement('article');
    card.classList.add('schedule-card');

    // כותרת הלוח (למשל: "ימי חול חורף")
    const titleElem = document.createElement('h3');
    titleElem.textContent = schedule.title;
    titleElem.classList.add('schedule-title');
    card.appendChild(titleElem);

    // תאריך אופציונלי אם קיים
    if (schedule.date) {
        const dateElem = document.createElement('p');
        dateElem.classList.add('schedule-date');
        dateElem.textContent = `תאריך: ${new Date(schedule.date).toLocaleDateString('he-IL')}`;
        card.appendChild(dateElem);
    }

    // אזור רשימת התפילות (Prayers List)
    const prayersSection = document.createElement('div');
    prayersSection.classList.add('prayers-container');

    const prayersTitle = document.createElement('h4');
    prayersTitle.textContent = 'זמני תפילות:';
    prayersSection.appendChild(prayersTitle);

    if (!schedule.prayers || schedule.prayers.length === 0) {
        const noPrayersElem = document.createElement('p');
        noPrayersElem.textContent = 'טרם הוגדרו תפילות ללוח זה.';
        noPrayersElem.classList.add('no-prayers');
        prayersSection.appendChild(noPrayersElem);
    } else {
        const ul = document.createElement('ul');
        ul.classList.add('prayers-list');

        // מעבר על כל תפילה והצגת השם, השעה וההערות (למתפללים בלבד)
        schedule.prayers.forEach(prayer => {
            const li = document.createElement('li');
            li.classList.add('prayer-item');

            const infoSpan = document.createElement('span');
            infoSpan.textContent = `${prayer.name} - ${prayer.time}`;
            infoSpan.classList.add('prayer-text');
            li.appendChild(infoSpan);

            // הערות נוספות אם קיימות (למשל: "בבית המדרש למטה")
            if (prayer.notes) {
                const notesSpan = document.createElement('span');
                notesSpan.textContent = ` (${prayer.notes})`;
                notesSpan.classList.add('prayer-notes');
                li.appendChild(notesSpan);
            }

            ul.appendChild(li);
        });

        prayersSection.appendChild(ul);
    }

    card.appendChild(prayersSection);
    return card;
};