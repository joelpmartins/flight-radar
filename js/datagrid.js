var selectedPlanes = [];

function addPlaneToDataGrid(plane) {
    var newRow = document.createElement('tr');
    newRow.setAttribute('data-plane-id', plane.id);
    newRow.innerHTML = `
      <td>${plane.id}</td>
      <td>${plane.positionX.toFixed(2)}</td>
      <td>${plane.positionY.toFixed(2)}</td>
      <td>${plane.radius.toFixed(2)}</td>
      <td>${plane.angle.toFixed(2)}</td>
      <td>${plane.speed.toFixed(2)}</td>
      <td>${plane.direction.toFixed(2)}</td>
    `;

    newRow.addEventListener('click', function () {
        selectPlane(plane, newRow);
    });

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

function selectPlane(plane, row) {
    var selectedPlaneElement = document.querySelector('#selectedPlane');
    if (selectedPlanes.includes(plane)) {
        row.classList.remove('selected');
        selectedPlanes = selectedPlanes.filter(selected => selected !== plane);
    } else {
        row.classList.add('selected');
        selectedPlanes.push(plane);
    }

    if (selectedPlanes.length > 0) {
        selectedPlaneElement.textContent = selectedPlanes.map(selected => `(${selected.id})`).join(', ');
    } else {
        selectedPlaneElement.textContent = `#`;
    }
}

function updateSelectedPlaneElement() {
    var selectedPlaneElement = document.querySelector('#selectedPlane');
    if (selectedPlanes.length > 0) {
        selectedPlaneElement.textContent = selectedPlanes.map(selected => `(${selected.id})`).join(', ');
    } else {
        selectedPlaneElement.textContent = `#`;
    }
}

var selectedPlaneElement = document.querySelector('#selectedPlane');
selectedPlaneElement.addEventListener('click', function() {
  selectedPlanes = [];
  updateSelectedPlaneElement();
});