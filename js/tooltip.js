function attachTooltipToPlane(planeElement, plane) {
    planeElement.addEventListener('mouseover', function () {
        var tooltip = document.createElement('div');
        tooltip.innerHTML = 'Voo: ' + plane.id + '.' + '<br>' +
            'Companhia: ' + plane.company + '.' + '<br>' +
            'Velocidade: ' + plane.speed.toFixed(2) + ' Km/h' + '.' + '<br>' +
            'Tripulação: ' + plane.passengers + '.' + '<br>' +
            'Tempo de voo: ' + formatTime(plane.flightTime) + '.' + '<br>' +
            'Distância percorrida: ' + plane.distanceTraveled.toFixed(2) + ' Km.';

        tooltip.style.cssText = `min-width: 200px; position: absolute; background-color: black; color: white; padding: 8px; border-radius: 4px; font-size: 12px; margin-top: -5px;`;

        var radarRect = radar.getBoundingClientRect();
        var tooltipTop = planeElement.offsetTop - radar.offsetTop + radarRect.top;
        var tooltipLeft = planeElement.offsetLeft - radar.offsetLeft + radarRect.left;

        tooltip.style.top = tooltipTop + 'px';
        tooltip.style.left = tooltipLeft + 'px';

        if(tooltipEnabled){
            radar.appendChild(tooltip);
        }

        tooltip.addEventListener('mouseout', function () {
            radar.removeChild(tooltip);
        });

        planeElement.style.userSelect = 'none';
    });
}

function toggleTooltip() {
    if (tooltipEnabled) {
        tooltipEnabled = false;
        document.querySelector('#tooltip-icon').style.fill = 'red';
    } else {
        tooltipEnabled = true;
        document.querySelector('#tooltip-icon').style.fill = 'white';
    }
  }
  