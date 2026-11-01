const CLIENT_ROOT = new URL('../', import.meta.url);
const pageUrl = (path) => new URL(path, CLIENT_ROOT).href;

/**
 * יוצר את תחתית העמוד (Footer) המעוצבת עבור כל דפי האתר
 */
const createFooterCta = () => {
    const section = document.createElement('section');
    section.classList.add('footer-cta');

    const title = document.createElement('h2');
    title.textContent = 'נשמח לראותכם בבית כנסת יחזקאל';

    const subtitle = document.createElement('p');
    subtitle.textContent = 'תפילות במניין, שיעורי תורה ואווירה קהילתית חמה';
const donateBox = document.createElement('a');
donateBox.classList.add('donate-box');
donateBox.href = 'https://www.matara.pro/nedarimplus/online/?mosad=7001638';
donateBox.target = '_blank';
donateBox.rel = 'noopener';

// אייקון לב
const svgNS = 'http://www.w3.org/2000/svg';
const heart = document.createElementNS(svgNS, 'svg');
heart.setAttribute('viewBox', '0 0 24 24');
heart.setAttribute('width', '56');
heart.setAttribute('height', '56');
heart.setAttribute('fill', 'currentColor');
heart.classList.add('donate-icon');
const heartPath = document.createElementNS(svgNS, 'path');
heartPath.setAttribute('d', 'M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z');
heart.appendChild(heartPath);

const donateText = document.createElement('span');
donateText.classList.add('donate-text');
const donateTitle = document.createElement('strong');
donateTitle.textContent = 'תרמו לבית הכנסת';
const donateSub = document.createElement('small');
donateSub.textContent = 'כל תרומה עוזרת לנו להמשיך';
donateText.append(donateTitle, donateSub);

const donateBtn = document.createElement('span');
donateBtn.classList.add('donate-btn');
donateBtn.textContent = 'לתרומה';

donateBox.append(heart, donateText, donateBtn);
section.append(title, subtitle, donateBox);
    return section;
};

const createFooterNav = () => {
    const footerMain = document.createElement('div');
    footerMain.classList.add('footer-main');

    const gridContainer = document.createElement('div');
    gridContainer.classList.add('footer-nav-container');

    // עמודת ניווט מהיר
    const navCol = document.createElement('div');
    navCol.classList.add('footer-col');

    const navTitle = document.createElement('h3');
    navTitle.textContent = 'ניווט מהיר';

    const navList = document.createElement('ul');
    const navItems = [
        { text: 'דף הבית', href: pageUrl('index.html') },
        { text: 'לוח תפילות', href: pageUrl('html/schedule.html') },
        { text: 'זמני השבת', href: pageUrl('html/schedule.html#zmanim') },
        { text: 'אירועי הקהילה', href: pageUrl('html/events.html') },
        { text: 'שיעורי תורה', href: pageUrl('html/shiurim.html') },
        { text: 'חוות דעת', href: pageUrl('html/opinions.html') },
        { text: 'ברכות', href: pageUrl('html/blessings.html') }
    ];

    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = item.text;
        a.href = item.href;
        li.appendChild(a);
        navList.appendChild(li);
    });

    navCol.append(navTitle, navList);

    // עמודת צור קשר ופרטים
    const infoCol = document.createElement('div');
    infoCol.classList.add('footer-col');

    const infoTitle = document.createElement('h3');
    infoTitle.textContent = 'צור קשר ומיקום';

    const infoList = document.createElement('ul');
    const infoItems = [
        'כתובת: רחוב ארנון 2 תל אביב',
        'טלפון ליצירת קשר: 0556748143',
        'דוא"ל:arie@rabanut. '
    ];

    infoItems.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        infoList.appendChild(li);
    });

    infoCol.append(infoTitle, infoList);
    gridContainer.append(navCol, infoCol);
    footerMain.appendChild(gridContainer);

    return footerMain;
};

const createFooterBottom = () => {
    const bottomBar = document.createElement('div');
    bottomBar.classList.add('footer-bottom');

    const container = document.createElement('div');
    container.classList.add('footer-bottom-container');

    const copyright = document.createElement('span');
    copyright.textContent = '© כל הזכויות שמורות לבית כנסת יחזקאל';
    copyright.classList.add('copyright');

    // כפתור כניסת מנהל דיסקרטי עם אייקון מנעול SVG
    const adminLink = document.createElement('a');
    adminLink.href = pageUrl('admin/html/login.html');
    adminLink.classList.add('admin-lock-btn');
    adminLink.setAttribute('aria-label', 'כניסת מנהל');

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');

    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', '3');
    rect.setAttribute('y', '11');
    rect.setAttribute('width', '18');
    rect.setAttribute('height', '11');
    rect.setAttribute('rx', '2');
    rect.setAttribute('ry', '2');

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M7 11V7a5 5 0 0 1 10 0v4');

    svg.append(rect, path);
    const label = document.createElement('span');
    label.textContent = ' כניסת מנהל';
    adminLink.append(svg, label);

    container.append(copyright, adminLink);
    bottomBar.appendChild(container);
    return bottomBar;
};

 const createFooter = () => {
    const footer = document.createElement('footer');
    footer.classList.add('site-footer');

    const ctaBanner = createFooterCta();
    const footerNav = createFooterNav();
    const footerBottom = createFooterBottom();

    footer.append(ctaBanner, footerNav, footerBottom);
    document.body.appendChild(footer);
};

export default createFooter;