"use client";
import { useEffect, useState } from "react";

export default function ItemManager({ categories }) {
  const [items, setItems] = useState([]);
  //const [categories, setCategories] = useState([]);
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
  console.log(categories, " this is cateogory in item");

  useEffect(() => {
    fetchItems();
    //fetchCategories();
  }, []);

  async function fetchItems() {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  }

  // async function fetchCategories() {
  //   const res = await fetch("/api/categories");
  //   const data = await res.json();
  //   setCategories(data);
  // }

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

  function addAddon() {
    setFormData((prev) => ({
      ...prev,
      addons: [...prev.addons, { name: "", price: "", active: false }],
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

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <input
          name="basePrice"
          type="number"
          value={formData.basePrice}
          onChange={handleChange}
          placeholder="Price"
        />

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories?.map((cat) => (
            <option className="text-black" key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div>
          <h4>Sizes</h4>
          {formData.sizes.map((s, i) => (
            <div key={i}>
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
            </div>
          ))}
          <button type="button" onClick={addSize}>
            + Add Size
          </button>
        </div>

        <div>
          <h4>Addons</h4>
          {formData.addons.map((a, i) => (
            <div key={i}>
              <input
                placeholder="Name"
                value={a.name}
                onChange={(e) => handleAddonChange(i, "name", e.target.value)}
              />
              <input
                placeholder="Price"
                type="number"
                value={a.price}
                onChange={(e) => handleAddonChange(i, "price", e.target.value)}
              />
              <select
                value={a.active.toString()}
                onChange={(e) => handleAddonChange(i, "active", e.target.value)}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={addAddon}>
            + Add Addon
          </button>
        </div>

        <button type="submit">{isEditing ? "Update" : "Add"} Item</button>
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
