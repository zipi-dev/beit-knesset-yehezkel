import { getTitlesSuggestions } from '../services/shiurimService.js'; 

const createSuggestionItem = (item, onSelect) => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.textContent = item.titleHebrew || item.titleEnglish;

    suggestionItem.addEventListener('click', () => {
        onSelect(item);
    });

    return suggestionItem;
};


/**
 * מנהל את כל הלוגיקה של החיפוש החכם והרשימה הנפתחת (Autocomplete)
 * @param {Function} onSearchSelect - פונקציה לחיפוש כללי (למשל loadShiurim עם מחרוזת)
 * @param {Function} onShiurSelectById - פונקציה אופציונלית לבחירת שיעור ספציפי לפי ID
 */
export const setupSearchAutocomplete = (onSearchSelect, onShiurSelectById) => {
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('suggestions-container');

    if (!searchInput || !suggestionsContainer) return;

    let debounceTimer;

    // מאזין להקלדה בתיבת החיפוש
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        // איפוס הטיימר הקודם (Debounce)
        clearTimeout(debounceTimer);

        // תנאי: שולח בקשה לשרת אך ורק אם יש לפחות 2 תווים!
        if (query.length < 2) {
            suggestionsContainer.replaceChildren();
            suggestionsContainer.classList.add('hidden');
            return;
        }

        // ממתין 300 מילי-שניות מרגע ההקלדה האחרונה לפני שליחה לשרת
        debounceTimer = setTimeout(async () => {
            try {
                const suggestions = await getTitlesSuggestions(query);
                suggestionsContainer.replaceChildren();

                if (suggestions.length === 0) {
                    suggestionsContainer.classList.add('hidden');
                    return;
                }

                const fragment = document.createDocumentFragment();

                suggestions.forEach(item => {
                    const suggestionElement = createSuggestionItem(item, (selectedItem) => {
                        searchInput.value = selectedItem.titleHebrew || selectedItem.titleEnglish;
                        suggestionsContainer.replaceChildren();
                        suggestionsContainer.classList.add('hidden');

                        // אם נבחר פריט ספציפי ויש פונקציה לטיפול לפי ID - נעשה זאת
                        if (selectedItem._id && onShiurSelectById) {
                            onShiurSelectById(selectedItem._id);
                        } else {
                            // אחרת, מבצעים חיפוש כללי לפי המחרוזת
                            onSearchSelect({ search: selectedItem.titleHebrew || selectedItem.titleEnglish }, true);
                        }
                    });

                    fragment.appendChild(suggestionElement);
                });

                suggestionsContainer.appendChild(fragment);
                suggestionsContainer.classList.remove('hidden');
            } catch (err) {
                console.error('שגיאה בשליפת הצעות חיפוש:', err);
            }
        }, 300);
    });

    // לחיצת Enter בתיבת החיפוש לביצוע חיפוש כללי מלא
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            suggestionsContainer.classList.add('hidden');
            onSearchSelect({ search: query }, true);
        }
    });

    // סגירת הרשימה הנפתחת בעת לחיצה מחוץ לתיבת החיפוש
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.classList.add('hidden');
        }
    });
};