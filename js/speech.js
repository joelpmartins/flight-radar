var speechOutput = document.getElementById('speechOutput');

function speakMessage(message) {
    if ('speechSynthesis' in window && window.speechSynthesis) {
      var utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }
  
  