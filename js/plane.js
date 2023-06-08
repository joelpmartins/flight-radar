var planes = [];
var planeId = 1;

var interval = 1000;
var currentInterval;

const min_speed = 200;
const max_speed = 1200;

const companies = [ // Nomes fictícios
  'ByteFly',
  'DjanGol',
  'EnumExpress',
  'FloaTravels',
  'GoToAir',
  'LambdAirlines',
  'NullPilots',
  'StackOverfly',
  'Tailwind CSSkies',
  'Vue Voyager',
  'XamarinXpress'
];

var radar = document.getElementById('radar');
var radarWidth = radar.offsetWidth;
var radarHeight = radar.offsetHeight;
var radarRadius = Math.min(radarWidth, radarHeight) / 2;

var totalAccidents = 0;
var totalMissingPassengers = 0;

var shouldMove = false; // Variável para controlar o movimento dos aviões

function createPlane() {
  var plane = {
    id: planeId,
    company: companies[Math.floor(Math.random() * companies.length)], // Nome da empresa aleatório
    positionX: Math.random() * (radarWidth - 32) + 16, // Posição X aleatória dentro do radar
    positionY: Math.random() * (radarHeight - 32) + 16, // Posição Y aleatória dentro do radar
    angle: Math.random() * 360, // Ângulo inicial aleatório
    radius: Math.random() * (radarRadius - 16) + 16,
    speed: Math.random() * (max_speed - min_speed) + min_speed,
    direction: Math.random() * 360, // Direção aleatória em graus (0 a 359)
    passengers: 0,
    flightTime: 0,
    distanceTraveled: 0
  };

  if (plane.speed < 800) {
    plane.passengers = Math.round(Math.random() * (220 - 2) + 2);
  } else {
    plane.passengers = Math.floor(Math.random() * (516 - 2) + 2);
  }

  plane.passengers+=Math.floor(Math.random() * (20 - 8 + 1) + 8); // Acrescentar a quantidade de funcionários;

  planes.push(plane);

  var planeElement = document.createElement('div');
  planeElement.className = 'plane';
  planeElement.id = 'plane-' + plane.id;
  if (plane.speed < 800) {
    planeElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-airplane-fill" viewBox="0 0 16 16">
        <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z"/>
      </svg>`;
  } else {
    planeElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-airplane-engines-fill" viewBox="0 0 16 16">
        <path d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0Z"/>
      </svg>`;
  }

  planeElement.style.left = plane.positionX + 'px';
  planeElement.style.top = plane.positionY + 'px';
  planeElement.style.transformOrigin = 'center center';
  planeElement.style.transform = 'rotate(' + plane.direction + 'deg)';

  radar.appendChild(planeElement);

  // Calcula a distância do avião em relação ao centro do radar
  var distanceToCenter = Math.sqrt(
    Math.pow(plane.positionX - radarWidth / 2, 2) +
    Math.pow(plane.positionY - radarHeight / 2, 2)
  );

  addPlaneToDataGrid(plane);
  updateActivePlanesCount();

  planeId++;

  // Adicione o evento 'mouseover' ao elemento do avião recém-criado
  planeElement.addEventListener('mouseover', function () {
    var radar = document.getElementById('radar');
    // Cria o elemento do tooltip
    var tooltip = document.createElement('div');
    
    // Define o conteúdo do tooltip
    tooltip.innerHTML = 'Voo: ' + plane.id + '.' + '<br>' +
      'Companhia: ' + plane.company + '.' + '<br>' +
      'Velocidade: ' + plane.speed.toFixed(2) + ' Km/h' + '.' + '<br>' +
      'Tripulação: ' + plane.passengers + '.' + '<br>' +
      'Tempo de voo: ' + formatTime(plane.flightTime) + '.' + '<br>' +
      'Distância percorrida: ' + plane.distanceTraveled.toFixed(2) + ' Km.';
    
    // Aplica o estilo CSS diretamente ao tooltip
    tooltip.style.cssText = `
      min-width: 200px;
      position: absolute;
      background-color: black;
      color: white;
      padding: 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-top: -5px;
    `;
    
    // Ajusta as coordenadas do tooltip em relação ao radar
    var radarRect = radar.getBoundingClientRect();
    var tooltipTop = planeElement.offsetTop - radar.offsetTop + radarRect.top;
    var tooltipLeft = planeElement.offsetLeft - radar.offsetLeft + radarRect.left;
    tooltip.style.top = tooltipTop + 'px';
    tooltip.style.left = tooltipLeft + 'px';
  
    // Adiciona o tooltip ao corpo do documento
    radar.appendChild(tooltip);
  
    // Remove o tooltip quando o mouse sair do elemento
    tooltip.addEventListener('mouseout', function () {
      radar.removeChild(tooltip);
    });
  
    planeElement.style.userSelect = 'none';
  });
  
  planeElement.addEventListener('click', function() {
    reduceSpeed(plane);
  });
}

