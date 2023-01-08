importCurrentHref();

/**
 * Import the href with parameters of search and parameters of pagination
 */
function importCurrentHref() {
    // Get all elements of pagination link
    let elements = document.getElementsByClassName('paginate-link');

    // Get the current url with query parameters
    let currentUrl = window.location.href;

    // Delete the param `page` to add a new page
    currentUrl = removeParam('page', currentUrl);

    // Get the current parameters of query string (parameters of search query)
    let currentParams = currentUrl.split('?')[1];

    if (currentParams) {
        // loop to import the parameters of search into the current url
        // Pagination with search parameters
        let count = elements.length;
        for (let i = 0; i < count; i++) {
            // href is param of page + params of search
            elements[i].href = `${elements[i].href}&${currentParams}`;
        }
    }
}

/**
 * @param {String} key A parameter to remove from url
 * @param {String} sourceURL A string of url
 * @returns A string of url what was removed a key parameter
 */
function removeParam(key, sourceURL) {
    var rtn = sourceURL.split('?')[0],
        param,
        params_arr = [],
        queryString = sourceURL.indexOf('?') !== -1 ? sourceURL.split('?')[1] : '';
    if (queryString !== '') {
        params_arr = queryString.split('&');
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split('=')[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + '?' + params_arr.join('&');
    }
    return rtn;
}
