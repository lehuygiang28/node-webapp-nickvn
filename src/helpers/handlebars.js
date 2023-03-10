const handlebars = require('handlebars');

module.exports = {
    vndCurrency: (value) => {
        return value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        // return value.toLocaleString('vi-VN', {currency: 'VND', style: 'currency'});
    },
    dateFormat: require('handlebars-dateformat'),
    paginate: require('handlebars-paginate'),
    getLastChars: (stringInput, count) => {
        return !stringInput ? '' : stringInput.toString().slice(Number(`-${count}`));
    },
    ifCondition: (a, operator, b, options) => {
        switch (operator) {
            case '==':
                return a == b ? options.fn(this) : options.inverse(this);
            case '===':
                return a === b ? options.fn(this) : options.inverse(this);
            case '!=':
                return a != b ? options.fn(this) : options.inverse(this);
            case '!==':
                return a !== b ? options.fn(this) : options.inverse(this);
            case '<':
                return a < b ? options.fn(this) : options.inverse(this);
            case '<=':
                return a <= b ? options.fn(this) : options.inverse(this);
            case '>':
                return a > b ? options.fn(this) : options.inverse(this);
            case '>=':
                return a >= b ? options.fn(this) : options.inverse(this);
            case '&&':
                return a && b ? options.fn(this) : options.inverse(this);
            case '||':
                return a || b ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    },
};
