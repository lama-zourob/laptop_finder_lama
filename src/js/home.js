import { loadLaptops } from "./api.js";
import { renderHeader, formatPrice } from "./ui.js";
import { getFavorites } from "./storage.js";

renderHeader();
document.getElementById("stat-favs").textContent = getFavorites().length;

try {
  const laptops = await loadLaptops();
  // reduce() calculates the lowest price and the total price
  const lowest = laptops.reduce((min, l) => (l.price < min ? l.price : min), laptops[0].price);
  const total = laptops.reduce((sum, l) => sum + l.price, 0);
  document.getElementById("stat-count").textContent = laptops.length;
  document.getElementById("stat-lowest").textContent = formatPrice(lowest);
  document.getElementById("stat-average").textContent = formatPrice(Math.round(total / laptops.length));
} catch (error) {
  document.getElementById("error").textContent = "Could not load data. Please use a local server.";
}
