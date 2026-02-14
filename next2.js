const statusEl = document.getElementById("coffee-status");
const pourCoffeeBtn = document.getElementById("pour-coffee");
const doneCoffeeBtn = document.getElementById("done-coffee");
const pourMilkBtn = document.getElementById("pour-milk");
const doneMilkBtn = document.getElementById("done-milk");
const coffeeLayout = document.querySelector(".coffee-layout");
const pourControls = document.getElementById("pour-controls");
const heatLaunch = document.getElementById("heat-launch");
const continueBtn = document.getElementById("coffee-continue");
const iceCubes = Array.from(document.querySelectorAll(".ice-cube"));
const heatZone = document.getElementById("heat-zone");
const serveBtn = document.getElementById("serve-coffee");
const cupEl = document.getElementById("cup");
const customerScreen = document.getElementById("customer-screen");
const nextGameBtn = document.getElementById("next-game");

const layers = {
  coffee: document.getElementById("layer-coffee"),
  milk: document.getElementById("layer-milk"),
};

const cupMaxHeight = 180;
const coffeeTarget = 100;
const milkTarget = 100;

let coffeeLevel = 0;
let milkLevel = 0;
let coffeeTemp = 0;
let iceFinished = 0;
let pourInterval = null;

function setStatus(message) {
  if (!statusEl) return;
  statusEl.textContent = message;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function mixColor(colorA, colorB, ratio) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const mix = (start, end) => Math.round(start + (end - start) * ratio);
  return `rgb(${mix(a.r, b.r)}, ${mix(a.g, b.g)}, ${mix(a.b, b.b)})`;
}

function updateCup() {
  const coffeeHeight = (coffeeLevel / 100) * cupMaxHeight;
  const milkHeight = (milkLevel / 100) * cupMaxHeight;
  layers.coffee.style.height = `${coffeeHeight}px`;
  layers.milk.style.height = `${milkHeight}px`;
  layers.milk.style.bottom = `${coffeeHeight}px`;

  const latteRatio = clamp(milkLevel / 100, 0, 1);
  layers.coffee.style.background = mixColor("#6b3b2a", "#c59a72", latteRatio);
}

function finishCheck() {
  if (coffeeLevel >= coffeeTarget &&
      milkLevel >= milkTarget &&
      coffeeTemp >= 100 &&
      true) {
    setStatus("Drink complete! Serve it up.");
    pourCoffeeBtn.disabled = true;
    pourMilkBtn.disabled = true;
    serveBtn.hidden = false;
  }
}

function stopPour() {
  if (pourInterval) {
    clearInterval(pourInterval);
    pourInterval = null;
  }
}

function startPour(type) {
  stopPour();
  const rate = type === "coffee" ? 3 : 3;
  pourInterval = setInterval(() => {
    if (type === "coffee") {
      coffeeLevel = clamp(coffeeLevel + rate, 0, coffeeTarget);
    } else {
      milkLevel = clamp(milkLevel + rate, 0, milkTarget);
    }
    updateCup();
  }, 80);
}

function setupHoldButton(button, onStart) {
  const start = (event) => {
    event.preventDefault();
    if (button.disabled) return;
    onStart();
  };
  const end = () => stopPour();
  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointerleave", end);
  button.addEventListener("pointercancel", end);
}

function resetGame() {
  coffeeLevel = 0;
  milkLevel = 0;
  coffeeTemp = 0;
  stopPour();
  pourCoffeeBtn.disabled = false;
  doneCoffeeBtn.disabled = false;
  pourMilkBtn.disabled = true;
  doneMilkBtn.disabled = true;
  serveBtn.hidden = true;
  coffeeLayout.hidden = false;
  customerScreen.hidden = true;
  nextGameBtn.hidden = true;
  heatZone.hidden = true;
  heatLaunch.hidden = true;
  continueBtn.hidden = true;
  pourControls.hidden = false;
  iceCubes.forEach((cube) => cube.classList.remove("finished"));
  iceFinished = 0;
  setStatus("");
  updateCup();
}

setupHoldButton(pourCoffeeBtn, () => startPour("coffee"));
setupHoldButton(pourMilkBtn, () => startPour("milk"));
doneCoffeeBtn.addEventListener("click", () => {
  if (coffeeLevel <= 0) {
    setStatus("Pour some coffee first.");
    return;
  }
  pourCoffeeBtn.disabled = true;
  doneCoffeeBtn.disabled = true;
  pourMilkBtn.disabled = false;
  doneMilkBtn.disabled = false;
  setStatus("Now pour the milk.");
});

doneMilkBtn.addEventListener("click", () => {
  if (milkLevel <= 0) {
    setStatus("Pour some milk first.");
    return;
  }
  pourMilkBtn.disabled = true;
  doneMilkBtn.disabled = true;
  heatLaunch.hidden = false;
  setStatus("Tap two ice cubes, then continue.");
});

iceCubes.forEach((cube) => {
  cube.addEventListener("click", () => {
    if (cube.classList.contains("finished")) return;
    cube.classList.add("finished");
    iceFinished += 1;
    if (iceFinished >= 2) {
      continueBtn.hidden = false;
      setStatus("Ice ready. Press continue to heat.");
    }
  });
});

continueBtn.addEventListener("click", () => {
  pourControls.hidden = true;
  heatLaunch.hidden = true;
  heatZone.hidden = false;
  coffeeTemp = 100;
  setStatus("Drink heated. Serve it up.");
  finishCheck();
});

serveBtn.addEventListener("click", () => {
  coffeeLayout.hidden = true;
  customerScreen.hidden = false;
  nextGameBtn.hidden = false;
});

resetGame();
