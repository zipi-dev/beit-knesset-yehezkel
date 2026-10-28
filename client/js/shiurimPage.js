import {getCurrentUser} from '../services/authService.js';
import {createShiurCard} from './shiur.js';
import {getAllRabbis, updateRabbi} from '../services/rabbiService.js';
import {openSimpleDialog} from '../admin/js/simpleDialog.js';
import {createRabbiCard} from './rabbi.js';
import {setupSearchAutocomplete} from './searchAutocomplete.js';
import {getAllShiurim, getShiurById, deleteShiur, addShiur,updateShiur} from '../services/shiurimService.js';
import {openShiurDialog} from '../admin/js/shiurDialog.js';
import { getAllUsers, deleteUser} from '../services/userService.js';


let currentPage = 1;
let currentFilters = {};

// Are we on the admin page? (the admin page has data-admin on its body)
const isAdminPage = document.body.hasAttribute('data-admin');
const currentUser = getCurrentUser();

// Does the logged-in user have the right to change this shiur? (the server checks this again)
const canManage = (shiur) => {
    if (!isAdminPage || !currentUser) return false;
    if (currentUser.role === 'admin') return true; // the main manager: all the shiurim
    return currentUser.role === 'rabbi' && shiur.rabbi?._id === currentUser.rabbiProfile; // a rabbi: only his own
};

// Ask for confirmation, delete in the server, and remove the card from the screen
const handleDelete = async (shiur, card) => {
    if (!confirm(`למחוק את השיעור "${shiur.titleHebrew}"?`)) return;
    try {
        await deleteShiur(shiur._id);
        card.remove();
    } catch (error) {
        alert(error.message);
    }
};


// Opens the shared dialog - the same for add and edit
const openForm = async (options) => {
    const isAdmin = currentUser.role === 'admin';
    const rabbis = isAdmin ? await getAllRabbis() : [];
    openShiurDialog({ ...options, rabbis, isAdmin });
};

const handleAdd = () => openForm({
    title: 'הוספת שיעור',
    submitLabel: 'הוסף',
    onSave: async (data) => {
        await addShiur(data);
        loadShiurim({}, true);
    }
});

const handleEdit = (shiur, card) => openForm({
    title: 'עריכת שיעור',
    submitLabel: 'שמור',
    shiur,
    onSave: async (data) => {
        const updated = await updateShiur(shiur._id, data);
        card.replaceWith(createShiurCard(updated, cardOptions(updated)));
    }
});

const initAddButton = () => {
    const addBtn = document.getElementById('add-shiur-btn');
    if (!addBtn || !currentUser) return;

    if (['admin', 'rabbi'].includes(currentUser.role)) {
        addBtn.classList.remove('hidden');
        addBtn.addEventListener('click', handleAdd);
    }
};









// What the card receives: a delete function only if the user may manage this shiur
const cardOptions = (shiur) => (canManage(shiur) ? { onEdit: handleEdit, onDelete: handleDelete } : {});

// May the user edit this rabbi's details? (the server checks this again)
const canEditRabbi = (rabbi) => {
    if (!isAdminPage || !currentUser) return false;
    if (currentUser.role === 'admin') return true; // the main manager: every rabbi
    return currentUser.role === 'rabbi' && rabbi._id === currentUser.rabbiProfile; // a rabbi: only himself
};

const handleEditRabbi = (rabbi) => openSimpleDialog({
    title: 'עריכת פרטי הרב',
    submitLabel: 'שמור',
    fields: [
        { name: 'name', label: 'שם הרב', type: 'text', value: rabbi.name, required: true },
        { name: 'imageUrl', label: 'קישור לתמונה', type: 'url', value: rabbi.imageUrl },
        { name: 'bio', label: 'על הרב', type: 'textarea', value: rabbi.bio }
    ],
    onSave: async (data) => {
        await updateRabbi(rabbi._id, data);
        await loadRabbisSection(); // draw the cards again with the new details
    }
});

// Only the main manager: delete a rabbi completely - his login, his profile and all his shiurim
const handleDeleteManager = async (rabbi, user) => {
    const ok = confirm(
        `למחוק את "${rabbi.name}" מהמערכת?\n` +
        'פעולה זו תמחק גם את כל השיעורים שלו, ואי אפשר לבטל אותה.'
    );
    if (!ok) return;

    try {
        await deleteUser(user._id);
        await Promise.all([
            loadRabbisSection(),
            loadShiurim({}, true) // the shiurim of this rabbi are gone too
        ]);
    } catch (error) {
        alert(error.message);
    }
};


const loadRabbisSection = async () => {
    const isMainManager = isAdminPage && currentUser?.role === 'admin';

    // The users are needed only by the main manager, to connect each rabbi to his user
    const [rabbis, users] = await Promise.all([
        getAllRabbis(),
        isMainManager ? getAllUsers().catch(() => []) : []
    ]);

    const rabbisContainer = document.getElementById('rabbis-container');
    if (!rabbisContainer) return;

    rabbisContainer.replaceChildren(); // clear existing content
    const fragment = document.createDocumentFragment();

    rabbis.forEach(rabbi => {
        // The main rabbi has no user in the database, so he gets no delete button
        const user = users.find(u => u.rabbiProfile?._id === rabbi._id);

        const rabbiCard = createRabbiCard(rabbi, {
            onEdit: canEditRabbi(rabbi) ? handleEditRabbi : undefined,
            onDelete: user ? () => handleDeleteManager(rabbi, user) : undefined
        });

        rabbiCard.addEventListener('click', () => {
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
        const shiurCard = createShiurCard(shiur, cardOptions(shiur));
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
    initAddButton();
   
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

