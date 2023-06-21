function translatePlane() {
    var plane = selectedPlane;
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

function staggerPlane(){
    var plane = selectedPlane;
    var convertedPlanePositions = convertToCartesian(plane.positionX, plane.positionY);
    var newPosX = convertedPlanePositions.offsetX * (parseFloat(document.getElementById('el-posX').value/100));
    var newPosY = convertedPlanePositions.offsetY * (parseFloat(document.getElementById('el-posY').value/100)); 
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

startFlightButton.addEventListener('click', function () {
    var posXInput = document.querySelector('#cd-posX');
    var posYInput = document.querySelector('#cd-posY');
    var raioInput = document.querySelector('#cd-raio');
    var anguloInput = document.querySelector('#cd-angulo');
    var velocidadeInput = document.querySelector('#cd-velocidade');
    var direcaoInput = document.querySelector('#cd-direcao');

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

function nearbyPlanesAtAirport(){
    var count=0;
    var planeRadius;
    const distance = document.querySelector("#ap-dismin").value;
    for(let i=0; i<planes.length; i++){
        planeRadius = planes[i].radius;
        if(planeRadius <= distance){
            count++; 
        }
    }
    sendNotification(
        '[' + getCurrentTime() + ']' + ' ' +
        'Quantidade de aviões próximo ao aeroporto: ' + count
    );
}

const cd_posX = document.querySelector("#cd-posX");
const cd_posY = document.querySelector("#cd-posY");
const cd_radius = document.querySelector("#cd-raio");
const cd_angle = document.querySelector("#cd-angulo");

cd_posX.addEventListener("input", function() {
    if(cd_posY.value){
        let convertedPlanePositions = convertToPolar(parseFloat(cd_posX.value), parseFloat(cd_posY.value));
        let anguloRad = Math.atan2(convertedPlanePositions.positionY - radarHeight / 2, convertedPlanePositions.positionX - radarWidth / 2);
        let angle = ((anguloRad * 180 / Math.PI + 450) % 360);
        let convertedAD = convertToPolarCoordinates(angle, 0);
        let radius = Math.sqrt(Math.pow(convertedPlanePositions.positionX - radarWidth / 2, 2) + Math.pow(convertedPlanePositions.positionY - radarHeight / 2, 2));
        cd_angle.value = convertedAD.angle.toFixed(2);
        cd_radius.value = radius.toFixed(2);
    }
});

cd_posY.addEventListener("input", function() {
    if(cd_posX.value){
        let convertedPlanePositions = convertToPolar(parseFloat(cd_posX.value), parseFloat(cd_posY.value));
        let anguloRad = Math.atan2(convertedPlanePositions.positionY - radarHeight / 2, convertedPlanePositions.positionX - radarWidth / 2);
        let angle = ((anguloRad * 180 / Math.PI + 450) % 360);
        let convertedAD = convertToPolarCoordinates(angle, 0);
        let radius = Math.sqrt(Math.pow(convertedPlanePositions.positionX - radarWidth / 2, 2) + Math.pow(convertedPlanePositions.positionY - radarHeight / 2, 2));
        cd_angle.value = convertedAD.angle.toFixed(2);
        cd_radius.value = radius.toFixed(2);
    }
});

cd_radius.addEventListener("input", function() {
    if(cd_angle.value){
        let teste = detectPosition(parseFloat(cd_angle.value), parseFloat(cd_radius.value));
        let teste2 = convertToCartesian(teste.posX, teste.posY);
        cd_posX.value = teste2.offsetX.toFixed(2);
        cd_posY.value = teste2.offsetY.toFixed(2);
    }
});

cd_angle.addEventListener("input", function() {
    if(cd_radius.value){
        let teste = detectPosition(parseFloat(cd_angle.value), parseFloat(cd_radius.value));
        let teste2 = convertToCartesian(teste.posX, teste.posY);
        cd_posX.value = teste2.offsetX.toFixed(2);
        cd_posY.value = teste2.offsetY.toFixed(2);
    }
});