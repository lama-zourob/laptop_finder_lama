import { loadLaptops } from "./api.js";
import { renderHeader, showMessage } from "./ui.js";
import { compareTable } from "./compare.js";
import { getFavorites, getCompare, addCompare, removeCompare } from "./storage.js";

renderHeader();
const choices = document.getElementById("choices");
const table = document.getElementById("table");
const msg = document.getElementById("msg");

function showTable(favorites) {
  const chosen = favorites.filter((l) => getCompare().includes(l.id));
  if (chosen.length < 2) return showMessage(table, "Select at least 2 laptops to compare.");
  table.innerHTML = compareTable(chosen);
}

try {
  const laptops = await loadLaptops();
  const favorites = laptops.filter((l) => getFavorites().includes(l.id));

  if (favorites.length === 0) {
    showMessage(choices, "No favorites yet. Add some laptops first.");
  } else {
    choices.innerHTML = favorites.map((l) => `
      <label class="laptop-card flex-row items-center gap-2">
        <input type="checkbox" data-id="${l.id}" class="text-accent" ${getCompare().includes(l.id) ? "checked" : ""}>
        ${l.name}
      </label>`).join("");
  }
  showTable(favorites);

  choices.addEventListener("change", (e) => {
    const laptopId = Number(e.target.dataset.id);
    msg.textContent = "";
    if (e.target.checked) {
      if (!addCompare(laptopId)) { // fifth laptop is blocked
        e.target.checked = false;
        msg.textContent = "You can compare up to 4 laptops only.";
      }
    } else {
      removeCompare(laptopId);
    }
    showTable(favorites);
  });
} catch (error) {
  showMessage(choices, "Could not load laptops. Please use a local server.");
}
