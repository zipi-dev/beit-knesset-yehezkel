import {getAllShiurim, getShiurById,getTitlesSuggestions} from './services/shiurimService.js';
import {createShiurCard} from 'shiur.js';
import {getAllRabbis} from './services/rabbiService.js';
import {createRabbiCard} from 'rabbi.js';

const loadRabbisSection = async () => {
    const rabbis = await getAllRabbis();
    const rabbisContainer = document.getElementById('rabbis-container');
    
    if (!rabbisContainer) return;

    rabbisContainer.replaceChildren(); // clear existing content
    const fragment = document.createDocumentFragment(); 

    rabbis.forEach(rabbi => {
        const rabbiCard = createRabbiCard(rabbi);
        
        rabbiCard.addEventListener('click', () => {
            console.log('התבצעה לחיצה על הרב, ID:', rabbi._id);
            // I have to implement the filtering of shiurim based on the clicked rabbi's ID.
        });

        fragment.appendChild(rabbiCard);
    });

    rabbisContainer.appendChild(fragment); // into the DOM
};

const loadShiurim = async (filters = {}) => {
    const shiurim = await getAllShiurim(filters);
    const shiurimContainer = document.getElementById('shiurim-container'); 
    
    if (!shiurimContainer) return;

    shiurimContainer.replaceChildren(); // clear existing content
    const fragment = document.createDocumentFragment();

    shiurim.forEach(shiur => {
        const shiurCard = createShiurCard(shiur);
        fragment.appendChild(shiurCard);
    });

    shiurimContainer.appendChild(fragment);
};



const initShiurimPage = async () => {
    try {
        // Fetch rabbis and initial shiurim in parallel for optimal performance
        await Promise.all([
            loadRabbisSection(),
            loadShiurim()
        ]);

    } catch (error) {
        console.error('שגיאה באתחול עמוד השיעורים:', error.message);
    }
};

//when the DOM is fully loaded, initialize the shiurim page
document.addEventListener('DOMContentLoaded', initShiurimPage);



