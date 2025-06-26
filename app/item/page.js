"use client";
import { useEffect, useState } from "react";
import { FaPlus, FaPlusCircle, FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";

//za cene dodati sa klijentske strane sa admin strane nije potrebno jer admin ne dodaje u korpu i ne obracunava
export default function ItemManager() {
  const emptyFormData = {
    name: "",
    description: "",
    imageUrl: "",
    basePrice: "",
    categoryId: "",
    sizes: [],
    addons: [],
  };
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyFormData);

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

  const isChanged = JSON.stringify(formData) !== JSON.stringify(emptyFormData);

  return (
    <div className="p-4 space-y-6 bg-[#f3f3f4]">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-xl mb-2 font-semibold text-[#172554] uppercase">
          Informacije o jelu
        </h2>
        <p className="text-lg mb-8 text-[#172554]">
          Svako jelo se unosi pojedinačno. <br /> Po želji dodajte dodatne
          napomene (npr. vegetarijansko, ljuto, bez glutena…).
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow flex  flex-col gap-5">
        <form
          onSubmit={handleSubmit}
          className="  p-4 rounded  flex flex-col gap-5 overflow-x-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col text-black">
              <label className="mb-2">Unesite fotografiju</label>
              <input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="URL"
                className="mb-4 p-2  rounded-2xl text-black w-full bg-gray-100"
              />

              <label className="mb-2 ">Naziv jela</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Karađorđeva šnicla"
                className="mb-4 p-2  rounded-2xl text-black w-full bg-gray-100"
              />

              <label className="mb-2">Opis </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Piliće meso, kajmak, pomfrit.."
                className="mb-4 p-2  rounded-2xl text-black w-full bg-gray-100"
              />

              <label className="mb-2">Cena </label>
              <input
                name="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="1100"
                className="mb-4 p-2 b rounded-2xl text-black w-full bg-gray-100"
              />

              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="mb-4 p-2  rounded-2xl text-black w-full bg-gray-100"
              >
                <option value="">Izaberiti kategoriju</option>
                {categories?.map((cat) => (
                  <option className="text-black" key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-5  text-black">
              <h4>Veličine</h4>
              {formData.sizes.map((s, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-2 border-1 border-black text-black rounded-2xl "
                >
                  <input
                    placeholder="Veličina"
                    value={s.size}
                    className="text-black rounded-xl p-1 w-30 sm:w-60 bg-gray-100"
                    onChange={(e) =>
                      handleSizeChange(i, "size", e.target.value)
                    }
                  />
                  <input
                    placeholder="Cena"
                    type="number"
                    value={s.price}
                    className="rounded-xl p-1 w-30 sm:w-60  bg-gray-100"
                    onChange={(e) =>
                      handleSizeChange(i, "price", e.target.value)
                    }
                  />
                  <FaTrash
                    onClick={() => removeSize(i)}
                    className="text-red-500 ml-auto   text-xl cursor-pointer self-center"
                  />
                </div>
              ))}
              <button
                className="rounded-2xl p-2 uppercase bg-[#7893c3] text-white  w-30"
                type="button"
                onClick={addSize}
              >
                Dodaj
              </button>
            </div>

            <div className="flex flex-col gap-5 text-black">
              <h4>Prilozi</h4>
              {formData.addons.map((a, i) => (
                <div
                  key={i}
                  className="flex flex-wrap gap-2 w-full p-2 border-1 text-black border-black rounded-2xl"
                >
                  <input
                    placeholder="Tartar"
                    value={a.name}
                    className="rounded-xl p-1 bg-gray-100"
                    onChange={(e) =>
                      handleAddonChange(i, "name", e.target.value)
                    }
                  />
                  <input
                    placeholder="50"
                    type="number"
                    value={a.price}
                    className="rounded-xl p-1 bg-gray-100"
                    onChange={(e) =>
                      handleAddonChange(i, "price", e.target.value)
                    }
                  />
                  <select
                    className={` rounded   ${
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
                      Dostupan
                    </option>
                    <option className="text-white bg-black" value="false">
                      Nedostupan
                    </option>
                  </select>
                  <FaTrash
                    onClick={() => removeAddon(i)}
                    className="text-red-500 ml-auto text-xl cursor-pointer self-center"
                  />
                </div>
              ))}
              <button
                type="button"
                className="rounded-2xl p-2 bg-[#7893c3] text-white uppercase  w-30"
                onClick={addAddon}
              >
                Dodaj
              </button>
            </div>
          </div>
          <div className="flex gap-5 ml-auto text-black mt-10">
            {isChanged && (
              <button
                onClick={() => setFormData(emptyFormData)}
                className=" rounded-2xl w-30 text-black uppercase bg-red-500 p-1.5 cursor-pointer"
              >
                Otkaži
              </button>
            )}
            <button
              className=" rounded-2xl w-30 bg-[#7893c3] text-white uppercase  p-1.5 cursor-pointer"
              type="submit"
            >
              {isEditing ? "Izmeni" : "Dodaj"} jelo
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-xl text-black">Sva jela</h3>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item._id}
                className="border p-2 flex rounded-xl p-3 justify-between items-center text-black"
              >
                <span className="text-black">{item.name}</span>
                <span className="text-black">Cena je {item.basePrice} rsd</span>
                <div className="space-x-2 flex gap-5 text-3xl">
                  <HiPencilAlt
                    className="cursor-pointer"
                    onClick={() => handleEdit(item)}
                  />
                  <MdDeleteForever
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(item._id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
