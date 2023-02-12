/**
 * Categories utils START
 */

function closeClick(_id) {
    const currentElement = document.getElementById(_id);
    const firstChild = currentElement.children[0];

    if (firstChild.classList.value === 'fas fa-eye-slash') {
        firstChild.classList.remove('fas', 'fa-eye-slash');
        firstChild.classList.add('fas', 'fa-eye');
    } else {
        firstChild.classList.remove('fas', 'fa-eye');
        firstChild.classList.add('fas', 'fa-eye-slash');
    }

    document.getElementById('visibleButton').remove();
}

function showOrHide(_id) {
    const currentElement = document.getElementById(_id);
    const firstChild = currentElement.children[0];

    if (firstChild.classList.value === 'fas fa-eye-slash') {
        showVisibleModal('show', _id);
        firstChild.classList.remove('fas', 'fa-eye-slash');
        firstChild.classList.add('fas', 'fa-eye');
    } else {
        showVisibleModal('hide', _id);
        firstChild.classList.remove('fas', 'fa-eye');
        firstChild.classList.add('fas', 'fa-eye-slash');
    }
    document.getElementById('visibleButton').remove();
}

function showVisibleModal(caseVisible, _id) {
    createModal({
        title: 'Change visible',
        _id: _id,
        caseVisible: caseVisible,
    });
    const modal = new bootstrap.Modal(document.getElementById('visibleButton'), {
        keyboard: false,
    });
    modal.show();
}

function createModal({ title = '', caseVisible, _id = '' }) {
    const main = document.getElementById('visible');
    if (main) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.classList.add('fade');
        modal.setAttribute('id', 'visibleButton');
        modal.setAttribute('aria-labelledby', 'visibleButtonLabel');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('data-bs-backdrop', 'static');
        modal.setAttribute('data-bs-keyboard', 'false');

        switch (caseVisible) {
            case 'show':
                modal.innerHTML = `
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-danger" id="visibleButtonLabel">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="closeClick('${_id}')"></button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to show this category?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="closeClick('${_id}');">Close</button>
                            <button type="button" class="btn btn-primary" onclick="acceptModal('show', '${_id}');">Save changes</button>
                        </div>
                        </div>
                    </div>
                `;
                break;
            case 'hide':
                modal.innerHTML = `
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-danger" id="visibleButtonLabel">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="closeClick('${_id}')"></button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to hide this category?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="closeClick('${_id}')">Close</button>
                            <button type="button" class="btn btn-primary" onclick="acceptModal('hide', '${_id}');">Save changes</button>
                        </div>
                        </div>
                    </div>
                `;
                break;
        }
        main.appendChild(modal);
    }
}

function acceptModal(data, _id) {
    $.ajax({
        type: 'POST',
        url: `/admin/categories/${_id}/change-visible`,
        data: { visible: data },
        success: function (response) {
            // if (response.success) console.log(response.success);
            document.getElementById('visibleButton').remove();
            document.querySelector('.modal-backdrop.fade.show').remove();
        },
        error: function (response) {
            // if (response.error) console.log(response.error);
            document.getElementById('visibleButton').remove();
            document.querySelector('.modal-backdrop.fade.show').remove();
        },
    });
}

/**
 * Categories utilities END
 */
