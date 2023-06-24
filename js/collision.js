function createCollisionIcon(x, y) {
    var collisionId = 'collision-point-' + x + '-' + y;

    var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    icon.setAttribute('width', '16');
    icon.setAttribute('height', '16');
    icon.setAttribute('fill', 'red');
    icon.setAttribute('class', 'bi bi-bullseye');
    icon.setAttribute('viewBox', '0 0 16 16');
    icon.setAttribute('id', collisionId);

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z');
    icon.appendChild(path);

    var newIcon = icon.cloneNode(true);
    newIcon.style.position = 'absolute';
    newIcon.style.left = x + 'px';
    newIcon.style.top = y + 'px';

    radar.appendChild(newIcon);

    setTimeout(function () {
        removeCollisionIcon(collisionId);
    }, 8000);
}

function checkCollision() {
    var collisionDistance = 16; // Distância mínima para considerar uma colisão (pode ser ajustada conforme necessário)
    var collisionTimeThreshold = 3; // Limite de tempo para considerar uma colisão (em segundos)
    for (var i = 0; i < planes.length; i++) {
        var planeA = planes[i];
        for (var j = i + 1; j < planes.length; j++) {
            var planeB = planes[j];
            var distance = Math.sqrt(
                Math.pow(planeA.positionX - planeB.positionX, 2) +
                Math.pow(planeA.positionY - planeB.positionY, 2)
            );
            var relativeSpeed = Math.abs(planeA.speed - planeB.speed);
            var timeToCollision = distance / relativeSpeed;
            if (distance < collisionDistance && timeToCollision < collisionTimeThreshold) {
                collisionDetected(planeA, planeB);
                return;
            }
        }
    }
}

function collisionDetected(planeA, planeB) {
    removePlane(planeA);
    removePlane(planeB);
    createCollisionIcon(planeA.positionX, planeA.positionY);
    createCollisionIcon(planeB.positionX, planeB.positionY);


    totalAccidents += 2;
    totalMissingPassengers = totalMissingPassengers + planeA.passengers + planeB.passengers;

    var accidentsElement = document.querySelector('#accidents');
    var missingPassengersElement = document.querySelector('#missing-passengers');
    accidentsElement.textContent = totalAccidents;
    missingPassengersElement.textContent = totalMissingPassengers;

    playExplosionSound();
    speakMessage('Collision recorded between Flights ' + planeA.id + ' and ' + planeB.id);

    var convertedPlaneAPositions = convertToCartesian(planeA.positionX, planeA.positionY);
    var convertedPlaneBPositions = convertToCartesian(planeB.positionX, planeB.positionY);

    sendNotification(
        '[' + getCurrentTime() + ']' + ' ' +
        'Colisão detectada: ' +
        'Voo ' + planeA.id + ' na posX ' + convertedPlaneAPositions.offsetX.toFixed(2) + ' e posY ' + convertedPlaneAPositions.offsetY.toFixed(2) +
        ' com o Voo ' + planeB.id + ' na posX ' + convertedPlaneBPositions.offsetX.toFixed(2) + ' e posY ' + convertedPlaneBPositions.offsetY.toFixed(2) + '.'
    );
}

function removeCollisionIcon(collisionId) {
    var collisionIcon = document.getElementById(collisionId);
    if (collisionIcon) {
        collisionIcon.style.transition = 'opacity 1s';
        collisionIcon.style.opacity = 0;

        setTimeout(function () {
            collisionIcon.parentNode.removeChild(collisionIcon);
        }, 2000);
    }
}