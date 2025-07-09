"use client";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiExit } from "react-icons/bi";
import { FaPlus, FaPlusCircle, FaTrash } from "react-icons/fa";
import { HiPencilAlt, HiThumbDown } from "react-icons/hi";
import { HiArrowDown, HiBarsArrowDown } from "react-icons/hi2";
import { MdDeleteForever } from "react-icons/md";
import { itemsSchemaZod } from "../utils/zodSchemas";

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
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [showAddNewItemForm, setShowAddNewItemForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  async function fetchItems() {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
    console.log("data ", data);
  }
  console.log("FFFFFFFFFFFFFF ", formData);

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
    console.log("IIIIIIIIIII ", isEditing);

    const method = isEditing ? "PUT" : "POST";
    const url = "/api/items";
    const payload = isEditing ? { ...formData, _id: isEditing } : formData;
    const validateData = itemsSchemaZod.safeParse(payload);
    if (!validateData.success) {
      const errors = validateData.error.flatten().fieldErrors;
      setValidationErrors(errors);

      return;
    }
    async function saveItem() {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Greška pri čuvanju");
      }

      return res.json();
    }
    await toast.promise(saveItem(), {
      loading: "Čuvanje...",
      success: <b>Jelo je uspešno sačuvano!</b>,
      error: <b>Došlo je do greške.</b>,
    });

    setFormData({
      name: "",
      description: "",
      basePrice: "",
      imageUrl: "",
      categoryId: "",
      sizes: [],
      addons: [],
    });
    await fetchItems();
    setIsEditing(null);
    setItemsByCategory({});

    setShowAddNewItemForm(false);
    setExpandedCategoryId(null);
    setValidationErrors({});
  }

  async function handleDelete(id) {
    async function deleteItem() {
      const res = await fetch(`/api/items?_id=${id}`, { method: "DELETE" });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Greška pri čuvanju");
      }

      return res.json();
    }

    await toast.promise(deleteItem(), {
      loading: "Brisanje...",
      success: <b>Jelo je uspešno obrisano!</b>,
      error: <b>Došlo je do greške.</b>,
    });
    setIsEditing(null);
    setShowAddNewItemForm(false);

    await fetchItems();
    await fetchCategories();
    setItemsByCategory({});
    setExpandedCategoryId(null);
  }

  function handleEdit(item) {
    setFormData(item);
    setIsEditing(item._id);
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
  console.log("EEEEEEE ", isEditing);

  function isFormDataEmpty(formData) {
    return (
      formData.name === "" &&
      formData.description === "" &&
      formData.imageUrl === "" &&
      formData.basePrice === "" &&
      formData.categoryId === "" &&
      formData.sizes.length === 0 &&
      formData.addons.length === 0
    );
  }
  const isChanged = !isFormDataEmpty(formData);

  return (
    <div className="p-4 space-y-6 bg-[#f3f3f4]">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="flex flex-col items-center text-center">
        <h2 className="text-xl font-bold mb-2 tracking-tight text-[#172554] uppercase">
          Informacije o jelu
        </h2>
        <p className="text-lg  mb-8 text-black">
          Svako jelo se unosi pojedinačno. <br /> Po želji dodajte dodatne
          napomene (npr. vegetarijansko, ljuto, bez glutena…).
        </p>
      </div>
      <div>
        <h3 className="text-xl text-black font-semibold mb-4 uppercase">
          Sva jela
        </h3>
        <div className="flex gap-4 mb-4 items-center">
          <h3 className="text-l text-black font-semibold uppercase">
            Dodaj novo jelo
          </h3>
          <button
            onClick={() => setShowAddNewItemForm(true)}
            className="bg-[#7893c3] text-white px-4 py-2 rounded uppercase cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>
        {showAddNewItemForm && (
          <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-5 max-h-[90vh] overflow-y-auto w-[90vw] max-w-6xl">
              <XIcon
                className="text-red-500 ml-auto cursor-pointer w-16 h-18 "
                onClick={() => {
                  setShowAddNewItemForm(false);
                  setFormData(emptyFormData);
                  setIsEditing(null);
                }}
              />

              <form
                onSubmit={handleSubmit}
                className="  p-4 rounded  flex flex-col gap-5 overflow-x-auto mb-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col text-black">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Unesite fotografiju
                    </label>
                    <input
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="URL"
                      className="mb-4 p-2  rounded text-black w-full bg-gray-100"
                    />

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Naziv jela
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Karađorđeva šnicla"
                      className="mb-4 p-2  rounded text-black w-full bg-gray-100"
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-sm ">
                        {validationErrors.name[0]}
                      </p>
                    )}

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Opis{" "}
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Piliće meso, kajmak, pomfrit.."
                      className="mb-4 p-2  rounded text-black w-full bg-gray-100"
                    />
                    {validationErrors.description && (
                      <p className="text-red-500 text-sm ">
                        {validationErrors.description[0]}
                      </p>
                    )}

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Cena{" "}
                    </label>
                    <input
                      name="basePrice"
                      type="number"
                      value={formData.basePrice}
                      onChange={handleChange}
                      placeholder="1100"
                      className="mb-4 p-2 b rounded text-black w-full bg-gray-100"
                    />
                    {validationErrors.basePrice && (
                      <p className="text-red-500 text-sm ">
                        {validationErrors.basePrice[0]}
                      </p>
                    )}
                    <label className="block text-sm font-medium text-gray-700">
                      Sekcija
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="mb-4 p-2 h-10 mt-2  rounded text-black w-full bg-gray-100"
                    >
                      <option value="">Izaberiti sekciju</option>
                      {categories?.map((cat) => (
                        <option
                          className="text-black"
                          key={cat._id}
                          value={cat._id}
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {validationErrors.categoryId && (
                      <p className="text-red-500 text-sm ">
                        {validationErrors.categoryId[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-5  text-black">
                    <h4 className="text-xl text-black font-semibold mb-4 uppercase">
                      Veličine
                    </h4>
                    {formData.sizes.map((s, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-2 border-1 border-black text-black rounded "
                      >
                        <input
                          placeholder="Veličina"
                          value={s.size}
                          className="text-black rounded p-1 w-30 sm:w-60 bg-gray-100"
                          onChange={(e) =>
                            handleSizeChange(i, "size", e.target.value)
                          }
                        />
                        {validationErrors?.sizes?.[i]?.size && (
                          <p className="text-red-500 text-sm">
                            {validationErrors.sizes[i].size[0]}
                          </p>
                        )}
                        <input
                          placeholder="Cena"
                          type="number"
                          value={s.price}
                          className="rounded p-1 w-30 sm:w-60  bg-gray-100"
                          onChange={(e) =>
                            handleSizeChange(i, "price", e.target.value)
                          }
                        />
                        {validationErrors?.sizes?.[i]?.price && (
                          <p className="text-red-500 text-sm">
                            {validationErrors.sizes[i].price[0]}
                          </p>
                        )}
                        <FaTrash
                          onClick={() => removeSize(i)}
                          className="text-red-500 ml-auto   text-xl cursor-pointer self-center"
                        />
                      </div>
                    ))}
                    <button
                      className="rounded p-2 uppercase bg-[#7893c3] text-white  w-30"
                      type="button"
                      onClick={addSize}
                    >
                      Dodaj
                    </button>
                  </div>

                  <div className="flex flex-col gap-5 text-black">
                    <hr className="my-4 border-black" />
                    <h3 className="text-xl text-black font-semibold mb-4 uppercase">
                      Prilozi
                    </h3>
                    {formData.addons.map((a, i) => (
                      <div
                        key={i}
                        className="flex flex-col flex-wrap gap-2 w-full p-2 border-1 text-black border-black rounded"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Naziv priloga
                          </label>
                          <input
                            placeholder="Tartar"
                            value={a.name}
                            className="rounded p-1 bg-gray-100"
                            onChange={(e) =>
                              handleAddonChange(i, "name", e.target.value)
                            }
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Cena priloga(rsd){" "}
                          </label>
                          <input
                            placeholder="50"
                            type="number"
                            value={a.price}
                            className="rounded p-1 bg-gray-100"
                            onChange={(e) =>
                              handleAddonChange(i, "price", e.target.value)
                            }
                          />
                          <label className=" mt-2 block text-sm font-medium text-gray-700">
                            Dostupnost priloga
                          </label>
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
                            <option
                              className="text-white bg-black"
                              value="true"
                            >
                              Dostupan
                            </option>
                            <option
                              className="text-white bg-black"
                              value="false"
                            >
                              Nedostupan
                            </option>
                          </select>
                        </div>

                        <FaTrash
                          onClick={() => removeAddon(i)}
                          className="text-red-500 ml-auto text-xl cursor-pointer self-center"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="rounded p-2 bg-[#7893c3] text-white uppercase  w-30"
                      onClick={addAddon}
                    >
                      Dodaj
                    </button>
                  </div>
                </div>
                <div className="flex gap-5 ml-auto text-white mt-10">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleDelete(isEditing)}
                      className=" rounded w-30  uppercase bg-red-500 p-1.5 cursor-pointer"
                    >
                      Obriši
                    </button>
                  )}
                  {isChanged && (
                    <button
                      type="button"
                      onClick={() => setFormData(emptyFormData)}
                      className=" rounded w-30  uppercase bg-red-500 p-1.5 cursor-pointer"
                    >
                      Otkaži
                    </button>
                  )}
                  <button
                    className=" rounded w-30 bg-[#7893c3] uppercase  p-1.5 cursor-pointer"
                    type="submit"
                  >
                    {isEditing ? "Izmeni" : "Dodaj"} jelo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ul className="space-y-2">
          {categories.map((cat) => (
            <div key={cat._id}>
              <div
                key={cat.id}
                className="border p-2 flex rounded-xl  justify-between items-center text-black cursor-pointer"
                onClick={() => toggleCategoryItems(cat._id)}
              >
                <span>{cat.name}</span>

                <HiBarsArrowDown />
              </div>
              {expandedCategoryId === cat._id && (
                <div className=" mt-2 text-sm text-white-700">
                  {itemsByCategory[cat._id]?.length > 0 ? (
                    itemsByCategory[cat._id].map((item) => (
                      <div
                        key={item._id}
                        className="border mt-2 p-2 flex rounded-xl  justify-between items-center text-black"
                      >
                        <span className="text-black">{item.name}</span>
                        <span className="text-black">{item.basePrice} rsd</span>
                        <div className=" flex gap-5 text-3xl">
                          <HiPencilAlt
                            className="cursor-pointer"
                            onClick={() => {
                              setShowAddNewItemForm(true);
                              handleEdit(item);
                            }}
                          />
                          {/* <MdDeleteForever
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleDelete(item._id)}
                          /> */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-black">
                      Ova kategorija je prazna
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
          {/* {items.map((item) => (
            <li
              key={item._id}
              className="border p-2 flex rounded-xl p-3 justify-between items-center text-black"
            >
              <span className="text-black">{item.name}</span>
              <span className="text-black">{item.basePrice} rsd</span>
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
          ))} */}
        </ul>
      </div>
    </div>
  );
}
