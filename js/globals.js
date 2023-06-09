const companies = ['ByteFly', 'DjanGol', 'EnumExpress', 'FloaTravels', 'GoToAir', 'LambdAirlines', 'NullPilots', 'StackOverfly', 'Tailwind CSSkies', 'Vue Voyager', 'XamarinXpress'];
const min_speed = 200; // Velocidade mínima dos aviões em km/h
const max_speed = 1200; // Velocidade máxima dos aviões em km/h

var interval = 1000; // Tempo está em milissegundos para atualização dos aviões
var shouldMove = false; // Controla o status de movimentação dos aviões
var tooltipEnabled = true; // Controla o status do tooltip dos aviões
var totalAccidents = 0; // Total de acidentes registrados
var totalMissingPassengers = 0; // Total de passageiros desaparecidos

var radar = document.getElementById('radar');
var radarWidth = radar.offsetWidth;
var radarHeight = radar.offsetHeight;
var radarRadius = Math.min(radarWidth, radarHeight) / 2;