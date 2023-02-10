let emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

/***
 * Validate email address, if email is valid return true, otherwise return false
 */
function isEmailValid(email) {
    if (!email) return false;

    if (email.length > 254) return false;

    let valid = emailRegex.test(email);
    if (!valid) return false;

    // Further checking of some things regex can't handle
    let parts = email.split('@');
    if (parts[0].length > 64) return false;

    let domainParts = parts[1].split('.');
    if (
        domainParts.some(function (part) {
            return part.length > 63;
        })
    )
        return false;

    return true;
}

/***
 * Validate input value, if is null or empty or !(input) return true, otherwise return false
 */
function isNullOrEmpty(value) {
    if (value) {
        return true;
    }
    return false;
}

module.exports = {
    isEmailValid,
    isNullOrEmpty,
};

// export default {
//     isEmailValid,
//     isNullOrEmpty
// };
