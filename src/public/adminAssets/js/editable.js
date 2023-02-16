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

        // If clicked on a icon edit
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
                if(text === element){
                    option.setAttribute('selected', '');
                }
                option.value = element;
                option.textContent = element;
                input.appendChild(option);
            }
            dd_element.parentNode.insertBefore(input, dd_element);
            console.log(input);

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
                if(text === element){
                    option.setAttribute('selected', '');
                }
                option.value = element;
                option.textContent = element;
                input.appendChild(option);
            }
            dd_element.parentNode.insertBefore(input, dd_element);
            console.log(input);

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
    let form = document.createElement('form');
    form.setAttribute('action', `/admin/categories/${_id}/edit`);
    form.setAttribute('method', 'POST');

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

    form.appendChild(cate_id);
    form.appendChild(cate_name);
    form.appendChild(cate_slug);
    form.appendChild(cate_total);

    document.body.appendChild(form);
    form.submit();
}
