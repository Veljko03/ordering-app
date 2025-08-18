export async function fetchCategories() {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchItems() {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}