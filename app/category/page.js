"use client";
import { useEffect, useState } from "react";

export default function CategoryManager({ onChange }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [itemsByCategory, setItemsByCategory] = useState({});
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  //ovde mozda izmeniti u smislu da se dobave prvo itemi svi pa da se radi poredjenje samo po categroyId kod itema
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }

  async function addCategory() {
    if (!newCategory) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    });
    setNewCategory("");
    fetchCategories();
    onChange?.(); //javlja da se promenilo nesto admin panelu
  }

  async function deleteCategory(_id) {
    await fetch(`/api/categories?_id=${_id}`, {
      method: "DELETE",
    });
    fetchCategories();
    onChange?.(); //javlja da se promenilo nesto admin panelu
  }

  async function updateCategory() {
    await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: editingId, name: editingName }),
    });
    setEditingId(null);
    setEditingName("");
    fetchCategories();
    onChange?.(); //javlja da se promenilo nesto admin panelu
  }

  async function toggleCategoryItems(categoryId) {
    //dostavljam id od kategorije koju sam kliknuo
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null); // zatvoram ako je otvorena
      return;
    }
    console.log("items by category ", itemsByCategory);

    if (!itemsByCategory[categoryId]) {
      const res = await fetch(`/api/items?categoryId=${categoryId}`);
      const data = await res.json();
      setItemsByCategory((prev) => ({ ...prev, [categoryId]: data }));
    }

    setExpandedCategoryId(categoryId);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Kategorije</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="border p-2 rounded"
        />
        <button
          onClick={addCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul>
        {categories.map((cat) => (
          <li key={cat._id} className="mb-4 border-b pb-2">
            <div className="flex items-center gap-2">
              {editingId === cat._id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border p-1 rounded"
                  />
                  <button
                    onClick={updateCategory}
                    className="bg-green-500 text-white px-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-red-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="cursor-pointer font-medium"
                    onClick={() => toggleCategoryItems(cat._id)}
                  >
                    {cat.name}
                  </span>
                  <button
                    onClick={() => {
                      setEditingId(cat._id);
                      setEditingName(cat.name);
                    }}
                    className="text-blue-500"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            {expandedCategoryId === cat._id && (
              <ul className="ml-4 mt-2 text-sm text-white-700">
                {itemsByCategory[cat._id]?.length > 0 ? (
                  itemsByCategory[cat._id].map((item) => (
                    <li key={item._id} className="border p-2 rounded mb-1">
                      <div className="font-semibold">{item.name}</div>
                      <div>{item.description}</div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">
                    No items in this category
                  </li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
