function formatTime(time) {
    var hours = Math.floor(time);
    var minutes = Math.floor((time % 1) * 60);
    var seconds = Math.floor(((time % 1) * 60 % 1) * 60);

    return hours + 'h ' + minutes + 'm ' + seconds + 's';
}

function formatDate(date, format) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    format = format.replace(/DD/g, day < 10 ? '0' + day : day);
    format = format.replace(/MM/g, month < 10 ? '0' + month : month);
    format = format.replace(/YYYY/g, year);
    format = format.replace(/HH/g, hour < 10 ? '0' + hour : hour);
    format = format.replace(/mm/g, minute < 10 ? '0' + minute : minute);
    format = format.replace(/ss/g, second < 10 ? '0' + second : second);

    return format;
}

function getCurrentTime() {
    var dataAtual = new Date();
    var hora = dataAtual.getHours();
    var minutos = dataAtual.getMinutes();
    var segundos = dataAtual.getSeconds();

    // Formatação dos valores
    hora = hora < 10 ? "0" + hora : hora;
    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;

    var horarioFormatado = hora + ":" + minutos + ":" + segundos;
    return horarioFormatado;
}