// Everything saved in localStorage: favorites, compare list, theme.
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getFavorites = () => read("favorites", []);
export const isFavorite = (id) => getFavorites().includes(id);
export const getCompare = () => read("compare", []);

export function toggleFavorite(id) {
  const favs = isFavorite(id) ? getFavorites().filter((x) => x !== id) : [...getFavorites(), id];
  write("favorites", favs);
  // a laptop that is no longer a favorite cannot stay in the comparison
  write("compare", getCompare().filter((x) => favs.includes(x)));
}

export function clearFavorites() {
  write("favorites", []);
  write("compare", []);
}

// Returns false when 4 laptops are already selected
export function addCompare(id) {
  const list = getCompare();
  if (list.includes(id)) return true;
  if (list.length >= 4) return false;
  write("compare", [...list, id]);
  return true;
}
export const removeCompare = (id) => write("compare", getCompare().filter((x) => x !== id));

export const getTheme = () => read("theme", "performance");
export const setTheme = (theme) => write("theme", theme);
