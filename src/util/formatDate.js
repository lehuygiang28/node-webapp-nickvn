/**
 *
 * @returns A formatted string of locale date
 */
function formattedDate12h() {
    return `[${new Date().toLocaleString().slice(0, 23).replace(/-/g, '/').replace('T', ' ')}]`;
}

function formattedDate24h() {
    return `[${new Date()
        .toLocaleString([], { hour12: false })
        .slice(0, 23)
        .replace(/-/g, '/')
        .replace('T', ' ')}]`;
}

module.exports = {
    formattedDate12h,
    formattedDate24h,
};
