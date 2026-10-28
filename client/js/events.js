/**
 * מחלצת את תמונת הממוזערת מסרטון יוטיוב (רגיל, קצר, Shorts או embed)
 * @param {string} url
 * @returns {string|null}
 */
const getYouTubeThumbnail = (url) => {
    if (!url || typeof url !== 'string' || url.length > 500) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

// מאפשר רק קישורי http/https (הגנה מפני javascript:)
const isSafeHttpUrl = (url) => {
    try {
        const { protocol } = new URL(url);
        return protocol === 'http:' || protocol === 'https:';
    } catch {
        return false;
    }
};


// Cloudinary יודע להקטין תמונה "תוך כדי תנועה": מוסיפים הוראות לכתובת (רוחב מקסימלי + דחיסה אוטומטית)
const optimizeCloudinaryUrl = (url, width = 800) =>
    url.includes('/upload/') ? url.replace('/upload/', `/upload/w_${width},c_limit,q_auto,f_auto/`) : url;

/**
 * יוצרת כרטיס אירוע (DOM Element)
 * @param {Object} event - אובייקט האירוע מהשרת
 * @returns {HTMLElement}
 */
export const createEventCard = (event) => {
    const card = document.createElement('article');
    card.classList.add('event-card');

    // תמונה שהועלתה (Cloudinary): לחיצה פותחת את התמונה בגודל מלא בלשונית חדשה
    const hasUploadedImage = Boolean(event.imageUrl && isSafeHttpUrl(event.imageUrl));
    if (hasUploadedImage) {
        const link = document.createElement('a');
        link.href = event.imageUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.classList.add('event-image-link', 'event-image-link--photo');

        const image = document.createElement('img');
        image.src = optimizeCloudinaryUrl(event.imageUrl);
        image.alt = event.name;
        image.loading = 'lazy';
        image.classList.add('event-image');

        link.appendChild(image);
        card.appendChild(link);
    }

    // מדיה: יוטיוב -> תמונה לחיצה (רק אם אין תמונה שהועלתה). קישור אחר -> קישור טקסט רגיל.
    if (!hasUploadedImage && event.mediaUrl && isSafeHttpUrl(event.mediaUrl)) {
        const thumbnailUrl = getYouTubeThumbnail(event.mediaUrl);

        if (thumbnailUrl) {
            const link = document.createElement('a');
            link.href = event.mediaUrl;
            link.classList.add('event-image-link');

            const image = document.createElement('img');
            image.src = thumbnailUrl;
            image.alt = event.name;
            image.classList.add('event-image');

            link.appendChild(image);
            card.appendChild(link);
        }
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('event-info');

    const title = document.createElement('h3');
    title.textContent = event.name;
    title.classList.add('event-title');
    contentDiv.appendChild(title);

    if (event.eventDate) {
        const dateElement = document.createElement('p');
        dateElement.classList.add('event-date');
        dateElement.textContent = `תאריך: ${new Date(event.eventDate).toLocaleDateString('he-IL')}`;
        contentDiv.appendChild(dateElement);
    }

    if (event.description && event.description.text) {
        const descElement = document.createElement('p');
        descElement.textContent = event.description.text;
        descElement.classList.add('event-desc');
        contentDiv.appendChild(descElement);
    }

    if (event.photographer) {
        const photoElement = document.createElement('p');
        photoElement.textContent = `צילום: ${event.photographer}`;
        photoElement.classList.add('event-photographer');
        contentDiv.appendChild(photoElement);
    }

    // קישור מדיה שלא מוצג כתמונה (לא יוטיוב, או שיש תמונה שהועלתה): מציגים קישור טקסט כדי שלא ייעלם
    if (event.mediaUrl && isSafeHttpUrl(event.mediaUrl) && (hasUploadedImage || !getYouTubeThumbnail(event.mediaUrl))) {
        const mediaLink = document.createElement('a');
        mediaLink.href = event.mediaUrl;
        mediaLink.target = '_blank';
        mediaLink.rel = 'noopener noreferrer';
        mediaLink.textContent = getYouTubeThumbnail(event.mediaUrl) ? 'לצפייה בסרטון' : 'לצפייה במדיה';
        mediaLink.classList.add('event-media-link');
        contentDiv.appendChild(mediaLink);
    }

    card.appendChild(contentDiv);
    return card;
};