// Shared UI helpers used by every page.
import { isFavorite, toggleFavorite, getTheme, setTheme } from "./storage.js";

export const formatPrice = (n) => "$" + n.toLocaleString();

export function showMessage(box, text) {
  box.innerHTML = `<p class="col-span-full rounded-lg border border-line p-6 text-center">${text}</p>`;
}

// One card, reused on the catalogue and favorites pages
export const laptopCard = (l) => `
  <article class="laptop-card">
    <img src="${l.image}" alt="${l.name}" class="h-40 w-full rounded-lg bg-page object-cover">
    <h3 class="font-bold">${l.name}</h3>
    <p class="text-sm text-muted">${l.brand} &middot; ${l.category}</p>
    <p class="text-xl font-bold text-accent">${formatPrice(l.price)}</p>
    <p class="text-sm">${l.cpu} &middot; ${l.ramGB}GB RAM &middot; ${l.storageGB}GB &middot; ${l.batteryHours}h</p>
    <div class="mt-auto flex gap-2">
      <a href="details.html?id=${l.id}" class="btn-action">Details</a>
      <button data-fav="${l.id}" class="btn-action">${isFavorite(l.id) ? "★ Saved" : "☆ Favorite"}</button>
    </div>
  </article>`;

// Skeleton cards with the same shape as real cards
export const skeletonCards = (n = 6) =>
  Array.from({ length: n }, () => `
    <div class="laptop-card animate-pulse">
      <div class="h-40 rounded-lg bg-line"></div>
      <div class="h-4 w-3/4 rounded bg-line"></div>
      <div class="h-4 w-1/2 rounded bg-line"></div>
      <div class="h-6 w-1/3 rounded bg-line"></div>
    </div>`).join("");

export function renderCards(box, list, emptyText = "No laptops found.") {
  if (list.length === 0) return showMessage(box, emptyText);
  box.innerHTML = list.map((l) => laptopCard(l)).join("");
}

// One listener on the container handles every favorite button
export function onFavoriteClick(box, callback) {
  box.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fav]");
    if (!btn) return;
    toggleFavorite(Number(btn.dataset.fav));
    callback();
  });
}

// Builds header + footer, and restores the saved theme
export function renderHeader() {
  const html = document.documentElement;
  html.dataset.theme = getTheme();

  document.getElementById("header").innerHTML = `
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 p-4">
      <a href="index.html" class="text-xl font-bold text-accent">💻 Laptop Finder</a>
      <button id="menu-btn" class="btn-action md:hidden">Menu</button>
      <nav id="menu" class="hidden w-full flex-col gap-2 md:flex md:w-auto md:flex-row md:items-center">
        <a href="index.html" class="hover:text-accent">Home</a>
        <a href="laptops.html" class="hover:text-accent">Laptops</a>
        <a href="favorites.html" class="hover:text-accent">Favorites</a>
        <a href="compare.html" class="hover:text-accent">Compare</a>
        <button id="theme-btn" class="btn-action"></button>
      </nav>
    </div>`;
  document.getElementById("footer").textContent = "Student Laptop Finder - Assignment 2";

  const themeBtn = document.getElementById("theme-btn");
  const label = () => (html.dataset.theme === "battery" ? "Switch to Performance Mode" : "Switch to Battery Saver Mode");
  themeBtn.textContent = label();
  themeBtn.addEventListener("click", () => {
    html.dataset.theme = html.dataset.theme === "battery" ? "performance" : "battery";
    setTheme(html.dataset.theme);
    themeBtn.textContent = label();
  });

  document.getElementById("menu-btn").addEventListener("click", () => {
    const menu = document.getElementById("menu");
    menu.classList.toggle("hidden");
    menu.classList.toggle("flex");
  });
}
