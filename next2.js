const pourCoffeeBtn = document.getElementById("pour-coffee");
const pourMilkBtn = document.getElementById("pour-milk");
const sugarPumpBtn = document.getElementById("pour-sugar");
const coffeeLayout = document.querySelector(".coffee-layout");
const serveBtn = document.getElementById("serve-coffee");
const cupEl = document.getElementById("cup");
const customerScreen = document.getElementById("customer-screen");
const nextGameBtn = document.getElementById("next-game");

const layers = {
  sugar: document.getElementById("layer-sugar"),
  coffee: document.getElementById("layer-coffee"),
  milk: document.getElementById("layer-milk"),
};

const cupMaxHeight = 180;
const coffeeTarget = 100;
const milkTarget = 100;
let coffeeLevel = 0;
let milkLevel = 0;
let sugarLevel = 0;
let pourInterval = null;
const sugarLayerHeight = 20;

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
  const sugarHeight = (sugarLevel / 100) * sugarLayerHeight;
  const coffeeHeight = (coffeeLevel / 100) * cupMaxHeight;
  const milkHeight = (milkLevel / 100) * cupMaxHeight;
  layers.sugar.style.height = `${sugarHeight}px`;
  layers.coffee.style.height = `${coffeeHeight}px`;
  layers.milk.style.height = `${milkHeight}px`;
  layers.coffee.style.bottom = `${sugarHeight}px`;
  layers.milk.style.bottom = `${coffeeHeight + sugarHeight}px`;

  const latteRatio = clamp(milkLevel / 100, 0, 1);
  layers.coffee.style.background = mixColor("#6b3b2a", "#c59a72", latteRatio);
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
    } else if (type === "milk") {
      milkLevel = clamp(milkLevel + rate, 0, milkTarget);
    } else if (type === "sugar") {
      sugarLevel = clamp(sugarLevel + rate, 0, 100);
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
  if (!button) return;
  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointerleave", end);
  button.addEventListener("pointercancel", end);
}

setupHoldButton(pourCoffeeBtn, () => startPour("coffee"));
setupHoldButton(pourMilkBtn, () => startPour("milk"));
setupHoldButton(sugarPumpBtn, () => startPour("sugar"));

function resetGame() {
  serveBtn.hidden = true;
  coffeeLayout.hidden = false;
  customerScreen.hidden = true;
  nextGameBtn.hidden = true;
}

serveBtn.addEventListener("click", () => {
  coffeeLayout.hidden = true;
  customerScreen.hidden = false;
  nextGameBtn.hidden = false;
});


resetGame();
