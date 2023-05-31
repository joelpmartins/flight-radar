var speechOutput = document.getElementById('speechOutput');

function speakMessage(message) {
    // Verifica se a síntese de voz é suportada pelo navegador
    if ('speechSynthesis' in window && window.speechSynthesis) {
      // Cria uma nova instância de SpeechSynthesisUtterance
      var utterance = new SpeechSynthesisUtterance(message);
      // Define a linguagem da voz
      utterance.lang = 'en-US'; // Defina o idioma desejado
      // Fala a mensagem
      window.speechSynthesis.speak(utterance);
    }
  }
  
  