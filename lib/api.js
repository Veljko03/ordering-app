//CATEGORIES
export async function fetchCategoriesReq() {
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

//SCHEDULEE
export async function fetchScheduleReq() {
  const res = await fetch("/api/schedule");
  if (!res.ok) throw new Error("Failed to fetch schedule");
  const data = await res.json();
  if (!data[0].schedule) {
    return;
  }
  const d = data[0].schedule;
  return d;
}

export async function updateScheduleReq(formmatedData) {
  const res = await fetch("/api/schedule", {
    method: "POST",
    body: JSON.stringify(formmatedData),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg || "Greška pri čuvanju");
  }

  return res.json();
}

export async function fetchItemsWithoutSinitazeReq() {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to fetch items");
  const data = await res.json();

  return data;
}
export async function fetchItemsReq() {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to fetch items");
  const data = await res.json();
  console.log("DDAAATTTAAAAA ", data);

  const sanitizedData = data.map((item) => ({
    ...item,
    basePrice: item.basePrice?.toString() ?? "",
    sizes:
      item.sizes?.map((s) => ({
        ...s,
        price: s.price?.toString() ?? "",
      })) ?? [],
    addons:
      item.addons?.map((a) => ({
        ...a,
        price: a.price?.toString() ?? "",
      })) ?? [],
  }));

  console.log(sanitizedData, " SSSSSSSSSSSSSSSSSSSSSSSSS");

  return sanitizedData;
}

export async function deleteItemReq(itemId) {
  const res = await fetch(`/api/items?_id=${itemId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg || "Greška pri čuvanju");
  }

  return res.json();
}

export async function updateItemReq(payload) {
  const res = await fetch("/api/items", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg || "Greška pri čuvanju");
  }

  return res.json();
}

export async function createItemReq(payload) {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg || "Greška pri čuvanju");
  }

  return res.json();
}

export async function sendEmailReq(user) {
  const res = await fetch("/api/sendEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const data = await res.json();

  return data;
}
