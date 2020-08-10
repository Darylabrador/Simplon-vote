let voteForm         = document.querySelector('#voteForm');
let sujet            = document.querySelector('#sujet');
let participant      = document.querySelector('#participant');
let choiceContainer  = document.querySelector('#choiceContainer');
let btnAddLigne      = document.querySelector('#btnAddLigne');
let messageInterface = document.querySelector('#error');
let visibility       = document.querySelector('#visibility');
let token            = document.querySelector('#tokenAdd').value;
let voteCreationbtn  = document.querySelector('#voteCreation');
let data;

/**
 * Show error message
 * @param {string} message 
 */
function showSuccess(message) {
    messageInterface.innerHTML = `
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
function showError(message) {
    messageInterface.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show mt-0 flashMessage" role="alert">
        <strong>${message}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `;
}

if(btnAddLigne != undefined){
    btnAddLigne.addEventListener('click', () => {
        let choiceLigne = document.createElement('div');
        choiceLigne.classList.add('row', 'no-gutters', 'mb-2', 'choiceDetails', 'align-items-center');
        choiceLigne.innerHTML = `
        <div class="col">
            <input type="text" name="choice" class="choice form-control" placeholder="Saisir votre option de réponse">
        </div>
        <div class="col-1 ml-2 text-right">
            <button type="button" class="btn btn-outline-danger btnDelete"> &times; </button>
        </div>
        `;
        choiceContainer.appendChild(choiceLigne);
        let allChoicesLignes = document.querySelectorAll('.choiceDetails');
        let btnDeleteLigne = document.querySelectorAll(".btnDelete");

        for (let i = 0; i < btnDeleteLigne.length; i++) {
            btnDeleteLigne[i].addEventListener('click', (evt) => {
                evt.stopImmediatePropagation();
                allChoicesLignes[i].remove();
            });
        }
    });
}

if (voteForm !== null){
    voteForm.addEventListener('submit', evt =>{
        evt.preventDefault();
        let userId           = document.querySelector('#userId').value;
        let choices          = document.querySelectorAll('.choice');
        let sujetValue       = sujet.value;
        let participantValue = participant.value;
        let visibilityValue  = visibility.value;
        let choicesValues    = [];

        showSuccess("Votre sujet de vote est en cours de création !");
        voteCreationbtn.classList.add('d-none');

        for (let j = 0; j < choices.length; j++){
            choicesValues.push(choices[j].value);
        }
        if (choicesValues.length < 2){
            showError('Il faut plus de deux choix');
            voteCreationbtn.classList.remove('d-none');
        }else{
            for (let k = 0; k < choicesValues.length; k++){
                if (choicesValues[k] == ""){
                    showError('Il ne faut pas que les choix soient vides'); 
                    voteCreationbtn.classList.remove('d-none');
                }
            }
            data = {
                subject: sujetValue,
                quota: participantValue,
                choices: choicesValues,
                createdBy: userId,
                visibility: visibilityValue
            }
            $.ajax({
                type: "POST",
                url: "/dashboard/vote/add",
                headers: {
                    'csrf-token' : token,
                    'Content-Type' : 'application/json; charset=UTF-8'
                },
                data: JSON.stringify(data),
                dataType: "json",
                success: function (response) {
                    if(response != null){
                        if (response.success){
                            showSuccess(response.message);
                            voteCreationbtn.classList.remove('d-none');
                            voteForm.reset();
                            while (choiceContainer.lastChild) {
                                choiceContainer.removeChild(choiceContainer.lastChild);
                            }
                            location.href = '/dashboard';
                            
                        }else{
                            voteCreationbtn.classList.remove('d-none');
                            showError(response.message);
                        }
                    }
                }
            })
        }
    })
}