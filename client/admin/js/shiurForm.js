// The shiur form - one place, used by both "add" and "update"

const FIELDS = [
    { name: 'titleHebrew', label: 'כותרת בעברית', type: 'text' },
    { name: 'titleEnglish', label: 'כותרת באנגלית', type: 'text' },
    { name: 'mediaUrl', label: 'קישור לשיעור', type: 'url' },
    { name: 'date', label: 'תאריך', type: 'date' }
];

// A label + its control, wrapped in a div
const createField = (name, labelText, control) => {
    const wrapper = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = labelText;
    label.htmlFor = `shiur-${name}`;

    control.id = `shiur-${name}`;
    control.name = name;

    wrapper.append(label, control);
    return wrapper;
};

const createInput = (type, value) => {
    const input = document.createElement('input');
    input.type = type;
    input.value = value ?? '';
    return input;
};

// The rabbi select - shown only to the main manager
const createRabbiSelect = (rabbis, selectedId) => {
    const select = document.createElement('select');

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'בחר רב';
    select.appendChild(placeholder);

    rabbis.forEach(rabbi => {
        const option = document.createElement('option');
        option.value = rabbi._id;
        option.textContent = rabbi.name;
        select.appendChild(option);
    });

    select.value = selectedId ?? '';
    return select;
};

// shiur is empty for "add", and a full shiur for "update"
export const buildShiurForm = ({ shiur = {}, rabbis = [], isAdmin = false, submitLabel, onSubmit, onCancel }) => {
    const form = document.createElement('form');

    FIELDS.forEach(({ name, label, type }) => {
        const value = name === 'date' ? shiur.date?.slice(0, 10) : shiur[name];
        form.appendChild(createField(name, label, createInput(type, value)));
    });

    if (isAdmin) {
        const selectedId = shiur.rabbi?._id;
        form.appendChild(createField('rabbi', 'רב', createRabbiSelect(rabbis, selectedId)));
    }

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = submitLabel;

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'ביטול';
    cancelBtn.addEventListener('click', onCancel);

    form.append(submitBtn, cancelBtn);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        onSubmit(Object.fromEntries(new FormData(form))); 
    });

    return form;
};