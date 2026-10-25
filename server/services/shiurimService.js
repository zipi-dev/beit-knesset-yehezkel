import { JewishCalendar, HebrewDateFormatter } from "kosher-zmanim";
import { isValidObjectId } from "mongoose";
import { Shiur } from "../models/shiurim.model.js";
import { env } from "../config/env.js";

// Parsha names made of two words, exactly as the library prints them
const TWO_WORD_NAMES = new Set([
    'לך לך', 'חיי שרה', 'כי תשא', 'אחרי מות', 'כי תצא', 'כי תבוא', 'וזאת הברכה'
]);

// Other spellings people use in titles (library spelling -> accepted spellings)
const SPELLING_VARIANTS = {
    'בהעלתך': ['בהעלתך', 'בהעלותך'],
    'תצוה': ['תצוה', 'תצווה'],
    'חוקת': ['חוקת', 'חקת'],
    'בחקתי': ['בחקתי', 'בחוקותי'],
    'פינחס': ['פינחס', 'פנחס'],
    'שופטים': ['שופטים', 'שפטים'],
    'קדושים': ['קדושים', 'קדשים'],
    'נצבים': ['נצבים', 'ניצבים']
};

const formatter = new HebrewDateFormatter();
formatter.setHebrewFormat(true); // Hebrew names

// The featured shiurim change rarely, so we keep the result in memory for a few minutes
const CACHE_MS = 5 * 60 * 1000;
let cache = { value: null, expires: 0 };

// Called when a shiur is added, updated or deleted, so the change shows up immediately
export const clearFeaturedCache = () => {
    cache = { value: null, expires: 0 };
};

// Splits the library's text into separate parsha names ("אחרי מות קדושים" -> two names)
const extractParshaNames = (formatted) => {
    const words = formatted.split(/\s+/).filter(Boolean);
    const names = [];
    for (let i = 0; i < words.length; i++) {
        const twoWords = words.slice(i, i + 2).join(' ');
        if (TWO_WORD_NAMES.has(twoWords)) {
            names.push(twoWords);
            i++;
        } else {
            names.push(words[i]);
        }
    }
    return names;
};

//get the parsha names for a given Shabbat date
const getParshaNamesByDate = (date) => {
    const calendar = new JewishCalendar(date);
    calendar.setInIsrael(true); 
    const parshaEnum = calendar.getParsha();
    if (!parshaEnum) return []; // getParsha returns a parsha only on Shabbat
    return extractParshaNames(formatter.formatParsha(parshaEnum));
};

// The Shabbat of this week (today, if today is Shabbat)
const getThisShabbat = () => {
    const date = new Date();
    date.setDate(date.getDate() + ((6 - date.getDay() + 7) % 7));
    return date;
};

// Builds a title search for each parsha name. The name must not be glued to other Hebrew letters
// (except the allowed prefixes like ב, ל), so "נח" will not match "נחמה"
const buildRegexQueries = (parshaNames) => {
    return parshaNames.map(name => {
        const variants = (SPELLING_VARIANTS[name] || [name])
            .map(variant => variant.replace(/ /g, '[\\s\\-]+')); // "לך לך" also matches "לך-לך"
        const regex = `(^|[^א-ת])[ובכלמה]{0,2}(${variants.join('|')})(?![א-ת])`;
        return { titleHebrew: { $regex: regex, $options: 'i' } };
    });
};

const findFeaturedShiurim = async () => {
    // The main rabbi is defined once in the .env file
    const rabbiId = env.MAIN_RABBI_ID;
    if (!rabbiId || !isValidObjectId(rabbiId)) {
        return { featuredShiurim: [], excludedIds: [] };
    }

    //calculate this Shabbat, the previous one and the next one
    const thisShabbat = getThisShabbat();
    const prevShabbat = new Date(thisShabbat);
    prevShabbat.setDate(thisShabbat.getDate() - 7);
    const nextShabbat = new Date(thisShabbat);
    nextShabbat.setDate(thisShabbat.getDate() + 7);

    const currentParshiyot = getParshaNamesByDate(thisShabbat);
    const adjacentParshiyot = [
        ...getParshaNamesByDate(prevShabbat),
        ...getParshaNamesByDate(nextShabbat)
    ];

    //clean up the parsha names to ensure uniqueness and remove any empty strings
    const uniqueCurrent = [...new Set(currentParshiyot)].filter(Boolean);
    const uniqueAdjacent = [...new Set(adjacentParshiyot)].filter(name => !uniqueCurrent.includes(name));

    if (uniqueCurrent.length === 0 && uniqueAdjacent.length === 0) {
        return { featuredShiurim: [], excludedIds: [] };
    }

    let featuredShiurim = [];

    //search for shiurim that match the current parasha
    if (uniqueCurrent.length > 0) {
        featuredShiurim = await Shiur.find({
            rabbi: rabbiId,
            $or: buildRegexQueries(uniqueCurrent)
        })
        .populate('rabbi')
        .sort({ date: -1 })
        .limit(3)
        .lean();
    }

    //if we don't have enough shiurim for the current parasha, search for shiurim that match the adjacent parashiyot
    if (featuredShiurim.length < 3 && uniqueAdjacent.length > 0) {
        const existingIds = featuredShiurim.map(s => s._id);
        const neededCount = 3 - featuredShiurim.length;

        const adjacentShiurim = await Shiur.find({
            rabbi: rabbiId,
            _id: { $nin: existingIds },
            $or: buildRegexQueries(uniqueAdjacent)
        })
        .populate('rabbi')
        .sort({ date: -1 })
        .limit(neededCount)
        .lean();

        featuredShiurim = [...featuredShiurim, ...adjacentShiurim];
    }

    //extract the IDs of the chosen shiurim
    const excludedIds = featuredShiurim.map(shiur => shiur._id);

    return { featuredShiurim, excludedIds };
};

export const getCurParshiyot = async () => {
    if (cache.value && Date.now() < cache.expires) {
        return cache.value;
    }

    try {
        const result = await findFeaturedShiurim();
        cache = { value: result, expires: Date.now() + CACHE_MS };
        return result;
    } catch (error) {
        // On failure we return an empty result and do not cache it
        console.error("שגיאה בשירות הפרשות החכם:", error.message);
        return { featuredShiurim: [], excludedIds: [] };
    }
};