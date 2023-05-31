var collisionPoints = [];

function createCollisionIcons() {
    var radar = document.getElementById('radar');

    for (var i = 0; i < collisionPoints.length; i++) {
        var collisionPoint = collisionPoints[i];
        var collisionId = 'collision-' + i; // ID único para cada ícone de colisão

        var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        icon.setAttribute('width', '16');
        icon.setAttribute('height', '16');
        icon.setAttribute('fill', 'red');
        icon.setAttribute('class', 'bi bi-bullseye');
        icon.setAttribute('viewBox', '0 0 16 16');
        icon.setAttribute('id', collisionId); // Define o ID para o ícone de colisão

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z');
        icon.appendChild(path);

        var newIcon = icon.cloneNode(true);
        newIcon.style.position = 'absolute';
        newIcon.style.left = collisionPoint.x + 'px';
        newIcon.style.top = collisionPoint.y + 'px';

        radar.appendChild(newIcon);
    }
}

function removeCollisionPoints() {
    var collisionIcons = document.querySelectorAll('[id^="collision-point-"]');
    collisionIcons.forEach(function (icon) {
        icon.parentNode.removeChild(icon);
    });
}

function checkCollision() {
    var collisionDistance = 16; // Distância mínima para considerar uma colisão (pode ser ajustada conforme necessário)
    var collisionTimeThreshold = 3; // Limite de tempo para considerar uma colisão (em segundos)
    for (var i = 0; i < planes.length; i++) {
        var planeA = planes[i];
        for (var j = i + 1; j < planes.length; j++) {
            var planeB = planes[j];
            // Calcula a distância entre os aviões usando a fórmula de distância entre dois pontos
            var distance = Math.sqrt(
                Math.pow(planeA.positionX - planeB.positionX, 2) +
                Math.pow(planeA.positionY - planeB.positionY, 2)
            );
            // Calcula a velocidade relativa dos aviões
            var relativeSpeed = Math.abs(planeA.speed - planeB.speed);
            // Calcula o tempo estimado para colisão
            var timeToCollision = distance / relativeSpeed;
            if (distance < collisionDistance && timeToCollision < collisionTimeThreshold) {
                // Remove os aviões em rota de colisão
                removePlane(planeA);
                removePlane(planeB);
                // Adicione os pontos de colisão à variável collisionPoints
                collisionPoints.push({ x: planeA.positionX, y: planeA.positionY });
                collisionPoints.push({ x: planeB.positionX, y: planeB.positionY });

                totalAccidents += 2;
                totalMissingPassengers = totalMissingPassengers + planeA.passengers + planeB.passengers;

                var accidentsElement = document.querySelector('#accidents');
                var missingPassengersElement = document.querySelector('#missing-passengers');
                accidentsElement.textContent = totalAccidents;
                missingPassengersElement.textContent = totalMissingPassengers;

                // Crie e posicione os ícones de colisão
                createCollisionIcons();
                // Voz reproduz alerta de colisão
                speakMessage('Collision recorded between Flights ' + planeA.id + ' and ' + planeB.id);
                // Envia notificação sobre os aviões colididos
                sendNotification(
                    '[' + getCurrentTime() + ']' + ' ' +
                    'Colisão detectada: ' +
                    'Voo ' + planeA.id + ' na posX ' + planeA.positionX.toFixed(2) + ' e posY ' + planeA.positionY.toFixed(2) +
                    ' com o Voo ' + planeB.id + ' na posX ' + planeB.positionX.toFixed(2) + ' e posY ' + planeB.positionY.toFixed(2) + '.'
                );

                // Encerra o loop para evitar colisões duplicadas
                return;
            }
        }
    }
}
