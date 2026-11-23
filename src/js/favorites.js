import { loadLaptops } from "./api.js";
import { renderHeader, renderCards, showMessage, formatPrice, onFavoriteClick } from "./ui.js";
import { getFavorites, clearFavorites } from "./storage.js";

renderHeader();
const box = document.getElementById("cards");
let laptops = [];

function render() {
  const ids = getFavorites();
  const list = laptops.filter((l) => ids.includes(l.id));
  // reduce() gives the total price of saved laptops
  const total = list.reduce((sum, l) => sum + l.price, 0);
  const average = list.length ? Math.round(total / list.length) : 0;
  document.getElementById("summary").textContent =
    `${list.length} saved | Total: ${formatPrice(total)} | Average: ${formatPrice(average)}`;
  renderCards(box, list, "You have no favorites yet.");
}

try {
  laptops = await loadLaptops();
  render();
} catch (error) {
  showMessage(box, "Could not load laptops. Please use a local server.");
}

onFavoriteClick(box, render);
document.getElementById("clear").addEventListener("click", () => {
  clearFavorites();
  render();
});
