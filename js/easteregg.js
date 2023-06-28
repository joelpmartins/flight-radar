function createEasterEgg() {
    var plane = {
        id: planeId,
        company: "???",
        radius: Math.random() * (radarRadius - 16) + 16,
        positionX: 0,
        positionY: 0,
        angle: Math.random() * 360,
        speed: Math.random() * (5000 - 3000) + 3000,
        direction: Math.random() * 360,
        passengers: 0,
        flightTime: 0,
        distanceTraveled: 0
    };

    var convertedPlanePositions = convertToPolar(plane.positionX, plane.positionY);
    plane.positionX = convertedPlanePositions.positionX;
    plane.positionY = convertedPlanePositions.positionY;

    var isOutsideRadar = true;
    var attempts = 0;
    var maxAttempts = 100;

    while (isOutsideRadar && attempts < maxAttempts) {
        plane.positionX = getRandomPosition(radarWidth, plane.radius);
        plane.positionY = getRandomPosition(radarHeight, plane.radius);

        var distance = Math.sqrt(
            Math.pow(plane.positionX - radarWidth / 2, 2) +
            Math.pow(plane.positionY - radarHeight / 2, 2)
        );

        if (distance <= radarRadius) {
            isOutsideRadar = false;
        }

        attempts++;
    }

    if (isOutsideRadar) {
    } else {
      planes.push(plane);
      speakMessage('Unidentified flying object detected, all aircraft on high alert.');
  
      var planeElement = createPlaneElement(plane);
      planeElements[plane.id] = planeElement;
  
      updatePlaneElement(plane, planeElement);
      radar.appendChild(planeElement);
  
      addPlaneToDataGrid(plane);
      updateActivePlanesCount();
  
      attachTooltipToPlane(planeElement, plane);
  
      planeElement.addEventListener('click', function() {
        reduceSpeed(plane);
      });
  
      planeId++;
    }
}





function aumentar() {
  changePlaneSize(1.2); // Aumenta o tamanho em 20% (fator de escala 1.2)
}

function diminuir() {
  changePlaneSize(0.8); // Diminui o tamanho em 20% (fator de escala 0.8)
}

function changePlaneSize(scaleFactor) {
  for (var i = 0; i < planes.length; i++) {
    var plane = planes[i];
    var planeElement = planeElements[plane.id];

    var currentWidth = planeElement.offsetWidth;
    var currentHeight = planeElement.offsetHeight;

    var newWidth = currentWidth * scaleFactor;
    var newHeight = currentHeight * scaleFactor;

    var widthDiff = newWidth - currentWidth;
    var heightDiff = newHeight - currentHeight;

    var currentLeft = parseFloat(planeElement.style.left);
    var currentTop = parseFloat(planeElement.style.top);

    var centerX = currentLeft + currentWidth / 2;
    var centerY = currentTop + currentHeight / 2;

    planeElement.style.width = newWidth + 'px';
    planeElement.style.height = newHeight + 'px';

    var newLeft = centerX - newWidth / 2;
    var newTop = centerY - newHeight / 2;

    planeElement.style.left = newLeft + 'px';
    planeElement.style.top = newTop + 'px';
  }
}


