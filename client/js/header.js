/**
 * יוצר את סרגל הניווט העליון (Header) עבור כל דפי האתר
 */
 const createHeader = () => {
    const header = document.createElement('header');
    header.classList.add('site-header');

    const nav = document.createElement('nav');
    nav.classList.add('nav-container');

    // לוגו / שם בית הכנסת
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo-container');

    const logoLink = document.createElement('a');
    logoLink.href = 'index.html';
    
    const logoTitle = document.createElement('span');
    logoTitle.classList.add('site-title');
    logoTitle.textContent = 'בית כנסת יחזקאל';
    
    logoLink.appendChild(logoTitle);
    logoDiv.appendChild(logoLink);

    // רשימת קישורי הניווט
    const ul = document.createElement('ul');
    ul.classList.add('nav-menu');

    const menuItems = [
        { text: 'דף הבית', href: 'index.html' },
        { text: 'לוח תפילות', href: 'schedule.html' },
        { text: 'זמני השבת', href: 'zmanim.html' },
        { text: 'אירועים', href: 'events.html' },
        { text: 'שיעורי תורה', href: 'shiurim.html' },
        { text: 'חוות דעת', href: 'opinions.html' },
        { text: 'ברכות', href: 'blessings.html' }
    ];

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = item.text;
        a.href = item.href;
        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.append(logoDiv, ul);
    header.appendChild(nav);

    // הוספה בראש ה-body
    document.body.prepend(header);
};

export default createHeader;