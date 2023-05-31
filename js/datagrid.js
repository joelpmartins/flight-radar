function addPlaneToDataGrid(plane) {
    var newRow = document.createElement('tr');
    newRow.setAttribute('data-plane-id', plane.id);
    newRow.innerHTML = `
      <td>${plane.id}</td>
      <td>${plane.positionX.toFixed(2)}</td>
      <td>${plane.positionY.toFixed(2)}</td>
      <td>${radarRadius.toFixed(2)}</td>
      <td>${plane.angle.toFixed(2)}</td>
      <td>${plane.speed.toFixed(2)}</td>
      <td>${plane.direction.toFixed(2)}</td>
    `;

    document.querySelector('#planeTable tbody').appendChild(newRow);
}

function removePlaneFromDataGrid(planeId) {
    var row = document.querySelector(`#planeTable tbody tr[data-plane-id="${planeId}"]`);
    if (row) {
        row.parentNode.removeChild(row);
    }
    updateActivePlanesCount();
}

function updatePlaneSpeedInDataGrid(planeId, speed) {
    var tableRow = document.querySelector('#planeTable tbody tr[data-plane-id="' + planeId + '"]');
    if (tableRow) {
        tableRow.cells[5].textContent = speed;
    }
}