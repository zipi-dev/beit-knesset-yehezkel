import { JewishCalendar, HebrewDateFormatter } from "kosher-zmanim";
import {Shiur} from "../models/shiurim.model.js";
import {Rabbi} from "../models/rabbi.model.js";

export const getCurParshiyot = async (rabbiSearchName = "") => {
    try {
        //if we don't have a rabbi name
        if (!rabbiSearchName || !rabbiSearchName.trim()) {
            return { featuredShiurim: [], excludedIds: [] };
        }

        const formatter = new HebrewDateFormatter();
        formatter.useHebrewYear(false);

        //get the parsha names for a given date
        const getParshaNamesByDate = (date) => {
            const calendar = new JewishCalendar();
            calendar.setDate(date);
            const parshaEnum = calendar.getParsha();
            if (!parshaEnum) return [];
            const fullHebrewName = formatter.formatParsha(parshaEnum);
            return fullHebrewName ? fullHebrewName.split(/[\s-]/) : [];
        };

        //calculate the current date, previous week date, and next week date
        const today = new Date();
        const prevWeekDate = new Date(today);
        prevWeekDate.setDate(today.getDate() - 7);
        const nextWeekDate = new Date(today);
        nextWeekDate.setDate(today.getDate() + 7);

        const currentParshiyot = getParshaNamesByDate(today);
        const adjacentParshiyot = [
            ...getParshaNamesByDate(prevWeekDate),
            ...getParshaNamesByDate(nextWeekDate)
        ];

        //clean up the parsha names to ensure uniqueness and remove any empty strings
        const uniqueCurrent = [...new Set(currentParshiyot)].filter(Boolean);
        const uniqueAdjacent = [...new Set(adjacentParshiyot)].filter(name => !uniqueCurrent.includes(name));

        if (uniqueCurrent.length === 0 && uniqueAdjacent.length === 0) {
            return { featuredShiurim: [], excludedIds: [] };
        }

        //find the rabbi by name
        const featuredRabbi = await Rabbi.findOne({ name: { $regex: rabbiSearchName,$options: 'i' } });
        if (!featuredRabbi) return { featuredShiurim: [], excludedIds: [] };

        let featuredShiurim = [];

        const buildRegexQueries = (parshaNames) => {
            return parshaNames.map(name => {
                const boundaryRegex = `(^|[\\s\\-_"''׳״\\(\\)])([ובכלמה]{0,2})${name}($|[\\s\\-_"''׳״\\(\\)])`;
                return { titleHebrew: { $regex: boundaryRegex,$options: 'i' } };
            });
        };

        //search for shiurim that match the current parasha
        if (uniqueCurrent.length > 0) {
            featuredShiurim = await Shiur.find({
                rabbi: featuredRabbi._id,
                $or: buildRegexQueries(uniqueCurrent)
            })
            .populate('rabbi')
            .sort({ date: -1 })
            .limit(3);
        }

        //if we don't have enough shiurim for the current parasha, search for shiurim that match the adjacent parashiyot
        if (featuredShiurim.length < 3 && uniqueAdjacent.length > 0) {
            const existingIds = featuredShiurim.map(s => s._id);
            const neededCount = 3 - featuredShiurim.length;

            const adjacentShiurim = await Shiur.find({
                rabbi: featuredRabbi._id,
                _id: { $nin: existingIds },$or: buildRegexQueries(uniqueAdjacent)
            })
            .populate('rabbi')
            .sort({ date: -1 })
            .limit(neededCount);

            featuredShiurim = [...featuredShiurim, ...adjacentShiurim];
        }

        //extract the IDs of the chosen shiurim
        const excludedIds = featuredShiurim.map(shiur => shiur._id);

        return {
            featuredShiurim,
            excludedIds
        };

    } catch (error) {
        console.error("שגיאה בשירות הפרשות החכם:", error.message);
        return { featuredShiurim: [], excludedIds: [] };
    }
};