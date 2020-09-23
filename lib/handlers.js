import {
  startCountdownEl,
  timerEl,
  scoreEl,
  buttonStart,
  wordsEl,
  scoresList,
  modalOuter,
  buttonScores,
  gameInfo,
  timeLeft,
} from './elements';

import { isValidWord } from '../data/words';
import { asyncMap, wait } from './util';
import { questions } from '../data/questions';
import { ask } from './lib';

let wordMatchCount = 0;
export const TIME = 30;
let timerCount = TIME;
let scores = [];

export function handleResult({ results }) {
  // get last child of results..
  const words = results[results.length - 1][0].transcript;
  // lowercase everything
  let word = words.toLowerCase();
  // strip spaces
  word = word.replace(/\s/g, '');
  console.log(word);
  // check if it is a valid word (from the difficult to pronounce list)
  if (!isValidWord(word)) return;
  // if it is then show the matching word in the UI
  const wordSpan = document.querySelector(`.${word}`);
  // count each word match once - check if "got" class present
  if (!wordSpan.classList.contains('got')) {
    wordMatchCount += 1;
    const score = document.querySelector('.score');
    score.innerHTML = wordMatchCount;
    wordSpan.classList.add('got');
  }
}

function mirrorToLocalStorage() {
  console.info('saving items to local storage');
  // convert object to string first
  localStorage.setItem('scores', JSON.stringify(scores));
}

function removeClass() {
  const got = Array.from(wordsEl.querySelectorAll('.got'));
  got.forEach(word => word.classList.remove('got'));
}

export async function startGame() {
  buttonStart.disabled = true;
  buttonScores.disabled = true;
  // reset scores
  wordMatchCount = 0;
  timerCount = TIME;
  scoreEl.innerHTML = 0;
  timerEl.innerHTML = TIME;

  // Make a new speech recogn
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  // event listener
  recognition.onresult = handleResult;

  startCountdownEl.innerHTML = 3;
  await wait(1000);
  startCountdownEl.innerHTML = 2;
  await wait(1000);
  startCountdownEl.innerHTML = 1;
  await wait(1000);
  startCountdownEl.innerHTML = 'go!';
  recognition.start();
  gameInfo.style.opacity = '1';
  await wait(500);
  startCountdownEl.innerHTML = '';
  function countDown() {
    timerCount -= 1;
    // change color to red when time is almost up
    if (timerCount === 5) {
      timeLeft.style.color = 'red';
      timeLeft.style.fontWeight = '900';
    }
    timerEl.innerHTML = timerCount;
  }

  const timer = setInterval(countDown, 1000);
  setTimeout(endTimer, TIME * 1000);

  async function endTimer() {
    clearInterval(timer);
    recognition.stop();
    startCountdownEl.innerHTML = 'Times up!';
    buttonStart.disabled = false;
    buttonScores.disabled = false;
    document.querySelector('body').style.background = '';
    const name = await asyncMap(questions, ask);
    startCountdownEl.innerHTML = '';
    gameInfo.style.opacity = '0';
    timeLeft.style.color = '#2e2e2e';
    // if cancel button clicked, leave function
    if (name == '') {
      scoreEl.innerHTML = 0;
      timerEl.innerHTML = TIME;
      removeClass();
      return;
    }
    // add score and user input to object and store in local storage
    const score = {
      name,
      value: wordMatchCount,
      id: Date.now(),
    };
    scores.push(score);
    scoresList.dispatchEvent(new CustomEvent('scoresListUpdated'));
    mirrorToLocalStorage();
    // display high scores pop up
    await wait(1100);
    handleScoresButtonClick();
    scoreEl.innerHTML = 0;
    timerEl.innerHTML = TIME;
    startCountdownEl.innerHTML = '';
    // remove .got from word matches in previous game
    removeClass();
  }
}

export function displayItems() {
  // sort scores from highest to lowest
  // sort by value
  if (scores.length === 0) {
    scoresList.innerHTML = `<li>No Scores</li>`;
  } else {
    const scoresByRank = scores.sort(function(a, b) {
      return b.value - a.value;
    });
    const html = scoresByRank
      .map(
        score => `<li class="high-score-item"><span>${score.name}</span><span>${
          score.value
        }</span>
      <button 
        class="delete-score-btn"
        aria-label="Remove score for ${score.name}"
        value="${score.id}"
      >&times;</button></li>`
      )
      .join('');

    const deleteAllbtn = `<button 
        class="delete-all-scores-btn"
        aria-label="Remove all scores"
      >Delete All</button>`;
    scoresList.innerHTML = html + deleteAllbtn;
  }
}

export function handleScoresButtonClick() {
  displayItems();
  // show modal
  modalOuter.classList.add('open');
}

export function restoreFromLocalStorage() {
  // pull the items from LS
  // convert string to object
  const lsItems = JSON.parse(localStorage.getItem('scores'));
  if (!lsItems) return;
  if (lsItems.length) {
    // update items...
    scores = lsItems;
    scoresList.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  // update our items array without this one
  scores = scores.filter(score => score.id !== id);
  mirrorToLocalStorage();
  // display new updated list, without the deleted item and save to local storage
  scoresList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function deleteAll() {
  scores = [];
  mirrorToLocalStorage();
  scoresList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

scoresList.addEventListener('click', async function(e) {
  // target is thing that clicked, currentTarget is the thing that ur listening on (ul (list))
  // event delegation -> listen for click on list ul but then delegate the click over to the btn if that was clicked
  const id = parseInt(e.target.value);
  if (e.target.matches('.delete-score-btn')) {
    // convert id to number... pulled out as string here...
    deleteItem(id);
    await wait(50);
    displayItems();
  }
  if (e.target.matches('.delete-all-scores-btn')) {
    deleteAll();
    await wait(50);
    displayItems();
  }
});
