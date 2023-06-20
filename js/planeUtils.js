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
    var convertedAngle = ((90 - ((angle + 360) % 360) + 360) % 360);
    var convertedDirection = ((90 - ((direction + 360) % 360) + 360) % 360);
    return { angle: convertedAngle, direction: convertedDirection };
}

function getRandomPosition(size, radius) {
    var min = radius;
    var max = size - radius;
    return Math.random() * (max - min) + min;
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

