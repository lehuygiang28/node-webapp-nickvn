let arrAllowed = ['products', 'categories'];
let hrefSplit = window.location.href.split('/');

window.onload = function () {
    if (
        !hrefSplit || // Check validity of requested
        hrefSplit.length <= 1 || // Check validity of requested
        hrefSplit[3].toLowerCase() !== 'admin' || // Check controller is admin
        hrefSplit[hrefSplit.length - 1].toLowerCase() !== 'view' || // Check last parameter is 'view
        !arrAllowed.includes(hrefSplit[4]) // Check is allowed list to editable
    ) {
        return;
    }

    document.getElementById('content-editable').onclick = function (event) {
        let dd_element, input, text;

        // Get the event (handle MS difference)
        event = event || window.event;

        // Get the root element of the event (handle MS difference)
        dd_element = event.target || event.srcElement;

        // If has a disable-editable, then return
        if (dd_element.hasAttribute('disable-editable')) return;

        // If clicked on a dd element
        if (dd_element && dd_element.tagName.toUpperCase() === 'DD') {
            // Hide it
            dd_element.style.display = 'none';

            // Get its text
            text = dd_element.textContent;

            // Create an input
            input = document.createElement('input');
            input.classList.add('form-control', 'w-50');
            input.type = 'text';
            input.value = text;
            input.size = Math.max((text.length / 4) * 3, 4);
            dd_element.parentNode.insertBefore(input, dd_element);

            // Focus it, hook blur to undo
            input.focus();
            input.onblur = function () {
                // Remove the input
                dd_element.parentNode.removeChild(input);

                // Update the span
                dd_element.innerHTML = input.value == '' ? '&nbsp;' : input.value;
                dd_element.innerHTML += '<i class="fas fa-edit float-end"></i>';

                // Show the span again
                dd_element.style.display = '';
            };
        }

        // If clicked on a dd icon edit
        if (dd_element && dd_element.parentNode.tagName.toUpperCase() === 'DD') {
            // Change clicked on child to parent
            dd_element = dd_element.parentNode;

            // Hide it
            dd_element.style.display = 'none';

            // Get its text
            text = dd_element.textContent;

            // Create an input
            input = document.createElement('input');
            input.classList.add('form-control', 'w-50');
            input.type = 'text';
            input.value = text;
            input.size = Math.max((text.length / 4) * 3, 4);
            dd_element.parentNode.insertBefore(input, dd_element);

            // Focus it, hook blur to undo
            input.focus();
            input.onblur = function () {
                // Remove the input
                dd_element.parentNode.removeChild(input);

                // Update the span
                dd_element.innerHTML = input.value == '' ? '&nbsp;' : input.value;
                dd_element.innerHTML += '<i class="fas fa-edit float-end"></i>';

                // Show the span again
                dd_element.style.display = '';
            };
        }

        // If clicked on a select option ICON edit
        if (dd_element && dd_element.tagName.toUpperCase() === 'DO') {
            let visibleCase = ['show', 'hide'];

            // Hide it
            dd_element.style.display = 'none';

            // Get its text
            text = dd_element.textContent;

            // Create an select
            input = document.createElement('select');
            input.classList.add('form-select', 'text-capitalize', 'w-50');
            input.setAttribute('aria-label', 'Select visibility status');
            input.setAttribute('name', 'visible');
            input.size = visibleCase.length;

            for (const element of visibleCase) {
                let option = document.createElement('option');
                if (text === element) {
                    option.setAttribute('selected', '');
                }
                option.value = element;
                option.textContent = element;
                input.appendChild(option);
            }
            dd_element.parentNode.insertBefore(input, dd_element);

            input.focus();
            input.onblur = function () {
                // Remove the input
                dd_element.parentNode.removeChild(input);

                // Update the span
                dd_element.innerHTML = input.value == '' ? '&nbsp;' : input.value;
                dd_element.innerHTML += '<i class="fas fa-edit float-end"></i>';

                // Show the span again
                dd_element.style.display = '';
            };
        }

        // If clicked on a select option ICON edit
        if (dd_element && dd_element.parentNode.tagName.toUpperCase() === 'DO') {
            let visibleCase = ['show', 'hide'];

            // Change clicked on child to parent
            dd_element = dd_element.parentNode;

            // Hide it
            dd_element.style.display = 'none';

            // Get its text
            text = dd_element.textContent;

            // Create an select
            input = document.createElement('select');
            input.classList.add('form-select', 'text-capitalize', 'w-50');
            input.setAttribute('aria-label', 'Select visibility status');
            input.setAttribute('name', 'visible');
            input.size = visibleCase.length;

            for (const element of visibleCase) {
                let option = document.createElement('option');
                if (text === element) {
                    option.setAttribute('selected', '');
                }
                option.value = element;
                option.textContent = element;
                input.appendChild(option);
            }
            dd_element.parentNode.insertBefore(input, dd_element);

            input.focus();
            input.onblur = function () {
                // Remove the input
                dd_element.parentNode.removeChild(input);

                // Update the span
                dd_element.innerHTML = input.value == '' ? '&nbsp;' : input.value;
                dd_element.innerHTML += '<i class="fas fa-edit float-end"></i>';

                // Show the span again
                dd_element.style.display = '';
            };
        }

    };
};

