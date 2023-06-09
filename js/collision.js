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

    var npTitle = '';
    var npText = '';
    var today = new Date();
    var npTitleElement = document.getElementById('np-title');
    var npTextElement = document.getElementById('np-text');

    if (totalAccidents <= 2) {
        npTitle = 'Breaking News ' + formatDate(today, 'DD-MM');
        npText = 'Hoje foi registrado um acidente entre ' + totalAccidents + ' aviões e ' + totalMissingPassengers + ' passageiros estão desaparecidos até o momento, a causa do acidente está sendo investigada.';
        playPlantaoSound();
    } else if (totalAccidents <= 4) {
        npTitle = 'Tragédia! ' + formatDate(today, 'DD-MM');
        npText = 'Vários acidentes ocorreram hoje, totalizando ' + totalAccidents + ' ocorrências. Um total de ' + totalMissingPassengers + ' passageiros estão desaparecidos.';
    } else if (totalAccidents <= 6) {
        npTitle = 'Grande tragédia! ' + formatDate(today, 'DD-MM');
        npText = totalAccidents + ' aviões se envolveram em acidentes e ' + totalMissingPassengers + ' passageiros estão desaparecidos.';
    } else {
        npTitle = 'Situação crítica! ' + formatDate(today, 'DD-MM');
        npText = 'O que está acontecendo com o espaço aéreo? ' + totalAccidents + ' aviões sofreram acidentes e ' + totalMissingPassengers + ' passageiros estão desaparecidos. Medidas urgentes estão sendo tomadas.';
    }

    npTitleElement.textContent = npTitle;
    npTextElement.textContent = npText;
    document.querySelector('.newspaper').style.display = 'block';

    speakMessage('Collision recorded between Flights ' + planeA.id + ' and ' + planeB.id);
    sendNotification(
        '[' + getCurrentTime() + ']' + ' ' +
        'Colisão detectada: ' +
        'Voo ' + planeA.id + ' na posX ' + planeA.positionX.toFixed(2) + ' e posY ' + planeA.positionY.toFixed(2) +
        ' com o Voo ' + planeB.id + ' na posX ' + planeB.positionX.toFixed(2) + ' e posY ' + planeB.positionY.toFixed(2) + '.'
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
