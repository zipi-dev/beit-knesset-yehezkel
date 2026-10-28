/**
 * יוצר את סרגל הניווט העליון (Header) עבור כל דפי האתר.
 * הכתובות מחושבות ביחס לקובץ הזה, ולכן הן עובדות גם מ-index.html וגם מתוך html/
 */
const CLIENT_ROOT = new URL('../', import.meta.url);
const pageUrl = (path) => new URL(path, CLIENT_ROOT).href;

const createHeader = () => {
    const header = document.createElement('header');
    header.classList.add('site-header');

    const nav = document.createElement('nav');
    nav.classList.add('nav-container');

    // לוגו / שם בית הכנסת
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo-container');
    const logoLink = document.createElement('a');
    logoLink.href = pageUrl('index.html');
    const logoTitle = document.createElement('span');
    logoTitle.classList.add('site-title');
    logoTitle.textContent = 'בית כנסת יחזקאל';
    logoLink.appendChild(logoTitle);
    logoDiv.appendChild(logoLink);

    // כפתור תפריט (נייד)
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.classList.add('nav-toggle');
    toggle.setAttribute('aria-label', 'תפריט');
    toggle.setAttribute('aria-expanded', 'false');
    for (let i = 0; i < 3; i++) {
        const bar = document.createElement('span');
        bar.classList.add('nav-toggle-bar');
        toggle.appendChild(bar);
    }

    // קישורי הניווט
    const ul = document.createElement('ul');
    ul.classList.add('nav-menu');

    const menuItems = [
        { text: 'דף הבית', path: 'index.html' },
        { text: 'לוח תפילות', path: 'html/schedule.html' },
        { text: 'זמני השבת', path: 'html/schedule.html#zmanim' },
        { text: 'אירועים', path: 'html/events.html' },
        { text: 'שיעורי תורה', path: 'html/shiurim.html' },
        { text: 'חוות דעת', path: 'html/opinions.html' },
        { text: 'ברכות', path: 'html/blessings.html' }
    ];

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = item.text;
        a.href = pageUrl(item.path);
        // הדגשת הדף הנוכחי (ללא קישור "זמני השבת", כדי שלא יודגשו שניים)
        const target = new URL(a.href);
        if (!item.path.includes('#') && target.pathname === location.pathname) a.classList.add('active');
        li.appendChild(a);
        ul.appendChild(li);
    });

    toggle.addEventListener('click', () => {
        const open = ul.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });

    nav.append(logoDiv, toggle, ul);
    header.appendChild(nav);
    document.body.prepend(header);
};

export default createHeader;