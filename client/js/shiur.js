//func that returns the youtube thumbnail from the url
const getYouTubeThumbnail = (url) => {
    if (!url || typeof url !== 'string' || url.length > 500) return null;
//search for the video id in the url using regex    
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([\w-]{11})/);
    
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};