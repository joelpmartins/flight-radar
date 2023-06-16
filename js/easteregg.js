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