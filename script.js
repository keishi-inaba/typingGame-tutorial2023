const RAMDOM_SENTENCE_URL_API = "http://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");


/**
 * inputのテキストがあっているかの判定
 */
typeInput.addEventListener("input", () => {

  // タイプ音をつける
  typeSound.play();
  typeSound.cuurentTime = 0;

  const sentenceArray = typeDisplay.querySelectorAll("span");
  // console.log(sentenceArray);
  const arrayValue = typeInput.value.split("");
  // console.log(arrayValue);

  let correct = true;

  sentenceArray.forEach((characterSpan, index) => {
    if((arrayValue[index]) == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if(characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");

      wrongSound.value = 0.5;
      wrongSound.play();
      wrongSound.currentTime = 0;

      correct = false;
    }
  });
  if(correct == true) {
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }
});

/**
 * 非同期処理でランダムな文章を取得する
 */
function GetRandomSentence() {
  return fetch(RAMDOM_SENTENCE_URL_API)
  .then((response) => response.json())
  .then((data) => data.content);
}

/**
 * ランダムな文章を取得して表示する
 */
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  console.log(sentence);

  typeDisplay.innerText = "";

  // 文章を1文字ずつチェックする
  let textes = sentence.split("");

  textes.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    // console.log(characterSpan);
    typeDisplay.appendChild(characterSpan);
    // characterSpan.classList.add("correct");
  });

  // テキストボックスの中身を消す
  typeInput.value = "";

  StartTimer();
}

let startTime;
let originTime = 30;
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date();
  // console.log(startTime);
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if(timer.innerText <= 0) TimeUp();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp() {
  RenderNextSentence();
}

RenderNextSentence();
