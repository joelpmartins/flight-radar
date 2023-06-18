var currentInterval;
var planes = [];
var planeId = 1;

var planeTable = document.querySelector('#planeTable tbody');
var planeElements = {};

var startFlightButton = document.querySelector('#startFlightButton');

function createRandomPlane() {
  var plane = {
    id: planeId,
    company: companies[Math.floor(Math.random() * companies.length)],
    radius: Math.random() * (radarRadius - 16) + 16,
    positionX: 0,
    positionY: 0,
    angle: Math.random() * 360,
    speed: Math.random() * (max_speed - min_speed) + min_speed,
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
}

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

function calculateDisplacement(plane) {
  var displacement = (plane.speed / 3600) * (interval / 100);
  var angleRadians = (plane.direction - 90) * (Math.PI / 180);
  var offsetX = Math.cos(angleRadians) * displacement;
  var offsetY = Math.sin(angleRadians) * displacement;
  return { offsetX: offsetX, offsetY: offsetY };
}

function updatePlanePosition(plane, displacement) {
  plane.positionX += displacement.offsetX;
  plane.positionY += displacement.offsetY;
  plane.distanceTraveled += calculateMagnitude(displacement);
  plane.flightTime += calculateFlightTime(displacement, plane.speed);
}

function calculateMagnitude(displacement) {
  return Math.sqrt(Math.pow(displacement.offsetX, 2) + Math.pow(displacement.offsetY, 2));
}

function calculateFlightTime(displacement, speed) {
  return calculateMagnitude(displacement) / speed;
}

function calculateDistance(plane) {
  return Math.sqrt(
    Math.pow(plane.positionX - radarWidth / 2, 2) +
    Math.pow(plane.positionY - radarHeight / 2, 2)
  );
}

function removePlane(plane) {
  var planeElement = planeElements[plane.id];
  planeElement.parentNode.removeChild(planeElement);
  delete planeElements[plane.id];

  var planeIndex = planes.indexOf(plane);
  if (planeIndex > -1) {
    planes.splice(planeIndex, 1);
    removePlaneFromDataGrid(plane.id);
    selectPlane(-1);
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

function getRandomPosition(size, radius) {
  var min = radius;
  var max = size - radius;
  return Math.random() * (max - min) + min;
}

function generatePassengersToPlane(speed) {
  var passengers;
  if (speed < 800) {
    passengers = Math.round(Math.random() * (220 - 2) + 2);
  } else {
    passengers = Math.floor(Math.random() * (516 - 2) + 2);
  }
  return passengers += Math.floor(Math.random() * (20 - 8 + 1) + 8);
}

function updateActivePlanesCount() {
  var activePlanesCount = planes.length;
  var passengersTotalCount = 0;
  var planesElement = document.querySelector('#total-planes');
  var passengersElement = document.querySelector('#total-passengers');
  planesElement.textContent = activePlanesCount;

  for (var i = 0; i < planes.length; i++) {
    passengersTotalCount += planes[i].passengers;
  }
  passengersElement.textContent = passengersTotalCount;
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

function checkPlaneSpeed(speed) {
  if (speed > max_speed) {
    return speed = max_speed;
  } else if (speed < min_speed) {
    return speed = min_speed;
  } else {
    return speed;
  }
}

function convertToCartesian(positionX, positionY) {
  var centerX = radarWidth / 2;
  var centerY = radarHeight / 2;

  var offsetX = positionX - centerX;
  var offsetY = centerY - positionY;

  return { offsetX: offsetX, offsetY: offsetY };
}

function convertToPolar(offsetX, offsetY) {
  var centerX = radarWidth / 2;
  var centerY = radarHeight / 2;
  var positionX = offsetX + centerX;
  var positionY = centerY - offsetY;

  return { positionX: positionX, positionY: positionY };
}

function convertToPolarCoordinates(angle, direction) {
  var convertedAngle = ((angle - 90) % 360 + 360) % 360;
  var convertedDirection = ((direction - 90) % 360 + 360) % 360;
  if (convertedAngle < 0) {
    convertedAngle += 360;
  }
  if (convertedDirection < 0) {
    convertedDirection += 360;
  }

  return { angle: convertedAngle, direction: convertedDirection };
}

function convertAngleDirection(angle, direction) {
  var convertedAngle = ((angle - 90) % 360 + 360) % 360;
  if (direction == 0 || direction == 180) {
    var convertedDirection = ((direction + 90) % 360 + 360) % 360;
  }
  else if (direction == 90 || direction == 270) {
    var convertedDirection = ((direction - 90) % 360 + 360) % 360;
  }
  if (convertedAngle < 0) {
    convertedAngle += 360;
  }
  if (convertedDirection < 0) {
    convertedDirection += 360;
  }

  return { angle: convertedAngle, direction: convertedDirection };
}

function handleSignalLoss(plane) {
  speakMessage('Loss of signal from flight ' + plane.id);

  var currentTime = getCurrentTime();
  var convertedPlanePositions = convertToCartesian(plane.positionX, plane.positionY)

  var notificationMessage =
    '[' + currentTime + '] ' +
    'Sinal perdido: ' + 'Voo ' + plane.id + ' saiu do raio do radar na posX ' + convertedPlanePositions.offsetX.toFixed(2) + ' e posY ' + convertedPlanePositions.offsetY.toFixed(2) + '.';

  showSignalLossIcon(plane);
  playNoSignalAudio();
  sendNotification(notificationMessage);
}

function showSignalLossIcon(plane) {
  var icon = createSignalLossIcon();

  icon.style.position = 'absolute';
  icon.style.left = plane.positionX + 'px';
  icon.style.top = plane.positionY + 'px';

  radar.appendChild(icon);

  setTimeout(function () {
    radar.removeChild(icon);
  }, 8000);
}

function createSignalLossIcon() {
  var svgNS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttributeNS(null, "width", "16");
  svg.setAttributeNS(null, "height", "16");

  var path = document.createElementNS(svgNS, "path");
  path.setAttributeNS(null, "d", "M10.706 3.294A12.545 12.545 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c.63 0 1.249.05 1.852.148l.854-.854zM8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065 8.448 8.448 0 0 1 3.51-1.27L8 6zm2.596 1.404.785-.785c.63.24 1.227.545 1.785.907a.482.482 0 0 1 .063.745.525.525 0 0 1-.652.065 8.462 8.462 0 0 0-1.98-.932zM8 10l.933-.933a6.455 6.455 0 0 1 2.013.637c.285.145.326.524.1.75l-.015.015a.532.532 0 0 1-.611.09A5.478 5.478 0 0 0 8 10zm4.905-4.905.747-.747c.59.3 1.153.645 1.685 1.03a.485.485 0 0 1 .047.737.518.518 0 0 1-.668.05 11.493 11.493 0 0 0-1.811-1.07zM9.02 11.78c.238.14.236.464.04.66l-.707.706a.5.5 0 0 1-.707 0l-.707-.707c-.195-.195-.197-.518.04-.66A1.99 1.99 0 0 1 8 11.5c.374 0 .723.102 1.021.28zm4.355-9.905a.53.53 0 0 1 .75.75l-10.75 10.75a.53.53 0 0 1-.75-.75l10.75-10.75z");
  path.setAttributeNS(null, "fill", "white");

  svg.appendChild(path);
  return svg;
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

  var posX = posXInput.value ? parseFloat(posXInput.value) : getRandomPosition(radarWidth, raio);
  var posY = posYInput.value ? parseFloat(posYInput.value) : getRandomPosition(radarHeight, raio);

  var convertedPlanePositions = convertToPolar(posX, posY);
  var convertedAD = convertAngleDirection(angulo, direcao);

  createCustomPlane(getRandomCompany(), raio, convertedPlanePositions.positionX, convertedPlanePositions.positionY, convertedAD.angle, velocidade, convertedAD.direction);

  posXInput.value = '';
  posYInput.value = '';
  raioInput.value = '';
  anguloInput.value = '';
  velocidadeInput.value = '';
  direcaoInput.value = '';
});

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

currentInterval = setInterval(updatePlanePositions, interval);
