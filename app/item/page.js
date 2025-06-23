"use client";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

//za cene dodati sa klijentske strane sa admin strane nije potrebno jer admin ne dodaje u korpu i ne obracunava
export default function ItemManager() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    basePrice: "",
    categoryId: "",
    sizes: [],
    addons: [],
  });
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  async function fetchItems() {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  }

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSizeChange(index, field, value) {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = value;
    setFormData((prev) => ({ ...prev, sizes: updatedSizes }));
  }

  function handleAddonChange(index, field, value) {
    const updatedAddons = [...formData.addons];
    updatedAddons[index][field] = field === "active" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, addons: updatedAddons }));
  }

  function addSize() {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", price: "" }],
    }));
  }

  function removeSize(indexToRemove) {
    const updatedSizes = formData.sizes.filter(
      (obj, currentIndex) => currentIndex !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      sizes: updatedSizes,
    }));
  }

  function addAddon() {
    setFormData((prev) => ({
      ...prev,
      addons: [...prev.addons, { name: "", price: "", active: false }],
    }));
  }
  function removeAddon(indexToRemove) {
    const updatedAddons = formData.addons.filter(
      (obj, currentIndex) => currentIndex !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      addons: updatedAddons,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = "/api/items";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isEditing ? { ...formData, _id: isEditing } : formData
      ),
    });

    if (res.ok) {
      setFormData({
        name: "",
        description: "",
        basePrice: "",
        imageUrl: "",
        categoryId: "",
        sizes: [],
        addons: [],
      });
      setIsEditing(null);
      fetchItems();
    }
  }

  async function handleDelete(id) {
    await fetch(`/api/items?_id=${id}`, { method: "DELETE" });
    fetchItems();
  }

  function handleEdit(item) {
    setFormData(item);
    setIsEditing(item._id);
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Items</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border p-4 rounded  flex flex-col gap-5"
      >
        <div className="flex gap-20">
          <div className="flex flex-col ">
            <label className="mb-2">Upload picture here</label>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="URL"
              className="mb-4"
            />

            <label className="mb-2">Item name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Pizza"
              className="mb-4"
            />

            <label className="mb-2">Item description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Best pizza ever"
              className="w-full p-2 border rounded text-white mb-4"
            />

            <label className="mb-2">Item pice</label>
            <input
              name="basePrice"
              type="number"
              value={formData.basePrice}
              onChange={handleChange}
              placeholder="300"
              className="mb-4"
            />

            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="mb-4 bg-black"
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option className="text-white" key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-5  ">
            <h4>Sizes</h4>
            {formData.sizes.map((s, i) => (
              <div
                key={i}
                className="flex gap-3 p-2 border-1 border-white rounded-2xl"
              >
                <input
                  placeholder="Size"
                  value={s.size}
                  onChange={(e) => handleSizeChange(i, "size", e.target.value)}
                />
                <input
                  placeholder="Price"
                  type="number"
                  value={s.price}
                  onChange={(e) => handleSizeChange(i, "price", e.target.value)}
                />
                <FaTrash
                  onClick={() => removeSize(i)}
                  className="text-red-500 text-xl cursor-pointer"
                />
              </div>
            ))}
            <button
              className="rounded-2xl p-2 bg-green-400 w-30"
              type="button"
              onClick={addSize}
            >
              + Add Size
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <h4>Addons</h4>
            {formData.addons.map((a, i) => (
              <div
                key={i}
                className="flex gap-3 p-2 border-1 border-white rounded-2xl"
              >
                <input
                  placeholder="Name"
                  value={a.name}
                  onChange={(e) => handleAddonChange(i, "name", e.target.value)}
                />
                <input
                  placeholder="Price"
                  type="number"
                  value={a.price}
                  onChange={(e) =>
                    handleAddonChange(i, "price", e.target.value)
                  }
                />
                <select
                  className={` rounded  ${
                    a.active === true || a.active === "true"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                  value={a.active.toString()}
                  onChange={(e) =>
                    handleAddonChange(i, "active", e.target.value)
                  }
                >
                  <option className="text-white bg-black" value="true">
                    Active
                  </option>
                  <option className="text-white bg-black" value="false">
                    Inactive
                  </option>
                </select>
                <FaTrash
                  onClick={() => removeAddon(i)}
                  className="text-red-500 ml-2 text-xl cursor-pointer"
                />
              </div>
            ))}
            <button
              type="button"
              className="rounded-2xl p-2 bg-green-400 w-30"
              onClick={addAddon}
            >
              + Add Addon
            </button>
          </div>
        </div>

        <button
          className="ml-auto rounded-2xl w-30 bg-green-500 p-1.5 cursor-pointer"
          type="submit"
        >
          {isEditing ? "Update" : "Add"} Item
        </button>
      </form>

      <div>
        <h3 className="text-xl">All Items</h3>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item._id}
              className="border p-2 flex justify-between items-center"
            >
              <span>{item.name}</span>
              <span>Base price is {item.basePrice}</span>
              <div className="space-x-2">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
