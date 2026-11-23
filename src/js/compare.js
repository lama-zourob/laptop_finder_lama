// Comparison logic: which rows to show and which value is best.
export const rows = [
  { label: "Price ($)", key: "price", best: "min" },
  { label: "RAM (GB)", key: "ramGB", best: "max" },
  { label: "Storage (GB)", key: "storageGB", best: "max" },
  { label: "Battery (hours)", key: "batteryHours", best: "max" },
  { label: "Weight (kg)", key: "weightKg", best: "min" },
  { label: "Screen (inches)", key: "screenInches", best: null },
  { label: "CPU", key: "cpu", best: null },
  { label: "Category", key: "category", best: null },
];

// Best value of one row: lowest for price/weight, highest for the rest
export const bestValue = (list, row) => {
  const values = list.map((l) => l[row.key]);
  return row.best === "min" ? Math.min(...values) : Math.max(...values);
};

export function compareTable(list) {
  const head = list.map((l) => `<th class="p-3">${l.name}</th>`).join("");
  const body = rows.map((row) => {
    const best = row.best ? bestValue(list, row) : null;
    const cells = list.map((l) =>
      `<td class="p-3 ${l[row.key] === best ? "bg-accent font-bold text-on-accent" : ""}">${l[row.key]}</td>`
    ).join("");
    return `<tr class="border-t border-line"><th class="p-3 text-left">${row.label}</th>${cells}</tr>`;
  }).join("");
  return `<table class="w-full min-w-[32rem] text-left"><thead><tr><th class="p-3">Spec</th>${head}</tr></thead><tbody>${body}</tbody></table>`;
}
