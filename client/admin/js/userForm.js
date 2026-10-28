// The "add user" form - the rabbi details are shown only when the role is rabbi

const createField = (name, labelText, control) => {
    const wrapper = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = labelText;
    label.htmlFor = `user-${name}`;

    control.id = `user-${name}`;
    control.name = name;

    wrapper.append(label, control);
    return wrapper;
};

const createInput = (type) => {
    const input = document.createElement('input');
    input.type = type;
    input.required = true;
    return input;
};

const createRoleSelect = () => {
    const select = document.createElement('select');
    [['rabbi', 'רב'], ['gabbai', 'גבאי']].forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        select.appendChild(option);
    });
    return select;
};

export const buildUserForm = ({ onSubmit, onCancel }) => {
    const form = document.createElement('form');

    const roleSelect = createRoleSelect();

    const bioInput = document.createElement('textarea');
    bioInput.required = true;

    // The fields that exist only for a rabbi
    const rabbiDetails = document.createElement('div');
    rabbiDetails.append(
        createField('name', 'שם הרב', createInput('text')),
        createField('imageUrl', 'קישור לתמונה', createInput('url')),
        createField('bio', 'על הרב', bioInput)
    );

    // Show/hide the rabbi fields. A disabled field is not validated and not sent
    const toggleRabbiDetails = () => {
        const isRabbi = roleSelect.value === 'rabbi';
        rabbiDetails.classList.toggle('hidden', !isRabbi);
        rabbiDetails.querySelectorAll('input, textarea').forEach(el => {
            el.disabled = !isRabbi;
        });
    };
    roleSelect.addEventListener('change', toggleRabbiDetails);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'הוסף';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'ביטול';
    cancelBtn.addEventListener('click', onCancel);

    form.append(
        createField('role', 'תפקיד', roleSelect),
        createField('username', 'שם משתמש', createInput('text')),
        createField('password', 'סיסמה', createInput('password')),
        rabbiDetails,
        submitBtn,
        cancelBtn
    );

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(form));

        const data = {
            username: values.username,
            password: values.password,
            role: values.role
        };
        // The server forbids the "rabbi" object for a gabbai, so add it only for a rabbi
        if (values.role === 'rabbi') {
            data.rabbi = { name: values.name, imageUrl: values.imageUrl, bio: values.bio };
        }
        onSubmit(data);
    });

    return form;
};