import { loadLaptops } from "./api.js";
import { renderHeader, renderCards, showMessage, skeletonCards, onFavoriteClick } from "./ui.js";

renderHeader();
const box = document.getElementById("cards");
const get = (id) => document.getElementById(id);
let laptops = [];

// Applies search + filters + sorting together, then draws the cards
function update() {
  const text = get("search").value.toLowerCase().trim();
  const maxPrice = Number(get("max-price").value) || Infinity;
  const minRam = Number(get("min-ram").value) || 0;

  const filtered = laptops.filter((l) =>
    (l.name.toLowerCase().includes(text) || l.brand.toLowerCase().includes(text)) &&
    (get("category").value === "all" || l.category === get("category").value) &&
    l.price <= maxPrice &&
    l.ramGB >= minRam
  );

  const list = [...filtered]; // sort a copy
  const [key, direction] = get("sort").value.split("-");
  if (direction) list.sort((a, b) => (direction === "asc" ? a[key] - b[key] : b[key] - a[key]));

  get("count").textContent = `${list.length} laptops found`;
  renderCards(box, list, "No laptop matches your search.");
}

async function start() {
  box.innerHTML = skeletonCards();
  try {
    laptops = await loadLaptops();
    update();
  } catch (error) {
    showMessage(box, "Could not load laptops. Please run the site with a local server.");
  }
}

get("filters").addEventListener("input", update);
onFavoriteClick(box, update);
start();
