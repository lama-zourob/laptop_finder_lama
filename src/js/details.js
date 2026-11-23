import { loadLaptops } from "./api.js";
import { renderHeader, formatPrice, showMessage } from "./ui.js";
import { isFavorite, toggleFavorite, addCompare } from "./storage.js";

renderHeader();
const box = document.getElementById("details");
const id = Number(new URLSearchParams(location.search).get("id"));

function show(l, message = "") {
  const rows = Object.entries(l)
    .filter(([key]) => key !== "image" && key !== "description")
    .map(([key, value]) => `<tr class="border-t border-line"><th class="p-2 text-left capitalize">${key}</th><td class="p-2">${value}</td></tr>`)
    .join("");

  box.innerHTML = `
    <div class="grid gap-6 md:grid-cols-2">
      <img src="${l.image}" alt="${l.name}" class="w-full rounded-xl bg-card object-cover">
      <div class="flex flex-col gap-3">
        <h1 class="text-3xl font-bold">${l.name}</h1>
        <p class="text-2xl font-bold text-accent">${formatPrice(l.price)}</p>
        <p>${l.description}</p>
        <div class="flex flex-wrap gap-2">
          <button id="fav-btn" class="btn-action">${isFavorite(l.id) ? "★ Remove from favorites" : "☆ Add to favorites"}</button>
          <button id="compare-btn" class="btn-action">Add to comparison</button>
        </div>
        <p class="font-semibold text-accent">${message}</p>
      </div>
    </div>
    <table class="mt-6 w-full overflow-hidden rounded-xl border border-line bg-card">${rows}</table>`;

  document.getElementById("fav-btn").addEventListener("click", () => {
    toggleFavorite(l.id);
    show(l);
  });
  document.getElementById("compare-btn").addEventListener("click", () => {
    if (!isFavorite(l.id)) toggleFavorite(l.id); // compare uses favorites
    show(l, addCompare(l.id) ? "Added to comparison." : "You can compare up to 4 laptops only.");
  });
}

try {
  const laptop = (await loadLaptops()).find((l) => l.id === id);
  if (laptop) show(laptop);
  else showMessage(box, "Laptop not found. Please go back to the catalogue.");
} catch (error) {
  showMessage(box, "Could not load laptop data. Please use a local server.");
}
