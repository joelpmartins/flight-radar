function translatePlane() {
    for (var i = 0; i < selectedPlanes.length; i++) {
        var plane = selectedPlanes[i];
        var posX = parseFloat(plane.positionX) + parseFloat(document.getElementById('tl-posX').value);
        var posY = parseFloat(plane.positionY) + parseFloat(document.getElementById('tl-posY').value);
        var angle = Math.atan2(posY - radarHeight / 2, posX - radarWidth / 2) * (180 / Math.PI);
        var radius = Math.sqrt(Math.pow(posX - radarWidth / 2, 2) + Math.pow(posY - radarHeight / 2, 2));

        plane.positionX = parseFloat(posX);
        plane.positionY = parseFloat(posY);
        plane.angle = angle;
        plane.radius = radius;

        planeElements[plane.id].style.left = plane.positionX + 'px';
        planeElements[plane.id].style.top = plane.positionY + 'px';
        planeElements[plane.id].style.transform = 'rotate(' + plane.direction + 'deg)';

        updatePlaneData(plane, planes.indexOf(plane));
    }
}

function staggerPlane() {
    for (var i = 0; i < selectedPlanes.length; i++) {
        var plane = selectedPlanes[i];
        var convertedPlanePositions = convertToCartesian(plane.positionX, plane.positionY);
        var newPosX = convertedPlanePositions.offsetX * (parseFloat(document.getElementById('el-posX').value / 100));
        var newPosY = convertedPlanePositions.offsetY * (parseFloat(document.getElementById('el-posY').value / 100));
        var PlanePositionsUpdated = convertToPolar(newPosX, newPosY);
        var angle = Math.atan2(posY - radarHeight / 2, posX - radarWidth / 2) * (180 / Math.PI);
        var radius = Math.sqrt(Math.pow(posX - radarWidth / 2, 2) + Math.pow(posY - radarHeight / 2, 2));

        plane.positionX = PlanePositionsUpdated.positionX;
        plane.positionY = PlanePositionsUpdated.positionY;
        plane.angle = angle;
        plane.radius = radius;

        planeElements[plane.id].style.left = plane.positionX + 'px';
        planeElements[plane.id].style.top = plane.positionY + 'px';
        planeElements[plane.id].style.transform = 'rotate(' + plane.direction + 'deg)';
        updatePlaneData(plane, planes.indexOf(plane));
    }
}

function rotatePlane() {
    for (var i = 0; i < selectedPlanes.length; i++) {
        var plane = selectedPlanes[i];
        var axisX = parseFloat(document.getElementById('rt-posX').value);
        var axisY = parseFloat(document.getElementById('rt-posY').value);
        var polarCoords = convertToPolar(axisX, axisY);
        var angleRotation = parseFloat(document.getElementById('rt-angle').value);

        var angleRadians = angleRotation * Math.PI / 180;
        var newX = polarCoords.positionX + Math.cos(angleRadians) * (plane.positionX - polarCoords.positionX) + Math.sin(angleRadians) * (plane.positionY - polarCoords.positionY); // Inverter o sinal do termo seno
        var newY = polarCoords.positionY - Math.sin(angleRadians) * (plane.positionX - polarCoords.positionX) + Math.cos(angleRadians) * (plane.positionY - polarCoords.positionY); // Inverter o sinal do termo seno
        plane.angle += angleRotation;
        plane.positionX = newX;
        plane.positionY = newY;
        planeElements[plane.id].style.left = newX + 'px';
        planeElements[plane.id].style.top = newY + 'px';
        updatePlaneData(plane, planes.indexOf(plane));
    }
}

function calculatePlaneDistances() {
    var distanceMinima = document.querySelector("#rt-dismin").value;

    for (var i = 0; i < planes.length - 1; i++) {
        var plane1 = planes[i];

        for (var j = i + 1; j < planes.length; j++) {
            var plane2 = planes[j];
            var distance = calculateDistanceBetweenPlanes(plane1, plane2);

            if (distance < distanceMinima) {
                clearNotifications();
                sendNotification('[' + getCurrentTime() + ']' + ' ' + 'Aviões próximos: ' + plane1.id + '-' + plane2.id + ' (' + distance.toFixed(2) + ' km)');
            }else{
                clearNotifications();
                sendNotification('[' + getCurrentTime() + ']' + ' Nenhum avião está próximo ao outro na distância de: ' + distanceMinima + ' km');
            }
        }
    }
}

function nearbyPlanesAtAirport() {
    var count = 0;
    var planeRadius;
    const distance = document.querySelector("#ap-dismin").value;
    for (let i = 0; i < planes.length; i++) {
        planeRadius = planes[i].radius;
        if (planeRadius <= distance) {
            count++;
        }
    }
    clearNotifications();
    sendNotification('[' + getCurrentTime() + ']' + ' ' + 'Quantidade de aviões próximo ao aeroporto: ' + count);
}

