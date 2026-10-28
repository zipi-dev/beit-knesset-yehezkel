import { getOpinions, deleteOpinion } from '../../services/opinionService.js';
import { h, showError } from './adminUi.js';

const list = document.getElementById('opinions-list');

const loadOpinions = async () => {
    try {
        const opinions = await getOpinions();
        if (opinions.length === 0) {
            list.replaceChildren(h('li', 'אין חוות דעת עדיין'));
            return;
        }
        list.replaceChildren(...opinions.map(opinion => {
            const li = h('li');
            const delBtn = h('button', 'מחק');
            delBtn.type = 'button';
            delBtn.addEventListener('click', async () => {
                if (!confirm(`למחוק את חוות הדעת של ${opinion.userName}?`)) return;
                try {
                    await deleteOpinion(opinion._id);
                    await loadOpinions();
                } catch (error) { showError(error); }
            });
            li.append(
                h('strong', opinion.userName),
                ` (${new Date(opinion.createdAt).toLocaleDateString('he-IL')}, 👍 ${opinion.likes || 0}): `,
                opinion.comment, ' ', delBtn
            );
            return li;
        }));
    } catch (error) { showError(error); }
};

loadOpinions();
