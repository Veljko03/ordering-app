"use client";
import { LucideClock2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
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
      <div className="flex flex-col items-center text-center">
        <h2 className="text-xl font-bold mb-2 tracking-tight text-[#172554] uppercase">
          Sekcije menija
        </h2>
        <p className="text-lg text-black mb-8">
          Odaberite kategoriju u kojoj se jelo nalazi (npr. doručak, predjelo,
          glavno jelo…).
        </p>
      </div>
      <div className="bg-white p-2 rounded-lg shadow flex flex-col gap-5">
        <div className="flex gap-2 mb-4 ">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nova sekcija"
            className="border  p-2 rounded text-black  grow lg:grow-0 w-66"
          />
          <button
            onClick={addCategory}
            className="bg-[#7893c3] text-white px-4 py-2 rounded uppercase cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>

        <ul>
          {categories.map((cat) => {
            const isChanged = editingName.trim() !== cat.name.trim();

            return (
              <li key={cat._id} className="mb-4   pb-2">
                <div className="flex flex-wrap items-center  gap-2">
                  {editingId === cat._id ? (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
                        <h2 className="text-xl font-semibold text-center mb-4 text-black">
                          Izmeni kategoriju
                        </h2>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full mb-4 p-2 border rounded text-black"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className={`  px-4 ${
                              isChanged
                                ? "bg-[#8559A5] text-white"
                                : "bg-transparent text-[#8559A5]"
                            } py-2 rounded cursor-pointer border-2 border-solid border-[#8559A5] w-24 uppercase `}
                          >
                            Otkaži
                          </button>
                          <button
                            onClick={() => {
                              updateCategory();
                              setEditingId(null);
                            }}
                            className={`  w-24 px-4 uppercase  ${
                              isChanged
                                ? "bg-[#7893c3] text-white"
                                : "bg-transparent text-[#7893c3]"
                            } py-2 rounded border-[#7893c3] border-2 border-solid flex justify-center items-center text-center   cursor-pointer `}
                          >
                            Sačuvaj
                          </button>{" "}
                          <MdDeleteForever
                            onClick={() => deleteCategory(cat._id)}
                            className="text-red-500 text-2xl mr-5 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    //   <div>
                    //     <input
                    //       type="text"
                    //       value={editingName}
                    //       onChange={(e) => setEditingName(e.target.value)}
                    //       className=" p-1  text-black font-semibold"
                    //     />
                    //     <button
                    //       onClick={() => setEditingId(null)}
                    //       className="bg-[#8559A5] rounded text-black w-23 p-2 uppercase"
                    //     >
                    //       Otkaži
                    //     </button>
                    //     <button
                    //       onClick={updateCategory}
                    //       className="bg-[#7893c3] text-black p-2 w-23 rounded uppercase"
                    //     >
                    //       Sačuvaj
                    //     </button>
                    //      <HiPencilAlt
                    //       onClick={() => {
                    //         setEditingId(cat._id);
                    //         setEditingName(cat.name);
                    //       }}
                    //       className="text-blue-500 text-2xl  mr-3 cursor-pointer"
                    //     />
                    //      <MdDeleteForever
                    //       onClick={() => deleteCategory(cat._id)}
                    //       className="text-red-500 text-2xl mr-5 cursor-pointer"
                    //     />
                    //   </div>
                    <div className="flex w-full border-b-1 border-b-black  ">
                      <span
                        className="cursor-pointer font-semibold  text-black"
                        onClick={() => toggleCategoryItems(cat._id)}
                      >
                        {cat.name}
                      </span>
                      {/* <LucideClock2 className="ml-auto mr-3 cursor-pointer text-black" /> */}
                      <button
                        onClick={() => {
                          setEditingId(cat._id);
                          setEditingName(cat.name);
                        }}
                        className="bg-[#7893c3] font-bold text-white mb-2  flex items-center justify-center  rounded uppercase cursor-pointer ml-auto  w-12 h-10 "
                      >
                        <HiPencilAlt />
                      </button>
                      {/* <HiPencilAlt
                      onClick={() => {
                        setEditingId(cat._id);
                        setEditingName(cat.name);
                      }}
                      className="text-blue-500 text-2xl  mr-3 cursor-pointer"
                    /> */}
                      {/* <MdDeleteForever
                      onClick={() => deleteCategory(cat._id)}
                      className="text-red-500 text-2xl mr-5 cursor-pointer"
                    /> */}
                    </div>
                  )}
                </div>

                {expandedCategoryId === cat._id && (
                  <ul className="ml-4 mt-2 text-sm text-white-700">
                    {itemsByCategory[cat._id]?.length > 0 ? (
                      itemsByCategory[cat._id].map((item) => (
                        <li
                          key={item._id}
                          className="border p-2 rounded mb-1 text-black"
                        >
                          <div className="font-semibold">{item.name}</div>
                          <div>{item.description}</div>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic text-black">
                        Ova kategorija je prazna
                      </li>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
