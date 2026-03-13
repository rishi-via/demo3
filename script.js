const knowledgeBase = [
  {
    name: "dog",
    traits: {
      living: true,
      animal: true,
      pet: true,
      electronic: false,
      vehicle: false,
      kitchen: false,
      furniture: false,
      handheld: false,
      largerThanBreadbox: false,
      madeOfMetal: false,
      canFly: false,
      foundIndoors: true,
      foundOutdoors: true,
      usesElectricity: false,
      edible: false,
    },
  },
  {
    name: "car",
    traits: {
      living: false,
      animal: false,
      pet: false,
      electronic: true,
      vehicle: true,
      kitchen: false,
      furniture: false,
      handheld: false,
      largerThanBreadbox: true,
      madeOfMetal: true,
      canFly: false,
      foundIndoors: false,
      foundOutdoors: true,
      usesElectricity: true,
      edible: false,
    },
  },
  {
    name: "banana",
    traits: {
      living: false,
      animal: false,
      pet: false,
      electronic: false,
      vehicle: false,
      kitchen: true,
      furniture: false,
      handheld: true,
      largerThanBreadbox: false,
      madeOfMetal: false,
      canFly: false,
      foundIndoors: true,
      foundOutdoors: false,
      usesElectricity: false,
      edible: true,
    },
  },
  {
    name: "chair",
    traits: {
      living: false,
      animal: false,
      pet: false,
      electronic: false,
      vehicle: false,
      kitchen: false,
      furniture: true,
      handheld: false,
      largerThanBreadbox: true,
      madeOfMetal: false,
      canFly: false,
      foundIndoors: true,
      foundOutdoors: false,
      usesElectricity: false,
      edible: false,
    },
  },
  {
    name: "laptop",
    traits: {
      living: false,
      animal: false,
      pet: false,
      electronic: true,
      vehicle: false,
      kitchen: false,
      furniture: false,
      handheld: true,
      largerThanBreadbox: false,
      madeOfMetal: true,
      canFly: false,
      foundIndoors: true,
      foundOutdoors: false,
      usesElectricity: true,
      edible: false,
    },
  },
  {
    name: "airplane",
    traits: {
      living: false,
      animal: false,
      pet: false,
      electronic: true,
      vehicle: true,
      kitchen: false,
      furniture: false,
      handheld: false,
      largerThanBreadbox: true,
      madeOfMetal: true,
      canFly: true,
      foundIndoors: false,
      foundOutdoors: true,
      usesElectricity: true,
      edible: false,
    },
  },
];

const questions = [
  { key: "living", text: "Is it a living thing?" },
  { key: "animal", text: "Is it an animal?" },
  { key: "pet", text: "Could it be a household pet?" },
  { key: "vehicle", text: "Is it a type of vehicle?" },
  { key: "electronic", text: "Is it an electronic object?" },
  { key: "usesElectricity", text: "Does it use electricity?" },
  { key: "kitchen", text: "Is it usually found in a kitchen?" },
  { key: "furniture", text: "Is it a type of furniture?" },
  { key: "edible", text: "Is it edible?" },
  { key: "canFly", text: "Can it fly?" },
  { key: "madeOfMetal", text: "Is it mostly made of metal?" },
  { key: "handheld", text: "Can you hold it in one hand?" },
  { key: "largerThanBreadbox", text: "Is it larger than a breadbox?" },
  { key: "foundIndoors", text: "Is it usually found indoors?" },
  { key: "foundOutdoors", text: "Is it usually found outdoors?" },
];

const maxQuestions = 20;

const questionCountEl = document.getElementById("question-count");
const questionTextEl = document.getElementById("question-text");
const answerButtons = document.querySelectorAll("#answer-buttons button");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const guessPanel = document.getElementById("guess-panel");
const guessText = document.getElementById("guess-text");
const guessCorrectBtn = document.getElementById("guess-correct");
const guessWrongBtn = document.getElementById("guess-wrong");

let state;

function createState() {
  return {
    started: false,
    currentQuestionIndex: 0,
    askedCount: 0,
    answers: {},
    candidates: [...knowledgeBase],
    pendingGuess: null,
    completed: false,
  };
}

