const questionEl = document.getElementById("mc-question");
const inputRowEl = document.getElementById("mc-input-row");
const answerEl = document.getElementById("mc-answer");
const submitBtn = document.getElementById("mc-submit");
const continueBtn = document.getElementById("mc-continue");
const feedbackEl = document.getElementById("mc-feedback");
const inventoryList = document.getElementById("mc-inventory-list");

const questions = [
  {
    text: "What is the name of our Minecraft world?",
    type: "input",
    reward: "wood",
    validate: (value) => value.toLowerCase().includes("m"),
  },
  {
    text: "What is the name of the mending villager?",
    type: "input",
    reward: "wood",
    validate: (value) => value.trim().toLowerCase() === "nerd",
  },
  {
    text: "How many beds are in our Minecraft house?",
    type: "input",
    reward: "wood",
    validate: (value) => value.trim() === "4",
  },
  {
    text: "What biomes do slimes spawn in?",
    type: "input",
    reward: "wood",
    validate: (value) => value.trim().toLowerCase() === "swamp",
  },
  {
    text: "How many bees are in the greenhouse?",
    type: "input",
    reward: "wood",
    validate: (value) => value.trim() === "4",
  },
  {
    text: "What is your boyfriend's username?",
    type: "input",
    reward: "wood",
    validate: (value) => value.toLowerCase().includes("j"),
  },
  {
    text: "Give your boyfriend a kiss.",
    type: "auto",
    reward: "wood",
    validate: () => true,
  },
  {
    text: "What block in Minecraft plays music?",
    type: "input",
    reward: "wood",
    validate: (value) => value.trim().toLowerCase() === "jukebox",
  },
  {
    text: "Who is the prettiest girl in the world?",
    type: "input",
    reward: "Diamond",
    validate: (value) => value.toLowerCase().includes("ellie"),
  },
];

let currentIndex = 0;
const inventory = {
  wood: 0,
  diamond: 0,
};

function renderInventory() {
  inventoryList.innerHTML = "";
  if (inventory.wood > 0) {
    const li = document.createElement("li");
    li.textContent = `🪵 Wood x${inventory.wood}`;
    inventoryList.appendChild(li);
  }
  if (inventory.diamond > 0) {
    const li = document.createElement("li");
    li.textContent = `💎 Diamond x${inventory.diamond}`;
    inventoryList.appendChild(li);
  }
}

function addInventoryItem(item) {
  if (item === "wood") {
    inventory.wood += 1;
  } else if (item === "Diamond") {
    inventory.diamond += 1;
  }
  renderInventory();
}

function showFeedback() {
  feedbackEl.hidden = false;
  setTimeout(() => {
    feedbackEl.hidden = true;
  }, 900);
}

function showQuestion() {
  const current = questions[currentIndex];
  questionEl.textContent = current.text;
  feedbackEl.hidden = true;

  if (current.type === "continue") {
    inputRowEl.hidden = true;
    continueBtn.hidden = false;
  } else if (current.type === "auto") {
    inputRowEl.hidden = true;
    continueBtn.hidden = true;
    setTimeout(handleAdvance, 1200);
  } else {
    inputRowEl.hidden = false;
    continueBtn.hidden = true;
    answerEl.value = "";
    answerEl.focus();
  }
}

function handleAdvance() {
  const current = questions[currentIndex];
  addInventoryItem(current.reward);
  showFeedback();

  currentIndex += 1;
  if (currentIndex >= questions.length) {
    inputRowEl.hidden = true;
    continueBtn.hidden = false;
    questionEl.textContent = "All done!";
    return;
  }
  setTimeout(showQuestion, 400);
}

submitBtn.addEventListener("click", () => {
  const current = questions[currentIndex];
  if (!current.validate(answerEl.value)) {
    feedbackEl.textContent = "Try again!";
    feedbackEl.hidden = false;
    return;
  }
  feedbackEl.textContent = "Correct!";
  handleAdvance();
});

answerEl.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  submitBtn.click();
});

continueBtn.addEventListener("click", () => {
  window.location.href = "mc-finish.html";
});

showQuestion();
renderInventory();
