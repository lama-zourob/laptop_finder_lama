// Loads all laptops from the JSON file. Errors are handled by the caller.
export async function loadLaptops() {
  const response = await fetch("data/laptops.json");
  if (!response.ok) throw new Error("Could not load laptops");
  return await response.json();
}
