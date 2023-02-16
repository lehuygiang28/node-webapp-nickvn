window.onload = function () {
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
    let formData = new FormData();
    let request = new XMLHttpRequest();
    formData.append('_id', _id);
    formData.append('category_name', document.getElementById('_category_name').textContent);
    formData.append('slug', document.getElementById('_slug').textContent);
    formData.append('total', document.getElementById('_total').textContent);
    formData.append('visible', document.getElementById('_visible').textContent);
    formData.append('img', document.getElementById('gallery-photo-add').files[0]);
    // fetch(`/admin/categories/${_id}/edit`, { method: 'POST', body: formData });
    request.open('POST', `/admin/categories/${_id}/edit`);
    request.send(formData);
    request.onload = function () {
        let resJson = JSON.parse(request.responseText);
        if (resJson.success) {
            let successElement = document.getElementById('alert_success');
            successElement.removeAttribute('style');
            let message = document.createElement('div');
            message.innerText = resJson.success;
            successElement.appendChild(message);

            setTimeout(function () {
                location.reload();
            }, 5000); // Wait 5 seconds before reloading page
        } else {
            let errorElement = document.getElementById('alert_error');
            errorElement.removeAttribute('style');
            let message = document.createElement('div');
            message.innerText = resJson.error;
            errorElement.appendChild(message);
        }
    };
}
