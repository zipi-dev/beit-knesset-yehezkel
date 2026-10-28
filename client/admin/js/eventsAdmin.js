import { getEvents, addEvent, updateEvent, deleteEvent, uploadEventImage } from '../../services/eventService.js';
import { h, showError } from './adminUi.js';

const form = document.getElementById('event-form');
const list = document.getElementById('events-list');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image-btn');

let editingId = null; // null = מצב הוספה, אחרת = מצב עריכה
// התמונה ששמורה כבר באירוע (במצב עריכה). ריק = אין תמונה
let currentImage = { url: '', publicId: '' };

const val = (id) => document.getElementById(id).value.trim();

// ---------- תמונה: תצוגה מקדימה והסרה ----------
const showPreview = (src) => {
    if (src) {
        imagePreview.src = src;
        imagePreview.classList.remove('hidden');
        removeImageBtn.classList.remove('hidden');
    } else {
        imagePreview.removeAttribute('src');
        imagePreview.classList.add('hidden');
        removeImageBtn.classList.add('hidden');
    }
};

// בחירת קובץ חדש: מציגים תצוגה מקדימה מקומית (עדיין לא מעלים - ההעלאה קורית בשמירה)
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    showPreview(file ? URL.createObjectURL(file) : currentImage.url);
});

// הסרת תמונה: מנקים גם קובץ שנבחר וגם תמונה קיימת
removeImageBtn.addEventListener('click', () => {
    imageInput.value = '';
    currentImage = { url: '', publicId: '' };
    showPreview('');
});

const resetForm = () => {
    form.reset();
    editingId = null;
    currentImage = { url: '', publicId: '' };
    showPreview('');
    submitBtn.textContent = 'הוסף אירוע';
    cancelBtn.classList.add('hidden');
};

const startEdit = (event) => {
    editingId = event._id;
    document.getElementById('name').value = event.name;
    document.getElementById('eventDate').value = event.eventDate.slice(0, 10);
    document.getElementById('text').value = event.description?.text || '';
    document.getElementById('photographer').value = event.photographer || '';
    document.getElementById('mediaUrl').value = event.mediaUrl || '';
    imageInput.value = '';
    currentImage = { url: event.imageUrl || '', publicId: event.imagePublicId || '' };
    showPreview(currentImage.url);
    submitBtn.textContent = 'שמור שינויים';
    cancelBtn.classList.remove('hidden');
    form.scrollIntoView();
};

const loadEvents = async () => {
    try {
        const events = await getEvents();
        if (events.length === 0) {
            list.replaceChildren(h('li', 'אין אירועים עדיין'));
            return;
        }
        list.replaceChildren(...events.map(event => {
            const li = h('li');
            const editBtn = h('button', 'ערוך');
            const delBtn = h('button', 'מחק');
            editBtn.type = delBtn.type = 'button';
            editBtn.addEventListener('click', () => startEdit(event));
            delBtn.addEventListener('click', async () => {
                if (!confirm(`למחוק את "${event.name}"?`)) return;
                try {
                    await deleteEvent(event._id);
                    if (editingId === event._id) resetForm();
                    await loadEvents();
                } catch (error) { showError(error); }
            });
            li.append(h('strong', event.name), ` - ${new Date(event.eventDate).toLocaleDateString('he-IL')} `, editBtn, delBtn);
            return li;
        }));
    } catch (error) { showError(error); }
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    try {
        // שלב 1: אם נבחרה תמונה חדשה - מעלים אותה קודם ומקבלים כתובת
        const file = imageInput.files[0];
        if (file) {
            submitBtn.textContent = 'מעלה תמונה...';
            const uploaded = await uploadEventImage(file); // { url, publicId }
            currentImage = { url: uploaded.url, publicId: uploaded.publicId };
        }

        // שלב 2: שומרים את האירוע (יחד עם כתובת התמונה)
        const data = {
            name: val('name'),
            eventDate: val('eventDate'),
            description: { text: val('text') },
            photographer: val('photographer'),
            mediaUrl: val('mediaUrl'),
            imageUrl: currentImage.url,
            imagePublicId: currentImage.publicId
        };
        if (editingId) await updateEvent(editingId, data);
        else await addEvent(data);
        resetForm();
        await loadEvents();
    } catch (error) {
        submitBtn.textContent = editingId ? 'שמור שינויים' : 'הוסף אירוע';
        showError(error);
    }
    finally { submitBtn.disabled = false; }
});

cancelBtn.addEventListener('click', resetForm);
loadEvents();
