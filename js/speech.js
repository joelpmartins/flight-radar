var speechOutput = document.getElementById('speechOutput');

function speakMessage(message) {
    // Verifica se a síntese de voz é suportada pelo navegador
    if ('speechSynthesis' in window && window.speechSynthesis) {
        // Cria uma nova instância de SpeechSynthesisUtterance
        var utterance = new SpeechSynthesisUtterance(message);
        // Define a voz que será usada para a síntese de voz
        var voices = window.speechSynthesis.getVoices();
        utterance.voice = voices[0]; // Altere o índice para selecionar a voz desejada
        // Fala a mensagem
        window.speechSynthesis.speak(utterance);
    }
}