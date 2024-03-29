function sendNotification(message) {
    var newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${message}</td>
    `;

    var informationTable = document.querySelector('#informations tbody');
    informationTable.insertBefore(newRow, informationTable.firstChild);

    var informationElement = document.getElementById('informations');
    if (informationTable.offsetHeight > 400) {
        informationElement.style.overflowY = 'scroll';
    } else {
        informationElement.style.overflowY = 'visible';
    }
}

function clearNotifications() {
    var informationTable = document.querySelector('#informations tbody');
    while (informationTable.firstChild) {
        informationTable.removeChild(informationTable.firstChild);
    }

    var informationElement = document.getElementById('informations');
    informationElement.style.overflowY = 'visible';
}