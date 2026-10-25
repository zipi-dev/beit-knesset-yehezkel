export const createRabbiCard = (rabbi) => {
    const rabbiItem = document.createElement('div');
    rabbiItem.classList.add('rabbi-item');

    // Rabbi image element
    const img = document.createElement('img');
    img.src = rabbi.imageUrl || '../assest/images/defaultRabbiPicture.png'; 
    img.alt = rabbi.name || 'הרב';
    img.classList.add('rabbi-avatar');

    // Rabbi name element
    const nameSpan = document.createElement('span');
    nameSpan.textContent = rabbi.name;
    nameSpan.classList.add('rabbi-name');

    //Appending elements
    rabbiItem.appendChild(img);
    rabbiItem.appendChild(nameSpan);

    return rabbiItem;
};