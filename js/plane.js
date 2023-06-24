var currentInterval;
var planes = [];
var planeId = 1;

var planeTable = document.querySelector('#planeTable tbody');
var planeElements = {};

var startFlightButton = document.querySelector('#startFlightButton');

function createCustomPlane(company, radius, positionX, positionY, angle, speed, direction) {
  var plane = {
    id: planeId,
    company: company,
    radius: radius,
    positionX: positionX,
    positionY: positionY,
    angle: angle,
    speed: speed,
    direction: direction,
    passengers: 0,
    flightTime: 0,
    distanceTraveled: 0
  };

  plane.speed = checkPlaneSpeed(plane.speed);

  plane.passengers = generatePassengersToPlane(plane.speed);

  planes.push(plane);

  var planeElement = createPlaneElement(plane);
  planeElements[plane.id] = planeElement;

  updatePlaneElement(plane, planeElement);
  radar.appendChild(planeElement);

  addPlaneToDataGrid(plane);
  updateActivePlanesCount();

  attachTooltipToPlane(planeElement, plane);

  planeElement.addEventListener('click', function () {
    reduceSpeed(plane);
  });

  planeId++;
}

function updatePlanePositions() {
  for (var i = 0; i < planes.length; i++) {
    var plane = planes[i];
    var displacement = calculateDisplacement(plane);

    if (shouldMove) {
      updatePlanePosition(plane, displacement);
    }

    isSelectedPlane(plane, planeElements[plane.id]);

    var distance = calculateDistance(plane);
    var anguloRad = Math.atan2(plane.positionY - radarHeight / 2, plane.positionX - radarWidth / 2);
    var angle = ((anguloRad * 180 / Math.PI + 450) % 360);
    plane.angle = angle;
    if (distance > radarRadius) {
      if (shouldMove) {
        removePlane(plane);
        handleSignalLoss(plane);
        i--;
      }
    } else {
      updatePlaneElement(plane, planeElements[plane.id]);
      updatePlaneData(plane, i);
    }
  }
  checkCollision();
}

function updatePlanePosition(plane, displacement) {
  plane.positionX += displacement.offsetX;
  plane.positionY += displacement.offsetY;
  plane.distanceTraveled += calculateMagnitude(displacement);
  plane.flightTime += calculateFlightTime(displacement, plane.speed);
}

function removePlane(plane) {
  var planeElement = planeElements[plane.id];
  planeElement.parentNode.removeChild(planeElement);
  delete planeElements[plane.id];

  var planeIndex = planes.indexOf(plane);
  if (planeIndex > -1) {
    planes.splice(planeIndex, 1);
    removePlaneFromDataGrid(plane.id);

    for (var i = 0; i < selectedPlanes.length; i++) {
      if (selectedPlanes[i].id === plane.id) {
        selectedPlanes.splice(i, 1);
        updateSelectedPlaneElement();
        break;
      }
    }
  }
}

function updatePlaneElement(plane, element) {
  if (shouldMove) {
    element.style.left = plane.positionX + 'px';
    element.style.top = plane.positionY + 'px';
  }
  element.style.transform = 'rotate(' + plane.direction + 'deg)';
}

function updatePlaneData(plane, index) {
  var tableRow = planeTable.rows[index];
  var cartesianPosition = convertToCartesian(plane.positionX, plane.positionY);
  var convertedAD = convertToPolarCoordinates(plane.angle, plane.direction);
  if (tableRow) {
    tableRow.cells[1].textContent = cartesianPosition.offsetX.toFixed(2);
    tableRow.cells[2].textContent = cartesianPosition.offsetY.toFixed(2);
    tableRow.cells[3].textContent = calculateDistance(plane).toFixed(2);
    tableRow.cells[4].textContent = convertedAD.angle.toFixed(2);
    tableRow.cells[5].textContent = plane.speed.toFixed(2);
    tableRow.cells[6].textContent = convertedAD.direction.toFixed(2);
  } else {
    addPlaneToDataGrid(plane);
  }
}

function createPlaneElement(plane) {
  var planeElement = document.createElement('div');
  planeElement.className = 'plane';
  planeElement.id = 'plane-' + plane.id;
  planeElement.style.zIndex = '9998';
  if (plane.speed < 800) {
    planeElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-airplane-fill" viewBox="0 0 16 16">
        <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z"/>
      </svg>`;
  } else if (plane.speed > 799 && plane.speed < 1201) {
    planeElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-airplane-engines-fill" viewBox="0 0 16 16">
        <path d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0Z"/>
      </svg>`;
  } else {
    planeElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <circle cx="256" cy="256" r="200" fill="#b0b0b0" />
        <circle cx="256" cy="256" r="160" fill="#d8d8d8" />
        <circle cx="256" cy="256" r="120" fill="#f5f5f5" />
        <polygon points="256 120 320 352 256 288 192 352" fill="#eaeaea" />
        <circle cx="256" cy="256" r="80" fill="#ffffff" />
        <circle cx="256" cy="256" r="40" fill="#f3f3f3" />
      </svg>`;
  }

  planeElement.style.left = plane.positionX + 'px';
  planeElement.style.top = plane.positionY + 'px';
  planeElement.style.transformOrigin = 'center center';
  planeElement.style.transform = 'rotate(' + plane.direction + 'deg)';

  radar.appendChild(planeElement);

  return planeElement;
}

currentInterval = setInterval(updatePlanePositions, interval);