startFlightButton.addEventListener('click', function () {
    var posXInput = document.querySelector('#cd-posX');
    var posYInput = document.querySelector('#cd-posY');
    var raioInput = document.querySelector('#cd-radius');
    var anguloInput = document.querySelector('#cd-angle');
    var velocidadeInput = document.querySelector('#cd-speed');
    var direcaoInput = document.querySelector('#cd-direction');

    const planePosition = document.getElementById('center-rotation');
    planePosition.style.display = 'none';

    var raio = parseFloat(raioInput.value);
    var angulo = parseFloat(anguloInput.value);
    var velocidade = parseFloat(velocidadeInput.value);
    var direcao = parseFloat(direcaoInput.value);

    if (isNaN(raio) || isNaN(angulo) || isNaN(velocidade) || isNaN(direcao)) return;

    var posX = parseFloat(posXInput.value);
    var posY = parseFloat(posYInput.value);

    var convertedPlanePositions = convertToPolar(posX, posY);
    var convertedAD = convertToPolarCoordinates(angulo, direcao);

    createCustomPlane(getRandomCompany(), raio, convertedPlanePositions.positionX, convertedPlanePositions.positionY, convertedAD.angle, velocidade, convertedAD.direction);

    posXInput.value = '';
    posYInput.value = '';
    raioInput.value = '';
    anguloInput.value = '';
    velocidadeInput.value = '';
    direcaoInput.value = '';
});

const cd_posX = document.querySelector("#cd-posX");
const cd_posY = document.querySelector("#cd-posY");
const cd_radius = document.querySelector("#cd-radius");
const cd_angle = document.querySelector("#cd-angle");
const rt_button = document.getElementById('rt-button');

startFlightButton.addEventListener('mouseover', () => {
    let x = parseFloat(cd_posX.value);
    let y = parseFloat(cd_posY.value);

    if(!isNaN(x) && !isNaN(y)){
        let newXY = convertToPolar(x, y);
        const planePosition = document.getElementById('center-rotation');

        planePosition.style.display = 'block';
        planePosition.style.left = (radar.offsetLeft + 15 + newXY.positionX) + 'px';
        planePosition.style.top = (radar.offsetTop + 15 + newXY.positionY) + 'px';
    }
});

startFlightButton.addEventListener('mouseout', () => {
    const planePosition = document.getElementById('center-rotation');
    planePosition.style.display = 'none';
});

cd_posX.addEventListener("input", function () {
    if (cd_posY.value) {
        let convertedPlanePositions = convertToPolar(parseFloat(cd_posX.value), parseFloat(cd_posY.value));
        let anguloRad = Math.atan2(convertedPlanePositions.positionY - radarHeight / 2, convertedPlanePositions.positionX - radarWidth / 2);
        let angle = ((anguloRad * 180 / Math.PI + 450) % 360);
        let convertedAD = convertToPolarCoordinates(angle, 0);
        let radius = Math.sqrt(Math.pow(convertedPlanePositions.positionX - radarWidth / 2, 2) + Math.pow(convertedPlanePositions.positionY - radarHeight / 2, 2));
        cd_angle.value = convertedAD.angle.toFixed(2);
        cd_radius.value = radius.toFixed(2);
    }
});

cd_posY.addEventListener("input", function () {
    if (cd_posX.value) {
        let convertedPlanePositions = convertToPolar(parseFloat(cd_posX.value), parseFloat(cd_posY.value));
        let anguloRad = Math.atan2(convertedPlanePositions.positionY - radarHeight / 2, convertedPlanePositions.positionX - radarWidth / 2);
        let angle = ((anguloRad * 180 / Math.PI + 450) % 360);
        let convertedAD = convertToPolarCoordinates(angle, 0);
        let radius = Math.sqrt(Math.pow(convertedPlanePositions.positionX - radarWidth / 2, 2) + Math.pow(convertedPlanePositions.positionY - radarHeight / 2, 2));
        cd_angle.value = convertedAD.angle.toFixed(2);
        cd_radius.value = radius.toFixed(2);
    }
});

cd_radius.addEventListener("input", function () {
    if (cd_angle.value) {
        let teste = detectPosition(parseFloat(cd_angle.value), parseFloat(cd_radius.value));
        let teste2 = convertToCartesian(teste.posX, teste.posY);
        cd_posX.value = teste2.offsetX.toFixed(2);
        cd_posY.value = teste2.offsetY.toFixed(2);
    }
});

cd_angle.addEventListener("input", function () {
    if (cd_radius.value) {
        let teste = detectPosition(parseFloat(cd_angle.value), parseFloat(cd_radius.value));
        let teste2 = convertToCartesian(teste.posX, teste.posY);
        cd_posX.value = teste2.offsetX.toFixed(2);
        cd_posY.value = teste2.offsetY.toFixed(2);
    }
});

rt_button.addEventListener('mouseover', () => {
    let x = parseFloat(document.getElementById('rt-posX').value);
    let y = parseFloat(document.getElementById('rt-posY').value);

    if(!isNaN(x) && !isNaN(y)){
        let axisXY = convertToPolar(x, y);
        const center_rotation = document.getElementById('center-rotation');

        center_rotation.style.display = 'block';
        center_rotation.style.left = (radar.offsetLeft + 15 + axisXY.positionX) + 'px';
        center_rotation.style.top = (radar.offsetTop + 15 + axisXY.positionY) + 'px';
    }
});

rt_button.addEventListener('mouseout', () => {
    const center_rotation = document.getElementById('center-rotation');
    center_rotation.style.display = 'none';
});