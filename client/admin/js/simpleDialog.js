// A small reusable dialog: gets a list of fields, shows a form, calls onSave with the values
export const openSimpleDialog = ({ title, submitLabel, fields, onSave }) => {
    const dialog = document.createElement('dialog');

    const heading = document.createElement('h2');
    heading.textContent = title;

    const errorMsg = document.createElement('p'); // server errors show here

    const form = document.createElement('form');

    fields.forEach(({ name, label, type, value = '', required = false }) => {
        const wrapper = document.createElement('div');

        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.htmlFor = `simple-${name}`;

        const control = document.createElement(type === 'textarea' ? 'textarea' : 'input');
        if (type !== 'textarea') control.type = type;
        control.id = `simple-${name}`;
        control.name = name;
        control.value = value ?? '';
        control.required = required;

        wrapper.append(labelEl, control);
        form.appendChild(wrapper);
    });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = submitLabel;

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'ביטול';
    cancelBtn.addEventListener('click', () => dialog.close());

    form.append(submitBtn, cancelBtn);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            await onSave(Object.fromEntries(new FormData(form)));
            dialog.close();
        } catch (error) {
            errorMsg.textContent = error.message;
        }
    });

    dialog.append(heading, form, errorMsg);
    dialog.addEventListener('close', () => dialog.remove());
    document.body.appendChild(dialog);
    dialog.showModal();
};