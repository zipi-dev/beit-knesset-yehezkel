import {getAllShiurim, getShiurById,getTitlesSuggestions} from './services/shiurimService.js';
import {createShiurCard} from 'shiur.js';
import {getAllRabbis} from './services/rabbiService.js';
import {createRabbiCard} from 'rabbi.js';
import {setupSearchAutocomplete} from 'searchAutocomplete.js';
let currentPage = 1;
let currentFilters = {};

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
            loadShiurim({ rabbi: rabbi._id }, true);
        });

        fragment.appendChild(rabbiCard);
    });

    rabbisContainer.appendChild(fragment); // into the DOM
};


const loadShiurim = async (filters = {}, isReset = false) => {
    const shiurimContainer = document.getElementById('shiurim-container'); 
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (!shiurimContainer) return;

    if (isReset) {
        currentFilters = filters; 
        currentPage = 1;     
        shiurimContainer.replaceChildren(); // clear existing content
    }
    const filtersToSend = {
        ...currentFilters, // לוקחים את הפילטרים השמורים (כמו חיפוש או רב)
        page: currentPage,
        perPage: 15
    };

    const shiurim = await getAllShiurim(filtersToSend);

    if (shiurim.length === 0) {
        if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
        return;
    }

    const fragment = document.createDocumentFragment();
    shiurim.forEach(shiur => {
        const shiurCard = createShiurCard(shiur);
        fragment.appendChild(shiurCard);
    });

    shiurimContainer.appendChild(fragment);

    if (loadMoreBtn) {
        if (shiurim.length < 15) {
            loadMoreBtn.classList.add('hidden'); 
        } else {
            loadMoreBtn.classList.remove('hidden'); 
        }
    }
};


const initShiurimPage = async () => {
    try {
        // Fetch rabbis and initial shiurim in parallel for optimal performance
        await Promise.all([
            loadRabbisSection(),
            loadShiurim()
        ]);

        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                currentPage++; 
                loadShiurim({}, false); 
            });
        }

        setupSearchAutocomplete(
            loadShiurim, // לחיצת Enter או חיפוש כללי
            async (shiurId) => {
                // 🌟 מימוש בחירת שיעור ספציפי לפי ID
                try {
                    const shiurimContainer = document.getElementById('shiurim-container');
                    const loadMoreBtn = document.getElementById('load-more-btn');
                    
                    if (!shiurimContainer) return;

                    // ננקה את המסך ונסתיר את כפתור "טען עוד"
                    shiurimContainer.replaceChildren();
                    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');

                    // שליפת השיעור הבודד מהשרת לפי ה-ID
                    const shiur = await getShiurById(shiurId);

                    if (shiur) {
                        const shiurCard = createShiurCard(shiur);
                        shiurimContainer.appendChild(shiurCard);
                    }
                } catch (error) {
        console.error('שגיאה באתחול עמוד השיעורים:', error.message);}
            } 
        );
        } catch (error) {
        console.error('שגיאה באתחול עמוד השיעורים:', error.message);
    }
};
        
  

//when the DOM is fully loaded, initialize the shiurim page
document.addEventListener('DOMContentLoaded', initShiurimPage);

