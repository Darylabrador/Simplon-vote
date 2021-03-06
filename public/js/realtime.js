const socket = io();

function displayMessage(type, message) {
    let alertmsg = document.querySelector('#alertmsg');
    alertmsg.innerHTML = `
        <div class="container-fluid mt-3">
            <div class="alert alert-${type} alert-dismissible fade show mt-0 flashMessage" role="alert">
                <strong>${message}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
        `;
    
    setTimeout(() =>{
        location.reload();
    }, 3000);
}

socket.on('connection', () => {
    console.log(socket.connected);
});

socket.on('vote', data => {
    switch (data.action) {
        case 'create':
            displayMessage('success', 'Un nouveau sujet vote est disponible');
            break;
        case 'open':
            displayMessage('success', 'Un vote est ouvert !');
            break;
        case 'result':
            displayMessage('success', 'Le résultat d\'un vote est disponible !');
            break;
        default:
            break;
    }
});