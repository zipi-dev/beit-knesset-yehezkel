// The home page slideshow. To add an image - add its file name to HERO_IMAGES.
const HERO_IMAGES = ['beitKneset.png'];
const SLIDE_TIME_MS = 5000; // how long each image stays on the screen

// The path is built from this file's location, so it works from any page
const imageUrl = (fileName) => new URL(`../assest/images/${fileName}`, import.meta.url).href;

const createSlide = (fileName) => {
    const img = document.createElement('img');
    img.src = imageUrl(fileName);
    img.alt = 'בית הכנסת יחזקאל';
    img.classList.add('hero-slide');
    return img;
};

const initHero = () => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const slides = HERO_IMAGES.map(createSlide);
    hero.append(...slides);
    slides[0].classList.add('active');

    if (slides.length < 2) return; // a single image - nothing to rotate

    let current = 0;
    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, SLIDE_TIME_MS);
};

document.addEventListener('DOMContentLoaded', initHero);