function updatePlanePositions() {
  var radar = document.getElementById('radar');
  var radarWidth = radar.offsetWidth;
  var radarHeight = radar.offsetHeight;
  var radarRadius = Math.min(radarWidth, radarHeight) / 2;

  for (var i = 0; i < planes.length; i++) {
    var plane = planes[i];

    // Calcula o deslocamento do avião com base na velocidade e na direção
    var displacement = (plane.speed / 3600) * (interval / 100);

    var angleRadians = (plane.direction - 90) * (Math.PI / 180);
    var offsetX = Math.cos(angleRadians) * displacement;
    var offsetY = Math.sin(angleRadians) * displacement;

    // Atualiza a posição do avião apenas se shouldMove for true
    if (shouldMove) {
      // Atualiza a posição do avião
      plane.positionX += offsetX;
      plane.positionY += offsetY;

      // Calcula a distância percorrida
      plane.distanceTraveled += displacement;

      // Calcula o tempo de voo
      plane.flightTime += displacement / plane.speed;
    }
    
    // Calcula a distância do avião em relação ao centro do radar
    var distance = Math.sqrt(
      Math.pow(plane.positionX - radarWidth / 2, 2) +
      Math.pow(plane.positionY - radarHeight / 2, 2)
    );

    // Verifica se o avião está fora do alcance do radar e remove-o
    if (distance > radarRadius) {
      var planeElement = document.getElementById('plane-' + plane.id);
      planeElement.parentNode.removeChild(planeElement);
      planes.splice(i, 1);
      removePlaneFromDataGrid(plane.id);

      let audio = document.getElementById('nosignal');
      audio.play();

      speakMessage('Loss of signal from flight ' + plane.id);

      // Envia notificação sobre os aviões colididos
      sendNotification(
        '[' + getCurrentTime() + ']' + ' ' +
        'Sinal perdido: ' + 'Voo ' + plane.id + ' saiu do raio do radar na posX ' + plane.positionX.toFixed(2) + ' e posY ' + plane.positionY.toFixed(2) + '.'
      );
      i--;
    } else {
      // Atualiza a posição do avião
      var planeElement = document.getElementById('plane-' + plane.id);
      if (shouldMove) {
        planeElement.style.left = plane.positionX + 'px';
        planeElement.style.top = plane.positionY + 'px';
    
        planeElement.style.transform = 'rotate(' + plane.direction + 'deg)';
      }

      // Atualiza os valores do avião na tabela ou adiciona uma nova linha no datagrid
      var tableRow = document.querySelector('#planeTable tbody tr:nth-child(' + (i + 1) + ')');
      if (tableRow) {
        tableRow.cells[1].textContent = plane.positionX.toFixed(2);
        tableRow.cells[2].textContent = plane.positionY.toFixed(2);
        tableRow.cells[3].textContent = radarRadius.toFixed(2);
        tableRow.cells[4].textContent = plane.angle.toFixed(2);
        tableRow.cells[5].textContent = plane.speed.toFixed(2);
        tableRow.cells[6].textContent = plane.direction.toFixed(2);
      } else {
        addPlaneToDataGrid(plane);
      }
    }
  }
  checkCollision();
}

function removePlane(plane) {
  var planeElement = document.getElementById('plane-' + plane.id);
  planeElement.parentNode.removeChild(planeElement);

  var planeIndex = planes.indexOf(plane);
  if (planeIndex > -1) {
    planes.splice(planeIndex, 1);
    removePlaneFromDataGrid(plane.id);
  }
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

function changeInterval() {
  var timeValueElement = document.getElementById('time-value');
  if (interval === 1000) {
    interval = 100;
    timeValueElement.textContent = '1x';
    clearInterval(currentInterval);
  } else {
    interval = 1000;
    timeValueElement.textContent = '10x';
    clearInterval(currentInterval);
  }
  currentInterval = setInterval(updatePlanePositions, interval);
}

// Função para atualizar as posições dos aviões a cada intervalo de tempo (1 segundo)
setInterval(updatePlanePositions, interval);
