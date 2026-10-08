/**
 * Extracts a YouTube thumbnail URL (supports standard, short, and Shorts links with basic security validation).
 * 
 * @param {string} url - The YouTube video URL string.
 * @returns {string|null} The thumbnail image URL, or null if invalid.
 */
const getYouTubeThumbnail = (url) => {
    if (!url || typeof url !== 'string' || url.length > 500) return null;
//search for the video id in the url using regex    
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([\w-]{11})/);
    
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

/**
 * Creates a shiur card element based on the provided shiur data.
 * @param {Object} shiur - The shiur data object (including media URL and rabbi details)
 * @returns {HTMLElement} - The ready-to-use shiur card element
 */
const createShiurCard = (shiur) => {

    const card = document.createElement('article');
    card.classList.add('shiur-card');

    let imageUrl = '';
    
    //use the YouTube thumbnail if the mediaUrl is a valid YouTube link 
    if (shiur.mediaUrl) {
        const videoId = extractYouTubeId(shiur.mediaUrl);
        if (videoId) {
            imageUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
    }
    
    // if not a YouTube link, use the rabbi's image or a default image
    if (!imageUrl) {
        imageUrl = shiur.rabbiImage || shiur.rabbi?.imageUrl || 'default-rabbi-image-example.jpg';
    }

    if (shiur.mediaUrl) {
        const link = document.createElement('a');
        link.href = shiur.mediaUrl;
        link.target = '_blank'; // פתיחה בלשונית חדשה
        link.rel = 'noopener noreferrer';
        link.classList.add('shiur-image-link');

        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = shiur.titleHebrew;
        image.classList.add('shiur-image');
        
        link.appendChild(image);
        card.appendChild(link);
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('shiur-info');

    const title = document.createElement('h3');
    title.textContent = shiur.titleHebrew;
    title.classList.add('shiur-title');

    contentDiv.appendChild(title);
    card.appendChild(contentDiv);

    return card;
};
