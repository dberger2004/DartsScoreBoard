let currentPlayer = 0;
let throwsCount = 0;
let scores = [501, 501];
let legs = [0, 0];
let sets = [0, 0];
let currentMod = 1;
const history = [];
let setsToPlay = 0;
let legsToPlay = 0;
let startingPlayer = 0;

const numButtons = document.querySelectorAll("#number-buttons .number");
const btn0 = document.getElementById("btn-0");
const elPoints1 = document.getElementById("points1");
const elPoints2 = document.getElementById("points2");
const elLegs1 = document.getElementById("legs1");
const elLegs2 = document.getElementById("legs2");
const elSets1 = document.getElementById("sets1");
const elSets2 = document.getElementById("sets2");
const btnDouble = document.getElementById("btn-double");
const btnTriple = document.getElementById("btn-triple");
const btnUndo = document.getElementById("btn-undo");
const headerInputs = document.getElementById("header-inputs");
const headerLabels = document.getElementById("header-labels");
const inpSets = document.getElementById("inp-sets");
const inpLegs = document.getElementById("inp-legs");
const btnStart = document.getElementById("btn-start");
const titleSetsSpan = document.getElementById("title-sets");
const titleLegsSpan = document.getElementById("title-legs");
const btnPlayer1 = document.getElementById("btn-player1");
const btnPlayer2 = document.getElementById("btn-player2");
const overlay = document.getElementById("overlay");
const inputPanel = document.getElementById("input-panel");
const setupPanel = document.getElementById("setup-panel");


overlay.classList.add("hidden");
setupPanel.classList.remove("hidden");
inputPanel.classList.add("hidden");

const throwDarts = (baseValue, mod = currentMod) => {
  history.push({
    player: currentPlayer,
    throwsCount: throwsCount,
    scores: [...scores],
    legs: [...legs],
    sets: [...sets],
    currentMod: currentMod
  });
  // mod setzten
  currentMod = mod;

  //  Punkte berechnen
  const scored = baseValue * mod;
  const prev = scores[currentPlayer];
  const next = prev - scored;

  //  check für Doppelfinish
  if (next === 0 && mod === 2) {
    legs[currentPlayer]++;
    btnDouble.classList.remove("active");
    btnTriple.classList.remove("active");
    if (legs[currentPlayer] === legsToPlay) {
      sets[currentPlayer]++;
      if (sets[currentPlayer] === setsToPlay) {
        alert(`Spieler ${currentPlayer + 1} hat gewonnen!`);
        resetGame();
      } else {
        resetSet();
        return;
      }
    } else {
      resetLeg();
      return;
    }
  }

  // check, ob man überworfen hat
  if (next <= 0 || next === 1) {
    scores[currentPlayer] = prev;
    currentMod = 1;
    btnDouble.classList.remove("active");
    btnTriple.classList.remove("active"); 
    changePlayer();
    updateUI();
    return;
  }

  // erfolgreicher normaler wurf
  scores[currentPlayer] = next;
  throwsCount++;

  // Spielerwechsel nach 3 Würfen
  if (throwsCount >= 3) {
    changePlayer();
  }

  // UI aktualisieren
  updateUI();
  updateThrowIcons();

  currentMod = 1;
  btnDouble.classList.remove("active");
  btnTriple.classList.remove("active");
}

const changePlayer = () => {
  throwsCount = 0;
  currentPlayer = 1 - currentPlayer;
  updateThrowIcons();
}

const resetLeg = () => {
  scores = [501, 501];
  throwsCount = 0;
  currentPlayer = startingPlayer;
  startingPlayer = 1 - startingPlayer;
  updateUI();
  updateThrowIcons();
}

const undo = () => {
  if (!history.length) return;
  const last = history.pop();
  currentPlayer = last.player;
  throwsCount = last.throwsCount;
  scores = last.scores;
  legs = last.legs;
  sets = last.sets;
  currentMod = last.currentMod;
  updateUI();
  updateThrowIcons();
}

const updateUI = () => {
  elPoints1.textContent = scores[0];
  elPoints2.textContent = scores[1];
  elLegs1.textContent = legs[0];
  elLegs2.textContent = legs[1];
  elSets1.textContent = sets[0];
  elSets2.textContent = sets[1];
}

const updateThrowIcons = () => {
  const icons = document.querySelectorAll(".throw-icons .dart");
  icons.forEach((icon, i) => {
    icon.classList.toggle("used", i < throwsCount);
  });
}

const resetGame = () => { 
  currentPlayer = 0;
  throwsCount = 0;
  scores = [501, 501];
  legs = [0, 0];
  sets = [0, 0];
  currentMod = 1;
  history.length = 0;

  inpSets.value = "";
  inpLegs.value = "";

  setupPanel.classList.remove("hidden");
  inputPanel.classList.add("hidden");
  overlay.classList.remove("hidden");

  updateUI();
  updateThrowIcons();
}

const resetSet = () => { 
  legs = [0, 0];
  resetLeg();
}

[...numButtons, btn0].forEach(btn => {
  btn.addEventListener("click", () => {
    const num = +btn.dataset.num || 0;
    throwDarts(num);
  });
});

btnDouble.addEventListener("click", () => {
  const isActive = btnDouble.classList.toggle("active");
  if (isActive) {
    currentMod = 2;
    btnTriple.classList.remove("active");
  } else {
    currentMod = 1;
  }
});

btnTriple.addEventListener("click", () => {
  const isActive = btnTriple.classList.toggle("active");
  if (isActive) {
    currentMod = 3;
    btnDouble.classList.remove("active");
  } else {
    currentMod = 1;
  }
});

btnUndo.addEventListener("click", undo);

btnStart.addEventListener("click", () => {
  setsToPlay = parseInt(inpSets.value, 10) || 0;
  legsToPlay = parseInt(inpLegs.value, 10) || 0;
  titleSetsSpan.textContent = setsToPlay;
  titleLegsSpan.textContent = legsToPlay;
  headerLabels.classList.remove("hidden");
  currentPlayer = startingPlayer;
  setupPanel.classList.add("hidden");
  overlay.classList.remove("hidden");
  inputPanel.classList.remove("hidden");
  updateUI();
});

btnPlayer1.addEventListener('click', () => { 
  const isActive = btnPlayer1.classList.toggle('active');
  if (isActive) {
    startingPlayer = 0;
    btnPlayer2.classList.remove('active');
  }
});

btnPlayer2.addEventListener('click', () => { 
  const isActive = btnPlayer2.classList.toggle('active');
  if (isActive) {
    startingPlayer = 1;
    btnPlayer1.classList.remove('active');
  }
});

updateUI();
updateThrowIcons();