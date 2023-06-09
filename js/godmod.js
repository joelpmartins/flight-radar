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

function updatePlaneSpeedToMax() {
    for (var i = 0; i < planes.length; i++) {
        var plane = planes[i];
        plane.speed = max_speed;
        updatePlaneSpeedInDataGrid(plane.id, plane.speed.toFixed(2));
    }
}

function reduceSpeed(plane) {
    var speedReduction = Math.floor(Math.random() * 20) + 1; // Velocidade de redução em km/h
    var speedThreshold = 140; // Velocidade mínima desejada em km/h

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
                crashPlane(plane);
            }
        }

        if (plane.speed <= 0) {
            clearInterval(speedInterval);
            removePlane(plane);
            crashPlane(plane);
        }
    }, 100); // Intervalo de 100ms para redução gradual

    function crashPlane(plane) {

    }
}

function changeDirectionToCenter() {
    var centerX = radarWidth / 2;
    var centerY = radarHeight / 2;

    for (var i = 0; i < planes.length; i++) {
        var plane = planes[i];

        // Calcula a direção para o centro do radar
        var deltaX = centerX - plane.positionX;
        var deltaY = centerY - plane.positionY;
        var targetDirection = (Math.atan2(deltaY, deltaX) * 180 / Math.PI) + 90;

        // Atualiza a direção do avião
        plane.direction = targetDirection;

        // Atualiza a rotação do elemento do avião
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

    document.querySelector('.cursorPos').style.fill = 'orange';

    radar.addEventListener('mousemove', function (event) {
        var rect = radar.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;
        var raio = Math.sqrt(Math.pow(mouseX - rect.width / 2, 2) + Math.pow(mouseY - rect.height / 2, 2));

        posXElement.textContent = "x: " + mouseX.toFixed(1);
        posYElement.textContent = "y: " + mouseY.toFixed(1);
        raioElement.textContent = "r: " + raio.toFixed(1);
    });
}