/**
 * Create a form and get data from the list of details and submit it
 *
 * @param {*} _id
 */
function submitSaveChanges(_id) {
    let objectToEdit = hrefSplit[4];
    let form = document.createElement('form');

    switch (objectToEdit) {
        case 'categories':
            form.setAttribute('action', `/admin/categories/${_id}/edit`);
            form.setAttribute('method', 'POST');
            form.setAttribute('enctype', 'multipart/form-data');

            let cate_id = document.createElement('input');
            cate_id.setAttribute('type', 'hidden');
            cate_id.setAttribute('name', '_id');
            cate_id.value = _id;

            let cate_name = document.createElement('input');
            cate_name.setAttribute('type', 'hidden');
            cate_name.setAttribute('name', 'category_name');
            cate_name.value = document.getElementById('_category_name').textContent;

            let cate_slug = document.createElement('input');
            cate_slug.setAttribute('type', 'hidden');
            cate_slug.setAttribute('name', 'slug');
            cate_slug.value = document.getElementById('_slug').textContent;

            let cate_total = document.createElement('input');
            cate_total.setAttribute('type', 'hidden');
            cate_total.setAttribute('name', 'total');
            cate_total.value = document.getElementById('_total').textContent;

            let cate_visible = document.createElement('input');
            cate_visible.setAttribute('type', 'hidden');
            cate_visible.setAttribute('name', 'visible');
            cate_visible.value = document.getElementById('_visible').textContent;

            let cate_img = document.getElementById('gallery-photo-add');

            form.appendChild(cate_id);
            form.appendChild(cate_name);
            form.appendChild(cate_slug);
            form.appendChild(cate_total);
            form.appendChild(cate_visible);
            form.appendChild(cate_img);

            document.body.appendChild(form);
            form.submit();
            break;

        case 'products':
            form.setAttribute('action', `/admin/products/${_id}/edit`);
            form.setAttribute('method', 'POST');
            form.setAttribute('enctype', 'multipart/form-data');
            form.setAttribute('style', 'display:none;');

            let gameName = document.createElement('input');
            gameName.setAttribute('name', 'gameName');
            gameName.value = document.getElementById('_gameName').textContent;

            let price = document.createElement('input');
            price.setAttribute('name', 'price');
            price.value = document.getElementById('_price').textContent;

            let champ = document.createElement('input');
            champ.setAttribute('name', 'champ');
            champ.value = document.getElementById('_champ').textContent;

            let skin = document.createElement('input');
            skin.setAttribute('name', 'skin');
            skin.value = document.getElementById('_skin').textContent;

            let visible = document.createElement('input');
            visible.setAttribute('name', 'visible');
            visible.value = document.getElementById('_visible').textContent;

            let image = document.getElementById('image-gallery-add');

            form.appendChild(gameName);
            form.appendChild(price);
            form.appendChild(champ);
            form.appendChild(visible);
            form.appendChild(image);

            document.body.appendChild(form);
            form.submit();
            break;
    }
}

/**
 * 
 * @param {string} _userName User name to change status
 * @param {string} _status Status to change
 */
function banOrActive(_userName, _status) {
    let form = document.createElement("form");
    form.setAttribute("action", "/admin/users/change-status");
    form.setAttribute("method", "POST");
    form.setAttribute("style", "display: none");

    let userName = document.createElement("input");
    userName.setAttribute("name", "userName");
    userName.value = _userName;

    let status = document.createElement("input");
    status.setAttribute("name", "status");
    status.value = _status;

    form.appendChild(userName);
    form.appendChild(status);

    document.body.appendChild(form);
    form.submit();
}
