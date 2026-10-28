import {
    getAllSchedules, createSchedule, updateSchedule, deleteSchedule,
    addPrayerToSchedule, removePrayerFromSchedule
} from '../../services/scheduleService.js';
import { h, showError } from './adminUi.js';

const form = document.getElementById('schedule-form');
const container = document.getElementById('schedules-list');

// הרצת פעולה, ואז רענון הרשימה
const act = (fn) => async () => {
    try { await fn(); await loadSchedules(); } catch (error) { showError(error); }
};

const button = (text, onClick) => {
    const btn = h('button', text);
    btn.type = 'button';
    btn.addEventListener('click', onClick);
    return btn;
};

const input = (placeholder) => {
    const el = h('input');
    el.type = 'text';
    el.placeholder = placeholder;
    return el;
};

const createPrayerForm = (schedule) => {
    const name = input('שם התפילה'), time = input('שעה'), notes = input('הערות (לא חובה)');
    const add = button('הוסף תפילה', act(async () => {
        await addPrayerToSchedule(schedule._id, { name: name.value.trim(), time: time.value.trim(), notes: notes.value.trim() });
    }));
    const row = h('div');
    row.append(name, time, notes, add);
    return row;
};

const createScheduleBox = (schedule) => {
    const box = h('section');
    const title = h('h3', schedule.title + (schedule.isActive ? ' (פעיל באתר)' : ''));
    const actions = h('div');
    if (!schedule.isActive) {
        actions.append(button('הפעל באתר', act(() => updateSchedule(schedule._id, { isActive: true }))));
    }
    actions.append(button('מחק לוח', async () => {
        if (!confirm(`למחוק את הלוח "${schedule.title}"?`)) return;
        await act(() => deleteSchedule(schedule._id))();
    }));

    const prayers = h('ul');
    (schedule.prayers || []).forEach(prayer => {
        const li = h('li', `${prayer.name} - ${prayer.time}${prayer.notes ? ` (${prayer.notes})` : ''} `);
        li.append(button('הסר', act(() => removePrayerFromSchedule(schedule._id, prayer._id))));
        prayers.append(li);
    });

    box.append(title, actions, prayers, createPrayerForm(schedule));
    return box;
};

const loadSchedules = async () => {
    try {
        const schedules = await getAllSchedules();
        container.replaceChildren(...(schedules.length ? schedules.map(createScheduleBox) : [h('p', 'אין לוחות עדיין')]));
    } catch (error) { showError(error); }
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = document.getElementById('date').value;
    try {
        await createSchedule({ title: document.getElementById('title').value.trim(), ...(date && { date }) });
        form.reset();
        await loadSchedules();
    } catch (error) { showError(error); }
});

loadSchedules();
