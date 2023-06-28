var planePath = [];

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

//*******************************************************************************/

function checkPossibleCollision(planeA, planeB, time) {
    let collisionDetected = false;
    for (let i = 0; i < planeA.positions.length; i++) {
        for (let j = 0; j < planeB.positions.length; j++) {
            if(parseInt(planeA.positions[i].x) == parseInt(planeB.positions[j].x) && parseInt(planeA.positions[i].y) == parseInt(planeB.positions[j].y)) {
                let differentTime = Math.abs(planeA.positions[i].t - planeB.positions[j].t);
                if(differentTime < time){
                    /*código experimental*/

                   

                    /* final */
                    let collisionPointX = (parseInt(planeA.positions[i].x) + parseInt(planeB.positions[j].x)) / 2;
                    let collisionPointY = (parseInt(planeA.positions[i].y) + parseInt(planeB.positions[j].y)) / 2;
    
                    let collisionPoints = convertToCartesian(collisionPointX, collisionPointY);
    
                    sendNotification('[' + getCurrentTime() + '] ' +
                        'Rota de colisão detectada: ' + 'Voo ' + planeA.id + ' (' + planeA.positions[i].t.toFixed(1) + 's)' + ' e o voo ' + planeB.id + ' (' + planeB.positions[j].t.toFixed(1) + 's)' +
                        ' em rota de colisão na posX: ' + collisionPoints.offsetX + ' e posY: ' + collisionPoints.offsetY);
    
                    createCollisionIcon(collisionPointX, collisionPointY);
    
                    collisionDetected = true;
                    break;
                }
            }
        }
        if (collisionDetected) {
            break;
        }
    }
}

function checkCollisionAtTime(time) {
    for (let i = 1; i < planePath.length; i++) {
        let planeA = planePath[i];

        if(planeA==undefined) continue;

        for (let j = i + 1; j < planePath.length; j++) {
            let planeB = planePath[j];

            if(planeB==undefined) continue;

            checkPossibleCollision(planeA, planeB, time);

            let startPointA = planeA.positions[0];
            let endPointA = planeA.positions[planeA.positions.length - 1];
            let startPointB = planeB.positions[0];
            let endPointB = planeB.positions[planeB.positions.length - 1];

            drawLine(startPointA.x, startPointA.y, endPointA.x, endPointA.y);
            drawLine(startPointB.x, startPointB.y, endPointB.x, endPointB.y);
        }
    }
}

function checkRouteCollision(time) {
    for (let i = 0; i < planes.length; i++) {
        var plane = planes[i];
        planePathFinder(plane, 4000);
    }
    checkCollisionAtTime(time);
}

function drawLine(x1, y1, x2, y2) {
    let canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.top = radar.offsetTop + 15 + 'px';
    canvas.style.left = radar.offsetLeft + 15 + 'px';
    canvas.width = radar.offsetWidth;
    canvas.height = radar.offsetHeight;

    let context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = 'grey';
    context.lineWidth = 0.5;
    context.opacity = 0.3;
    context.setLineDash([2, 2]);
    context.stroke();

    setTimeout(function () {
        document.body.removeChild(canvas);
    }, 8000);
}

const btn_collisionRoute = document.getElementById("btn-collisionRoute");
btn_collisionRoute.addEventListener("click", () => {
    let time = parseInt(document.getElementById("rt-tempmin").value);
    minCollisionTime = time;
    checkRouteCollision(time);
});


