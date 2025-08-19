//CATEGORIES
export async function fetchCategories() {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function newCategoryReq(name) {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg || "Greška pri čuvanju");
  }

  return res.json();
}
export async function updateCategoryReq({ _id, name, startTime, endTime }) {
  const res = await fetch("/api/categories", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id, name, startTime, endTime }),
  });
  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg || "Greška pri azuriranju");
  }

  return res.json();
}

export async function deleteCategoryReq(_id) {
  const res = await fetch(`/api/categories?_id=${_id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg || "Greška pri čuvanju");
  }

  return res.json();
}

//INFO
export async function fetchInfoReq() {
  const res = await fetch("/api/buisnessInfo");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();

  return data[0];
}
export async function saveInfoReq(formData) {
  const res = await fetch("/api/buisnessInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg || "Greška pri čuvanju");
  }
  return res.json();
}

export async function fetchItems() {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

// export async function fetchItems() {
//   const res = await fetch("/api/items");
//   if (!res.ok) throw new Error("Failed to fetch items");
//   return res.json();
// }
// export async function fetchItems() {
//   const res = await fetch("/api/items");
//   if (!res.ok) throw new Error("Failed to fetch items");
//   return res.json();
// }
// export async function fetchItems() {
//   const res = await fetch("/api/items");
//   if (!res.ok) throw new Error("Failed to fetch items");
//   return res.json();
// }
