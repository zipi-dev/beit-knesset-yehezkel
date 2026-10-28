import { getAllBlessingsAdmin, deleteBlessing } from '../../services/blessingService.js';
import { h, showError } from './adminUi.js';

const list = document.getElementById('blessings-list');

const loadBlessings = async () => {
    try {
        const blessings = await getAllBlessingsAdmin();
        if (blessings.length === 0) {
            list.replaceChildren(h('li', 'אין בקשות ברכה עדיין'));
            return;
        }
        list.replaceChildren(...blessings.map(blessing => {
            const li = h('li');
            const delBtn = h('button', 'מחק', 'danger');
            delBtn.type = 'button';
            delBtn.addEventListener('click', async () => {
                if (!confirm(`למחוק את הבקשה של ${blessing.name}?`)) return;
                try {
                    await deleteBlessing(blessing._id);
                    await loadBlessings();
                } catch (error) { showError(error); }
            });
            li.append(
                h('strong', blessing.name),
                ` בן/בת ${blessing.motherName} - ${blessing.blessingType} (${new Date(blessing.createdAt).toLocaleDateString('he-IL')}) `,
                delBtn
            );
            return li;
        }));
    } catch (error) { showError(error); }
};

loadBlessings();
