function changeInterval() {
    var timeValueElement = document.getElementById('time-value');
    if (interval === 1000) {
        interval = 100;
        timeValueElement.textContent = '100ms';
        clearInterval(currentInterval);
    } else {
        interval = 1000;
        timeValueElement.textContent = '1s';
        clearInterval(currentInterval);
    }
    currentInterval = setInterval(updatePlanePositions, interval);
}