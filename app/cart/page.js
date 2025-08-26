"use client";
import Header from "@/components/Header";
import { CartContext } from "../context/CartContext";
import { useContext, useMemo, useState } from "react";
import { FaArrowLeft, FaMinus, FaPlug, FaPlus, FaTrash } from "react-icons/fa";
import Hero from "@/components/Hero";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Places from "@/components/PlacePicker";
import { userOrderSchemaZod } from "../utils/zodSchemas";

export default function Cart() {
  const { itemsInCart, setItemsInCart, deliveryPrice } =
    useContext(CartContext);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    phoneNum: "",
    additionalInfo: "",
  });
  const deliveryFee = deliveryPrice || 0;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const updateQuantity = (id, num) => {
    let findItem = itemsInCart.filter((obj) => obj.item._id == id);

    if (!findItem) return;
    if (num == 1) findItem[0].quantity += 1;
    if (num == -1) findItem[0].quantity -= 1;
    console.log(findItem, " iiii");
    const newItem = findItem[0];

    const newArrOfItems = itemsInCart.map((obj) =>
      obj.item._id === id ? newItem : obj
    );

    setItemsInCart(newArrOfItems);
  };

  const removeItem = (id) => {
    const newArr = itemsInCart.filter((obj) => obj.item._id != id);
    setItemsInCart(newArr);
  };
  console.log("OOOO ", itemsInCart);

  let priceOfMeals = 0;
  itemsInCart.forEach((obj) => {
    const priceAndQuantity = obj.pricePerItem * obj.quantity;
    priceOfMeals += priceAndQuantity;
  });

  const total = priceOfMeals + deliveryFee;

  const orderItem = (e) => {
    e.preventDefault();
    if (!deliveryFee) {
      toast.error("Niste uneli adresu");
      return;
    }

    if (itemsInCart.length == 0) {
      toast.error("Korpa je prazna");
      return;
    }
    const validateData = userOrderSchemaZod.safeParse(formData);
    if (!validateData.success) {
      const errors = validateData.error.flatten().fieldErrors;
      setValidationErrors(errors);
      console.log(errors, " EEEEEEEEEEEEEEEEE");

      return;
    }

    console.log("narucuje se");
    toast.success("Narucili ste hranuu");

    setValidationErrors({});
  };
  return (
    <div className="bg-[#f3f3f4]">
      <Toaster position="top-center" reverseOrder={true} />

      <Header />
      <div className="flex gap-5 mx-auto px-4 py-4">
        <Link
          href={"/"}
          className="transition-smooth hover:bg-muted text-black flex items-center"
        >
          <FaArrowLeft className="w-4 h-4 mr-2 text-black" />
          Pocetna{" "}
        </Link>
        <Link
          href={"/menu"}
          className="transition-smooth hover:bg-muted text-black flex items-center"
        >
          <FaArrowLeft className="w-4 h-4 mr-2 text-black" />
          Meni
        </Link>
      </div>
      <Places />
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Cart items */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold text-black">Tvoja korpa</h1>

          {itemsInCart.length === 0 ? (
            <p className="text-gray-500">Korpa je prazna.</p>
          ) : (
            itemsInCart.map((obj) => (
              <div
                key={obj.item._id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border"
              >
                <img
                  src={obj.item.imageUrl}
                  alt={obj.item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 text-black">
                  <h2 className="font-semibold text-lg">{obj.item.name}</h2>
                  <p className="text-gray-500 text-sm">
                    {obj?.size != "undefined" && obj?.size?.size}{" "}
                    {obj.addons?.length > 0 &&
                      `+ ${obj.addons.map((a) => a.name).join(", ")}`}
                  </p>
                  <p className="font-medium text-green-500">
                    ${obj.pricePerItem}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(obj.item._id, -1)}
                    disabled={obj.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer bg-gray-300 hover:bg-gray-300"
                  >
                    <FaMinus className="w-3 h-3" />
                  </button>
                  <span className="min-w-[2rem] text-center text-black">
                    {obj.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(obj.item._id, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer bg-orange-400 hover:bg-orange-500 text-white"
                  >
                    <FaPlus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(obj.item._id)}
                  className="ml-4 text-gray-400 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right side - Checkout */}
        <div className="bg-white p-6 rounded-xl shadow-md border h-fit sticky top-10 space-y-4">
          <h2 className="text-xl font-semibold text-black">
            Podaci za dostavu
          </h2>
          <form onSubmit={orderItem} className="space-y-3 text-black">
            <input
              type="text"
              name="firstName"
              placeholder="Ime "
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 text-black"
            />{" "}
            {validationErrors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.firstName[0]}
              </p>
            )}
            <input
              type="text"
              name="surname"
              placeholder="Prezime"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 text-black"
            />
            {validationErrors.surname && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.surname[0]}
              </p>
            )}
            <input
              type="text"
              name="phoneNum"
              placeholder="Telefon"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
            />
            {validationErrors.phoneNum && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.phoneNum[0]}
              </p>
            )}
            <input
              type="text"
              name="additionalInfo"
              placeholder="Napomene za dostavljaca"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
            />
            {validationErrors.additionalInfo && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.additionalInfo[0]}
              </p>
            )}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Cena jela</span>
                <span>${priceOfMeals}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Dostava</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-black">
                <span>Ukupno</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200"
            >
              Naruči
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