function setAnswerButtonsEnabled(enabled) {
  answerButtons.forEach((btn) => {
    btn.disabled = !enabled;
  });
}

function renderQuestion() {
  if (!state.started) {
    questionTextEl.textContent = "Press Start game when you're ready.";
    questionCountEl.textContent = `Question 0 / ${maxQuestions}`;
    setAnswerButtonsEnabled(false);
    return;
  }

  if (state.completed) {
    setAnswerButtonsEnabled(false);
    return;
  }

  if (state.currentQuestionIndex >= questions.length || state.askedCount >= maxQuestions) {
    makeFinalGuess();
    return;
  }

  const q = questions[state.currentQuestionIndex];
  questionCountEl.textContent = `Question ${state.askedCount + 1} / ${maxQuestions}`;
  questionTextEl.textContent = q.text;
  setAnswerButtonsEnabled(true);
}

function filterCandidates(questionKey, answer) {
  if (answer === "unknown" || answer === "maybe") {
    return;
  }

  const expected = answer === "yes";
  state.candidates = state.candidates.filter((candidate) => candidate.traits[questionKey] === expected);
}

function getBestCandidate() {
  if (state.candidates.length > 0) {
    return state.candidates[0];
  }

  let best = null;
  let bestScore = -Infinity;

  for (const obj of knowledgeBase) {
    let score = 0;
    for (const [k, answer] of Object.entries(state.answers)) {
      if (answer === "unknown") continue;
      const trait = obj.traits[k];
      if (answer === "yes" && trait === true) score += 1;
      if (answer === "no" && trait === false) score += 1;
      if (answer === "maybe") score += 0.25;
    }
    if (score > bestScore) {
      bestScore = score;
      best = obj;
    }
  }

  return best;
}

function makeFinalGuess() {
  setAnswerButtonsEnabled(false);
  const candidate = getBestCandidate();
  state.pendingGuess = candidate;
  guessPanel.classList.remove("hidden");

  if (candidate) {
    guessText.textContent = `My guess is: ${candidate.name}. Am I right?`;
    statusEl.textContent = "I have enough information to make a guess.";
  } else {
    guessText.textContent = "I couldn't determine it. Want to reset and try again?";
    guessCorrectBtn.disabled = true;
    guessWrongBtn.textContent = "Reset";
    statusEl.textContent = "No confident guess available.";
  }
}

function finishGame(message) {
  state.completed = true;
  setAnswerButtonsEnabled(false);
  statusEl.textContent = message;
}

function handleAnswer(answer) {
  if (!state.started || state.completed) return;

  const q = questions[state.currentQuestionIndex];
  state.answers[q.key] = answer;
  filterCandidates(q.key, answer);
  state.askedCount += 1;
  state.currentQuestionIndex += 1;

  if (state.candidates.length === 1 || state.askedCount >= maxQuestions || state.currentQuestionIndex >= questions.length) {
    makeFinalGuess();
  } else {
    renderQuestion();
  }
}

function startGame() {
  state = createState();
  state.started = true;
  guessPanel.classList.add("hidden");
  guessCorrectBtn.disabled = false;
  guessWrongBtn.textContent = "Nope, keep trying";
  statusEl.textContent = "Game started. Answer each question.";
  renderQuestion();
}

function resetGame() {
  state = createState();
  guessPanel.classList.add("hidden");
  guessCorrectBtn.disabled = false;
  guessWrongBtn.textContent = "Nope, keep trying";
  statusEl.textContent = "Game reset.";
  renderQuestion();
}

answerButtons.forEach((btn) => {
  btn.addEventListener("click", () => handleAnswer(btn.dataset.answer));
});

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

guessCorrectBtn.addEventListener("click", () => {
  finishGame("Nice! I guessed it.");
});

guessWrongBtn.addEventListener("click", () => {
  if (guessWrongBtn.textContent === "Reset") {
    resetGame();
    return;
  }
  finishGame("Good game! I couldn't get it this time. Press Reset to try again.");
});

resetGame();
