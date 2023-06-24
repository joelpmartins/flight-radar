var godmod = document.getElementById('godmod');
var godmodDiv = document.getElementById('godmod-div');

godmod.addEventListener('click', function () {
    if (godmodDiv.style.display === '' || godmodDiv.style.display === 'none') {
        godmodDiv.style.display = 'block';
        godmod.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-chevron-bar-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0zM4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z"/>
        </svg>`;
    } else {
        godmodDiv.style.display = 'none';
        godmod.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-chevron-bar-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0zM11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>
        </svg>`;
    }
});

function reduceSpeed(plane) {
    var speedReduction = Math.floor(Math.random() * 20) + 1;
    var speedThreshold = 140;

    var speedInterval = setInterval(function () {
        if (plane.speed > speedThreshold) {
            plane.speed -= speedReduction;
            updatePlaneSpeedInDataGrid(plane.id, plane.speed.toFixed(2));
        } else {
            clearInterval(speedInterval);
            plane.speed = speedThreshold;
            updatePlaneSpeedInDataGrid(plane.id, plane.speed.toFixed(2));
            if (plane.speed <= 140) {
                removePlane(plane);
                showSignalLossIcon(plane);
            }
        }

        if (plane.speed <= 0) {
            clearInterval(speedInterval);
            removePlane(plane);
            showSignalLossIcon(plane);
        }
    }, 100);
}

function reduceSpeedAllPlanes() {
    var speedThreshold = 140;

    for (var i = 0; i < planes.length; i++) {
        var plane = planes[i];

        var speedReduction = Math.floor(Math.random() * 20) + 1;

        (function(plane) {
            var speedInterval = setInterval(function () {
                if (plane.speed > speedThreshold) {
                    plane.speed -= speedReduction;
                    updatePlaneSpeedInDataGrid(plane.id, plane.speed.toFixed(2));
                } else {
                    clearInterval(speedInterval);
                    plane.speed = speedThreshold;
                    updatePlaneSpeedInDataGrid(plane.id, plane.speed.toFixed(2));
                    if (plane.speed <= speedThreshold) {
                        removePlane(plane);
                        showSignalLossIcon(plane);
                    }
                }

                if (plane.speed <= 0) {
                    clearInterval(speedInterval);
                    removePlane(plane);
                    showSignalLossIcon(plane);
                }
            }, 100);
        })(plane);
    }
}

function changeDirectionToCenter() {
    var centerX = radarWidth / 2;
    var centerY = radarHeight / 2;

    for (var i = 0; i < planes.length; i++) {
        var plane = planes[i];
        var deltaX = centerX - plane.positionX;
        var deltaY = centerY - plane.positionY;
        var targetDirection = (Math.atan2(deltaY, deltaX) * 180 / Math.PI) + 90;

        if (targetDirection < 0) {
            targetDirection += 360;
        }

        plane.direction = targetDirection;
        var planeElement = document.getElementById('plane-' + plane.id);
        planeElement.style.transform = 'rotate(' + plane.direction + 'deg)';
    }
}

function changeShouldMove() {
    if (shouldMove === false) {
        document.querySelector('#shouldMove-icon').style.fill = 'white';
        shouldMove = true;
    } else {
        document.querySelector('#shouldMove-icon').style.fill = 'red';
        shouldMove = false;
    }
}

function cursorPosition() {
    var posXElement = document.getElementById('posX');
    var posYElement = document.getElementById('posY');
    var raioElement = document.getElementById('raio');
    var anguloElement = document.getElementById('angulo');
    var posXInput = document.getElementById('cd-posX');
    var posYInput = document.getElementById('cd-posY');
    var raioInput = document.getElementById('cd-radius');
    var anguloInput = document.getElementById('cd-angle');
    var velocidadeInput = document.getElementById('cd-speed');
  
    document.querySelector('.cursorPos').style.fill = 'orange';
  
    radar.addEventListener('mousemove', function (event) {
      var rect = radar.getBoundingClientRect();
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var mouseX = event.clientX - rect.left;
      var mouseY = event.clientY - rect.top;
      var offsetX = (mouseX - centerX).toFixed(1);
      var offsetY = (mouseY - centerY).toFixed(1);
  
      posXElement.textContent = "x: " + offsetX;
      posYElement.textContent = "y: " + (-offsetY);
      raioElement.textContent = "r: " + Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)).toFixed(1);
      anguloElement.textContent = "a: " + ((360 - ((Math.atan2(offsetY, offsetX) * 180 / Math.PI) + 360) % 360).toFixed(1)) + "°";

    });
  
    radar.addEventListener('click', function (event) {
      var rect = radar.getBoundingClientRect();
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var mouseX = event.clientX - rect.left;
      var mouseY = event.clientY - rect.top;
      var offsetX = (mouseX - centerX).toFixed(1);
      var offsetY = (mouseY - centerY).toFixed(1);
  
      posXInput.value = offsetX;
      posYInput.value = -offsetY;
      raioInput.value = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)).toFixed(1);
      anguloInput.value = ((360 - ((Math.atan2(offsetY, offsetX) * 180 / Math.PI) + 360) % 360).toFixed(1));
      velocidadeInput.value = (Math.random() * (max_speed - min_speed) + min_speed).toFixed(2);
    });
  }