"use client";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiExit } from "react-icons/bi";
import {
  FaGreaterThan,
  FaImage,
  FaPlus,
  FaPlusCircle,
  FaToggleOff,
  FaToggleOn,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { HiPencilAlt, HiThumbDown } from "react-icons/hi";
import { HiArrowDown, HiBarsArrowDown } from "react-icons/hi2";
import { MdDeleteForever } from "react-icons/md";
import { itemsSchemaZod } from "../utils/zodSchemas";
import { resolve } from "styled-jsx/css";

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
    setItems(sanitizedData);
  }
  console.log("FFFFFFFFFFFFFF ", formData);
  console.log("OOOOOOOOOO ", items);

  const MAX_IMAGE_SIZE = 5000 * 1024; // 5mb
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Fotografija ne sme biti veca od 5mb");
      return;
    }
    const base64 = await convertToBase64(file);
    setFormData((prev) => ({ ...prev, imageUrl: base64 }));
  };
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
    const payload = isEditing ? { ...formData, _id: isEditing.id } : formData;
    const validateData = itemsSchemaZod.safeParse(payload);
    if (!validateData.success) {
      const formatted = validateData.error.format(); // <- koristi format() zbog duboke validacije
      setValidationErrors(formatted);
      toast.error("Forma nije validna.");

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

  async function handleDelete(item) {
    async function deleteItem() {
      const res = await fetch(`/api/items?_id=${item.id}`, {
        method: "DELETE",
      });

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
    const fullCategory = categories.filter((cat) => cat._id == item.categoryId);
    console.log("AAAAAAAAAAAAAAAAA", fullCategory);

    setIsEditing({
      id: item._id,
      name: item.name,
      catName: fullCategory[0].name,
    });
  }

  async function toggleCategoryItems(categoryId) {
    //dostavljam id od kategorije koju sam kliknuo
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null); // zatvoram ako je otvorena

      return;
    }
    console.log("items by category ", itemsByCategory);

    if (!itemsByCategory[categoryId]) {
      //const res = await fetch(`/api/items?categoryId=${categoryId}`);
      //const data = await res.json();
      //setItemsByCategory((prev) => ({ ...prev, [categoryId]: data }));

      const filtered = items.filter((item) => item.categoryId == categoryId);

      setItemsByCategory(filtered);
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
  console.log("items by cat ", itemsByCategory);

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
          <h3 className="text-l text-black font-semibold  uppercase">
            Dodaj novo jelo
          </h3>
          <button
            type="button"
            onClick={() => setShowAddNewItemForm(true)}
            className="bg-[#7893c3] text-white px-4 py-2 rounded uppercase cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>

        {showAddNewItemForm && (
          <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white   w-full h-full overflow-y-auto">
              <XIcon
                className="text-black font-extralight ml-auto cursor-pointer w-16 h-18 "
                onClick={() => {
                  setShowAddNewItemForm(false);
                  setFormData(emptyFormData);
                  setIsEditing(null);
                }}
              />
              <div className="flex items-center text-sm text-gray-500 gap-2">
                <FaGreaterThan className="w-4 h-4 text-gray-400" />

                <button
                  type="button"
                  className="text-gray-700 hover:text-black transition cursor-pointer"
                  onClick={() => {
                    setShowAddNewItemForm(false);
                    setFormData(emptyFormData);
                    setIsEditing(null);
                  }}
                >
                  Sva jela
                </button>

                {isEditing && (
                  <>
                    <FaGreaterThan className="w-4 h-4 text-gray-400" />
                    <button
                      type="button"
                      className="text-gray-700 hover:text-black transition cursor-pointer"
                      onClick={() => {
                        setShowAddNewItemForm(false);
                        setFormData(emptyFormData);
                        setIsEditing(null);
                      }}
                    >
                      {isEditing.catName}{" "}
                    </button>
                    <FaGreaterThan className="w-4 h-4 text-gray-400" />
                    <span className="text-black font-medium">
                      {isEditing.name}
                    </span>
                  </>
                )}
              </div>

              <h1 className="mb-6 w-full text-center mt-6 text-2xl ml-2 font-bold text-black">
                {isEditing ? "Izmenite jelo" : "Dodajte novo jelo"}
              </h1>
              <form
                onSubmit={handleSubmit}
                className="  p-1 rounded  flex flex-col gap-5 overflow-x-auto mb-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col text-black">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Unesite fotografiju
                    </label>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative">
                        <img
                          src={
                            formData.imageUrl == ""
                              ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                              : formData.imageUrl
                          }
                          alt="Restaurant Owner"
                          className="w-20 h-20 rounded-md object-cover"
                        />
                        <label
                          htmlFor="image-upload"
                          className="absolute top-0 right-0 cursor-pointer text-black bg-amber-50 p-1 rounded-full shadow"
                        >
                          ✎
                        </label>
                      </div>
                    </div>
                    <input
                      type="file"
                      name="imageUrl"
                      id="image-upload"
                      accept="'.jpeg, .png, .jpg"
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden"
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
                    {validationErrors.name?._errors?.length > 0 && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.name._errors[0]}
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
                    {validationErrors.description?._errors?.length > 0 && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.description._errors[0]}
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
                    {validationErrors.basePrice?._errors?.length > 0 && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.basePrice._errors[0]}
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
                    {validationErrors.categoryId?._errors?.length > 0 && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.categoryId._errors[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-5  text-black">
                    <div className="flex gap-4 mb-4 items-center">
                      <h3 className="text-xl text-black font-semibold uppercase">
                        Veličine
                      </h3>
                      <button
                        type="button"
                        onClick={addSize}
                        className="bg-[#7893c3] text-white px-4 py-2 rounded uppercase cursor-pointer"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    {formData.sizes.map((s, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-1   text-black rounded "
                      >
                        <div>
                          {" "}
                          <input
                            placeholder="Srednja"
                            value={s.size}
                            className="text-black rounded p-1 w-30 sm:w-36 bg-gray-100"
                            onChange={(e) =>
                              handleSizeChange(i, "size", e.target.value)
                            }
                          />
                          {validationErrors?.sizes?.[i]?.size?._errors && (
                            <p className="text-sm text-red-500">
                              {validationErrors.sizes[i].size._errors[0]}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            placeholder="499"
                            type="number"
                            value={s.price}
                            className="rounded p-1 w-30 sm:w-36  bg-gray-100"
                            onChange={(e) =>
                              handleSizeChange(i, "price", e.target.value)
                            }
                          />
                          {validationErrors?.sizes?.[i]?.price?._errors && (
                            <p className="text-sm text-red-500">
                              {validationErrors.sizes[i].price._errors[0]}
                            </p>
                          )}
                        </div>

                        <FaTrash
                          onClick={() => removeSize(i)}
                          className="text-red-500 ml-auto   text-2xl cursor-pointer self-center"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-5 text-black">
                    <hr className="my-4 border-black" />
                    <div className="flex gap-4 mb-4 items-center">
                      <h3 className="text-xl text-black font-semibold  uppercase">
                        Prilozi
                      </h3>
                      <button
                        type="button"
                        onClick={addAddon}
                        className="bg-[#7893c3] text-white px-4 py-2 rounded uppercase cursor-pointer"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    {formData.addons.map((a, i) => (
                      <div
                        key={i}
                        className="flex w-full items-center gap-4 justify-between flex-nowrap text-black "
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Naziv
                          </label>
                          <input
                            placeholder="Tartar"
                            value={a.name}
                            className="rounded w-30 p-1 bg-gray-100"
                            onChange={(e) =>
                              handleAddonChange(i, "name", e.target.value)
                            }
                          />
                          {validationErrors?.addons?.[i]?.name?._errors && (
                            <p className="text-sm text-red-500">
                              {validationErrors.addons[i].name._errors[0]}
                            </p>
                          )}
                        </div>
                        <div className="">
                          <label className="block text-sm font-medium text-gray-700">
                            Cena (rsd){" "}
                          </label>
                          <input
                            placeholder="50"
                            type="number"
                            value={a.price}
                            className="rounded p-1 w-30 bg-gray-100"
                            onChange={(e) =>
                              handleAddonChange(i, "price", e.target.value)
                            }
                          />
                          {validationErrors?.addons?.[i]?.price?._errors && (
                            <p className="text-sm text-red-500">
                              {validationErrors.addons[i].price._errors[0]}
                            </p>
                          )}
                        </div>
                        <label className="relative ml-2 mt-4 inline-flex items-center self-center cursor-pointer scale-90">
                          <input
                            type="checkbox"
                            checked={a.active === true || a.active === "true"}
                            onChange={(e) =>
                              handleAddonChange(
                                i,
                                "active",
                                e.target.checked.toString()
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-14 h-8 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors duration-300 ease-in-out"></div>
                          <div className="absolute left-[2px] top-[2px] bg-white w-7 h-7 rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-6"></div>
                        </label>

                        {/* <div
                            onClick={() =>
                              handleAddonChange(
                                i,
                                "active",
                                (!a.active).toString()
                              )
                            }
                            className="cursor-pointer w-30 h-12 flex items-center justify-center"
                          >
                            {a.active === true || a.active === "true" ? (
                              <FaToggleOn className="h-full w-full  text-green-500" />
                            ) : (
                              <FaToggleOff className="h-full w-full  text-red-500" />
                            )}
                          </div> */}

                        <FaTrash
                          onClick={() => removeAddon(i)}
                          className="text-red-500 mt-2 ml-auto text-2xl cursor-pointer self-center"
                        />
                      </div>
                    ))}
                    {/* <button
                      type="button"
                      className="rounded p-2 bg-[#7893c3] text-white uppercase  w-26"
                      onClick={addAddon}
                    >
                      Dodaj
                    </button> */}
                  </div>
                </div>
                <div className="flex gap-2 ml-auto text-white mt-2">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleDelete(isEditing)}
                      className=" rounded w-26  uppercase bg-red-500 p-1.5 cursor-pointer"
                    >
                      Obriši
                    </button>
                  )}
                  {/* {isChanged && (
                    <button
                      type="button"
                      onClick={() => setFormData(emptyFormData)}
                      className=" rounded w-26  uppercase bg-red-500 p-1.5 cursor-pointer"
                    >
                      Otkaži
                    </button>
                  )} */}
                  <button
                    className=" rounded w-26 bg-[#7893c3] uppercase  p-1.5 cursor-pointer"
                    type="submit"
                  >
                    {isEditing ? "Izmeni" : "Dodaj"}
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
                  {itemsByCategory.length > 0 ? (
                    itemsByCategory.map((item) => (
                      <div
                        key={item._id}
                        className="border mt-2 p-2 flex rounded-xl  justify-between items-center text-black"
                      >
                        <span className="text-black">{item.name}</span>
                        <span className="text-black">{item.basePrice} rsd</span>
                        <div className=" flex gap-5 text-3xl">
                          <HiPencilAlt
                            className="cursor-pointer text-[#7893c3] text-2xl "
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
