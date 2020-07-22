const socket = io();

function displayMessage(type, message) {
    let alertmsg = document.querySelector('#alertmsg');
    alertmsg.innerHTML = `
        <div class="container-fluid mt-3">
            <div class="alert alert-${type} alert-dismissible fade show mt-0 flashMessage" role="alert">
                <strong>${message}</strong>
                <button id="btnRefresh" type="button" class="btn btn-secondary btn-sm">
                    Rafraichir la page
                </button>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
        `;
    let btnRefresh = document.querySelector('#btnRefresh');
    btnRefresh.addEventListener('click', evt => {
        location.reload();
    });
}

socket.on('connection', () => {
    console.log(socket.connected); // true
});

socket.on('vote', data => {
    switch (data.action) {
        case 'create':
            displayMessage('info', 'Un nouveau sujet vote est disponible');
            break;
        case 'open':
            displayMessage('info', 'Un vote est ouvert !');
            break;
        case 'result':
            displayMessage('info', 'Le résultat d\'un vote est disponible !');
            break;
        default:
            break;
    }
});