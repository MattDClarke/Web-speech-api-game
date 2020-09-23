// dont need .js because using parcel
import {
  wordsEl,
  timerEl,
  buttonStart,
  scoreEl,
  buttonScores,
  modalOuter,
  buttonClose,
  startCountdownEl,
} from './lib/elements';
import { wordsByLength } from './data/words';
import {
  startGame,
  handleScoresButtonClick,
  restoreFromLocalStorage,
  TIME,
} from './lib/handlers';

function displayWords(words) {
  return words.map(word => `<span class="${word}">${word}</span>`).join('');
}

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
function start() {
  if (!('SpeechRecognition' in window)) {
    // console.log('Sorry your browser does not support Web Speech API speech recognition. Try using Chrome.');
    startCountdownEl.style.fontSize = '20px';
    startCountdownEl.innerHTML =
      'Sorry, your browser does not support speech recognition.';
    return;
  }
  // it does work
  console.log('Starting...');
  // set score and time to zero
  scoreEl.innerHTML = 0;
  timerEl.innerHTML = TIME;
}
start();

buttonStart.addEventListener('click', startGame);
buttonScores.addEventListener('click', handleScoresButtonClick);
restoreFromLocalStorage();

function closeModal() {
  modalOuter.classList.remove('open');
}

modalOuter.addEventListener('click', function(event) {
  const isOutside = !event.target.closest('.modal-inner');
  if (isOutside) {
    closeModal();
  }
});

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

buttonClose.addEventListener('click', closeModal);

wordsEl.innerHTML = displayWords(wordsByLength);
