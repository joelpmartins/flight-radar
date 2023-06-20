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