const moment = require('moment-timezone');

const ONE_HOURS_MS = 1 * 60 * 60 * 1000; // One hours in milliseconds
const ONE_DAYS_MS = 24 * ONE_HOURS_MS; // One day in miliseconds

/**
 * A function that subtracts a date
 *
 * @param {Date} now Date to subtract
 * @param {Number} dateToSubtract Amount date to subtract from current date
 * @returns A new date with the subtracted date
 */
function subtractDates(now, dateToSubtract = 0) {
    return new Date(now.getTime() - ONE_DAYS_MS * dateToSubtract);
}

/**
 * A function that add a date
 * @param {Date} now Date to add
 * @param {Number} dateToAdd Amount date to add to current date
 * @returns A new date with the added date
 */
function addDates(now, dateToAdd = 0) {
    return new Date(now.getTime() + ONE_DAYS_MS * dateToAdd);
}

/**
 * A function that add a hour
 * @param {Date} now A date to add hour to
 * @param {Number} hoursToAdd Amount hour to add
 * @returns A new date with the added hour
 */
function addHours(now, hoursToAdd = 0) {
    let oneHours = 1 * 60 * 60 * 1000; // One hours in milliseconds
    return new Date(now.getTime() + hoursToAdd * oneHours);
}

/**
 * A function that subtracts a hour
 * @param {Date} now A date to subtract hours
 * @param {Number} hoursToAdd Amount of hours to subtract
 * @returns A new date with hours subtracted
 */
function subtractHours(now, hoursToAdd = 0) {
    let oneHours = 1 * 60 * 60 * 1000; // One hours in milliseconds
    return new Date(now.getTime() - hoursToAdd * oneHours);
}

/**
 *
 * @param {Date} date A date to format with formatting parameters
 * @param {string} format A string to format
 * @returns A new date with formated
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    return new Date(moment(date).format(format));
}

/**
 *
 * @param {Date} date A date to format with formatting parameters
 * @param {string} format A string to format
 * @returns A string of date formatted
 */
function formatDateToString(date, format = 'YYYY-MM-DD') {
    return moment(date).format(format);
}

/**
 *
 * @param {Date} localDate A local (GMT +7) date to trans to UTC
 * @returns A new date in UTC
 */
function makeLocalToUTC(GMT7) {
    // UTC is greater than localDate 7 hours ago
    return new Date(subtractHours(GMT7, 7));
}

/**
 *
 * @param {Date} localDate A UTC date to trans to local (GMT +7)
 * @returns
 */
function makeUTCToLocal(UTC) {
    // UTC is greater than localDate 7 hours ago
    return new Date(addHours(UTC, 7));
}

/**
 * Get a start and end of the days GMT+7 in UTC.
 *
 * @param {Date} date Current date to get one date from this
 * @returns An object with the start and end of the date
 */
function getOneDayInUTCWithLocal(date) {
    return {
        start: makeLocalToUTC(formatDate(date)), // Start of day in UTC with GMT + 7
        end: new Date(makeLocalToUTC(formatDate(date)).getTime() - 1), // End of day in UTC with GMT + 7 (by subtract 1 milisecond)
    };
}

/**
 * A function that convert UTC and GMT +7 to the same time zone to compare.
 *
 * @param {Date} GMT7 Date of GMT +7
 * @param {Date} UTC Date of UTC
 * @returns True if GMT +7 equals the current date of UTC, otherwise false
 */
function compareDateUTCWithGMT7(GMT7, UTC) {
    // Convert UTC to GMT +7
    UTC = makeUTCToLocal(UTC);

    // Compare the date between GMT + 7 and UTC
    return formatDateToString(UTC) === formatDateToString(GMT7);
}

function compareMonthUCTWithGMT7(GMT7, UTC) {
    // Convert UTC to GMT +7
    UTC = makeUTCToLocal(UTC);

    return GMT7.getMonth() === UTC.getMonth();
}

/**
 *
 * @param {Date} GMT7 Date of GMT +7 to convert to UTC
 * @returns Date in UTC
 */
function getThisTimeInUTCwithGMTp7(GMT7) {
    // Convert GMT +7 to UTC
    return makeLocalToUTC(GMT7);
}

module.exports = {
    getOneDayInUTCWithLocal,
    compareDateUTCWithGMT7,
    getThisTimeInUTCwithGMTp7,
    compareMonthUCTWithGMT7,
};
