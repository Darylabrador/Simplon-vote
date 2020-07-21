let voteForm         = document.querySelector('#voteForm');
let sujet            = document.querySelector('#sujet');
let participant      = document.querySelector('#participant');
let choiceContainer  = document.querySelector('#choiceContainer');
let btnAddLigne      = document.querySelector('#btnAddLigne');
let messageInterface = document.querySelector('#error');
let visibility       = document.querySelector('#visibility');
let token            = document.querySelector('[name="_csrf"]').value;
let voteCreationbtn  = document.querySelector('#voteCreation');

let errCompteur = 0;

/**
 * Affichage du message de success avec un controle
 * @param {string} message 
 */
function showSuccess(message) {
    messageInterface.classList.add("alert", "alert-success");
    messageInterface.innerHTML = message;
    if (errCompteur == 1) {
        setTimeout(() => {
            messageInterface.classList.remove("alert", "alert-success");
            messageInterface.innerHTML = "";
            errCompteur = 0;
        }, 8000);
    }
}

/**
 * Affichage du message d'erreur avec un controle
 * @param {string} message 
 */
function showError(message) {
    messageInterface.classList.add("alert", "alert-danger");
    messageInterface.innerHTML = message;
    if (errCompteur == 1) {
        setTimeout(() => {
            messageInterface.classList.remove("alert", "alert-danger");
            messageInterface.innerHTML = "";
            errCompteur = 0;
        }, 10000);
    }
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
        voteCreationbtn.classList.add('disabled');

        for (let j = 0; j < choices.length; j++){
            choicesValues.push(choices[j].value);
        }
        if (choicesValues.length < 2){
            errCompteur++;
            if (errCompteur == 1) {
                showError('Il faut plus de deux choix');
            }
        }else{
            for (let k = 0; k < choicesValues.length; k++){
                if (choicesValues[k] == ""){
                    errCompteur++;
                    if (errCompteur == 1) {
                        showError('Il ne faut pas que les choix soient vides');
                    }
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
                            errCompteur++;
                            if (errCompteur == 1) {
                                showSuccess(response.message);
                                voteCreationbtn.classList.remove('disabled');
                                voteForm.reset();
                                while (choiceContainer.lastChild) {
                                    choiceContainer.removeChild(choiceContainer.lastChild);
                                }
                                location.href = '/dashboard';
                            }
                        }else{
                            errCompteur++;
                            if (errCompteur == 1) {
                                voteCreationbtn.classList.remove('disabled');
                                showError(response.message);
                            }
                        }
                    }
                }
            })
        }
    })
}