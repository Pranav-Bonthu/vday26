const gridEl = document.getElementById("mc-grid");
const inventoryEl = document.getElementById("mc-board-inventory");
const feedbackEl = document.getElementById("mc-grid-feedback");
const craftBtn = document.getElementById("mc-craft");
const continueBtn = document.getElementById("mc-continue");

const gridSize = 3;
const centerIndex = 4;

const items = [
  { id: "diamond-1", type: "diamond", label: "💎" },
  { id: "wood-1", type: "wood", label: "🪵" },
  { id: "wood-2", type: "wood", label: "🪵" },
  { id: "wood-3", type: "wood", label: "🪵" },
  { id: "wood-4", type: "wood", label: "🪵" },
  { id: "wood-5", type: "wood", label: "🪵" },
  { id: "wood-6", type: "wood", label: "🪵" },
  { id: "wood-7", type: "wood", label: "🪵" },
  { id: "wood-8", type: "wood", label: "🪵" },
];

const slots = Array.from({ length: gridSize * gridSize }, () => null);

function renderInventory() {
  inventoryEl.innerHTML = "";
  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = `mc-item mc-item-${item.type}`;
    btn.type = "button";
    btn.textContent = item.label;
    btn.setAttribute("draggable", "true");
    btn.dataset.itemId = item.id;
    btn.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", item.id);
      event.dataTransfer.effectAllowed = "move";
    });
    inventoryEl.appendChild(btn);
  });
}

function renderGrid() {
  gridEl.innerHTML = "";
  slots.forEach((slotItem, index) => {
    const cell = document.createElement("div");
    cell.className = "mc-grid-cell";
    cell.dataset.index = String(index);

    if (slotItem) {
      cell.textContent = slotItem.label;
      cell.classList.add(`mc-item-${slotItem.type}`);
    }

    cell.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (!slotItem) {
        event.dataTransfer.dropEffect = "move";
      }
    });

    cell.addEventListener("drop", (event) => {
      event.preventDefault();
      if (slots[index]) return;
      const itemId = event.dataTransfer.getData("text/plain");
      const itemIndex = items.findIndex((entry) => entry.id === itemId);
      if (itemIndex === -1) return;
      const [item] = items.splice(itemIndex, 1);
      slots[index] = item;
      renderInventory();
      renderGrid();
      checkWin();
    });

    gridEl.appendChild(cell);
  });
}

function checkWin() {
  const centerItem = slots[centerIndex];
  const others = slots.filter((_, index) => index !== centerIndex);
  const allFilled = slots.every((slot) => slot !== null);
  if (!allFilled) {
    feedbackEl.hidden = true;
    return false;
  }
  const centerOk = centerItem && centerItem.type === "diamond";
  const othersOk = others.every((slot) => slot && slot.type === "wood");
  const isWin = centerOk && othersOk;
  feedbackEl.hidden = !isWin;
  return isWin;
}

craftBtn.addEventListener("click", () => {
  const crafted = checkWin();
  if (!crafted) {
    feedbackEl.hidden = false;
    feedbackEl.textContent = "Not quite yet!";
    continueBtn.hidden = true;
    return;
  }
  if (!items.some((item) => item.type === "jukebox")) {
    items.push({ id: "jukebox-1", type: "jukebox", label: "📻" });
    renderInventory();
  }
  continueBtn.hidden = false;
  feedbackEl.textContent = "You crafted a Jukebox!";
});

continueBtn.hidden = true;
renderInventory();
renderGrid();
