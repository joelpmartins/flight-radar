function formatTime(time) {
    var hours = Math.floor(time);
    var minutes = Math.floor((time % 1) * 60);
    var seconds = Math.floor(((time % 1) * 60 % 1) * 60);

    return hours + 'h ' + minutes + 'm ' + seconds + 's';
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