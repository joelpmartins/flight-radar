function calculateMagnitude(displacement) {
    return Math.sqrt(Math.pow(displacement.offsetX, 2) + Math.pow(displacement.offsetY, 2));
}

function calculateFlightTime(displacement, speed) {
    return calculateMagnitude(displacement) / speed;
}

function calculateDistance(plane) {
    return Math.sqrt(
        Math.pow(plane.positionX - radarWidth / 2, 2) +
        Math.pow(plane.positionY - radarHeight / 2, 2)
    );
}

function calculateDisplacement(plane) {
    var displacement = (plane.speed / 3600) * (interval / 100);
    var angleRadians = (plane.direction - 90) * (Math.PI / 180);
    var offsetX = Math.cos(angleRadians) * displacement;
    var offsetY = Math.sin(angleRadians) * displacement;
    return { offsetX: offsetX, offsetY: offsetY };
}

function detectPosition(angle, radius) {
    let posX = radarWidth / 2 + radius * Math.cos(angle * Math.PI / 180);
    let posY = radarHeight / 2 + radius * Math.sin(angle * Math.PI / 180)*-1;
    return { posX, posY };
}

function updateActivePlanesCount() {
    var activePlanesCount = planes.length;
    var passengersTotalCount = 0;
    var planesElement = document.querySelector('#total-planes');
    var passengersElement = document.querySelector('#total-passengers');
    planesElement.textContent = activePlanesCount;

    for (var i = 0; i < planes.length; i++) {
        passengersTotalCount += planes[i].passengers;
    }
    passengersElement.textContent = passengersTotalCount;
}

function generatePassengersToPlane(speed) {
    var passengers;
    if (speed < 800) {
        passengers = Math.round(Math.random() * (220 - 2) + 2);
    } else {
        passengers = Math.floor(Math.random() * (516 - 2) + 2);
    }
    return passengers += Math.floor(Math.random() * (20 - 8 + 1) + 8);
}

function handleSignalLoss(plane) {
    speakMessage('Loss of signal from flight ' + plane.id);

    var currentTime = getCurrentTime();
    var convertedPlanePositions = convertToCartesian(plane.positionX, plane.positionY)

    var notificationMessage =
        '[' + currentTime + '] ' +
        'Sinal perdido: ' + 'Voo ' + plane.id + ' saiu do raio do radar na posX ' + convertedPlanePositions.offsetX.toFixed(2) + ' e posY ' + convertedPlanePositions.offsetY.toFixed(2) + '.';

    showSignalLossIcon(plane);
    playNoSignalAudio();
    sendNotification(notificationMessage);
}

function showSignalLossIcon(plane) {
    var icon = createSignalLossIcon();

    icon.style.position = 'absolute';
    icon.style.left = plane.positionX + 'px';
    icon.style.top = plane.positionY + 'px';

    radar.appendChild(icon);

    setTimeout(function () {
        radar.removeChild(icon);
    }, 8000);
}

function createSignalLossIcon() {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttributeNS(null, "width", "16");
    svg.setAttributeNS(null, "height", "16");

    var path = document.createElementNS(svgNS, "path");
    path.setAttributeNS(null, "d", "M10.706 3.294A12.545 12.545 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c.63 0 1.249.05 1.852.148l.854-.854zM8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065 8.448 8.448 0 0 1 3.51-1.27L8 6zm2.596 1.404.785-.785c.63.24 1.227.545 1.785.907a.482.482 0 0 1 .063.745.525.525 0 0 1-.652.065 8.462 8.462 0 0 0-1.98-.932zM8 10l.933-.933a6.455 6.455 0 0 1 2.013.637c.285.145.326.524.1.75l-.015.015a.532.532 0 0 1-.611.09A5.478 5.478 0 0 0 8 10zm4.905-4.905.747-.747c.59.3 1.153.645 1.685 1.03a.485.485 0 0 1 .047.737.518.518 0 0 1-.668.05 11.493 11.493 0 0 0-1.811-1.07zM9.02 11.78c.238.14.236.464.04.66l-.707.706a.5.5 0 0 1-.707 0l-.707-.707c-.195-.195-.197-.518.04-.66A1.99 1.99 0 0 1 8 11.5c.374 0 .723.102 1.021.28zm4.355-9.905a.53.53 0 0 1 .75.75l-10.75 10.75a.53.53 0 0 1-.75-.75l10.75-10.75z");
    path.setAttributeNS(null, "fill", "white");

    svg.appendChild(path);
    return svg;
}
