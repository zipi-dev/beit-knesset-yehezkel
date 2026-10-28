import { buildShiurForm } from './shiurForm.js';

export const openShiurDialog = ({ title, submitLabel, shiur, rabbis, isAdmin, onSave }) => {
    const dialog = document.createElement('dialog');

    const heading = document.createElement('h2');
    heading.textContent = title;

    const errorMsg = document.createElement('p'); // server errors show here

    const form = buildShiurForm({
        shiur,
        rabbis,
        isAdmin,
        submitLabel,
        onSubmit: async (data) => {
            try {
                await onSave(data);
                dialog.close();
            } catch (error) {
                errorMsg.textContent = error.message;
            }
        },
        onCancel: () => dialog.close()
    });

    dialog.append(heading, form, errorMsg);
    dialog.addEventListener('close', () => dialog.remove()); 
    document.body.appendChild(dialog);
    dialog.showModal();
};