let editForm             = document.querySelector('#editForm');
let sujetEdit            = document.querySelector('#sujetEdit');
let messageInterfaceEdit = document.querySelector('#errorEdit');
let visibilityEdit       = document.querySelector('#visibilityEdit');
let tokenEdit            = document.querySelector('#csrfEdit').value;
let nbParticipantEdit    = document.querySelector('#participantEdit');
let choiceContainerEdit  = document.querySelector('#choiceContainerEdit');
let btnAddLigneEdit      = document.querySelector('#btnAddLigneEdit');
let voteEditbtn          = document.querySelector('#voteEditbtn');
let dataEdit; 

/**
 * Show error message
 * @param {string} message 
 */
function showSuccessEdit(message) {
    messageInterfaceEdit.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show mt-0 flashMessage" role="alert">
        <strong>${message}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `;
}

/**
 * Show success message
 * @param {string} message 
 */
function showErrorEdit(message) {
    messageInterfaceEdit.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show mt-0 flashMessage" role="alert">
        <strong>${message}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `;
}

if (btnAddLigneEdit != undefined) {
    btnAddLigneEdit.addEventListener('click', () => {
        let choiceLigneEdit = document.createElement('div');
        choiceLigneEdit.classList.add('row', 'no-gutters', 'mb-2', 'choiceDetailsEdit', 'align-items-center');
        choiceLigneEdit.innerHTML = `
        <div class="col">
            <input type="text" name="choice" class="choiceEdit form-control" placeholder="Saisir votre option de réponse">
        </div>
        <div class="col-1 ml-2 text-right">
            <button type="button" class="btn btn-outline-danger btnDeleteEdit"> &times; </button>
        </div>
        `;
        choiceContainerEdit.appendChild(choiceLigneEdit);
        let allChoicesLignesEdit = document.querySelectorAll('.choiceDetailsEdit');
        let btnDeleteLigneEdit = document.querySelectorAll(".btnDeleteEdit");

        for (let j = 0; j < btnDeleteLigneEdit.length; j++) {
            btnDeleteLigneEdit[j].addEventListener('click', (evt) => {
                evt.stopImmediatePropagation();
                allChoicesLignesEdit[j].remove();
            });
        }
    });
};

if (editForm !== null) {
    editForm.addEventListener('submit', evt => {
        evt.preventDefault();

        let voteid                = document.querySelector('#voteId').value;
        let choicesEdit           = document.querySelectorAll('.choiceEdit');
        let sujetValueEdit        = sujetEdit.value;
        let participantValueEdit  = nbParticipantEdit.value;
        let visibilityValueEdit   = visibilityEdit.value;
        let choicesValuesEdit     = [];

        showSuccessEdit("Votre sujet de vote est en cours de modification !");
        voteEditbtn.classList.add('d-none');

        for (let k = 0; k < choicesEdit.length; k++) {
            choicesValuesEdit.push(choicesEdit[k].value);
        }

        if (choicesValuesEdit.length < 2) {
            showErrorEdit('Il faut plus de deux choix');
            voteEditbtn.classList.remove('d-none');
        } else {
            for (let l = 0; l < choicesValuesEdit.length; l++) {
                if (choicesValuesEdit[l] == "") {
                    showErrorEdit('Il ne faut pas que les choix soient vides');
                    voteEditbtn.classList.remove('d-none');
                }
            }
            dataEdit = {
                voteId: voteid,
                subject: sujetValueEdit,
                quota: participantValueEdit,
                choices: choicesValuesEdit,
                visibility: visibilityValueEdit
            }
            $.ajax({
                type: "POST",
                url: "/dashboard/vote/edit",
                headers: {
                    'csrf-token': token,
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: JSON.stringify(dataEdit),
                dataType: "json",
                success: function (response) {
                    if (response != null) {
                        if (response.success) {
                            showSuccessEdit(response.message);
                            voteEditbtn.classList.remove('d-none');
                        } else {
                            voteEditbtn.classList.remove('d-none');
                            showErrorEdit(response.message);
                        }
                    }
                }
            })
        }
    });
};
