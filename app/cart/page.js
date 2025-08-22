"use client";
import Header from "@/components/Header";
import { CartContext } from "../context/CartContext";
import { useContext } from "react";
import { FaArrowLeft, FaMinus, FaPlug, FaPlus, FaTrash } from "react-icons/fa";
import Hero from "@/components/Hero";
import Link from "next/link";

export default function Cart() {
  const { itemsInCart, setItemsInCart } = useContext(CartContext);
  const deliveryFee = 10;
  const total = 100;
  const subtotal = 90;
  console.log("CCCCCCCC ", itemsInCart);

  return (
    <div>
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
                    //onClick={() => updateQuantity(item._id, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-300"
                  >
                    <FaMinus className="w-3 h-3" />
                  </button>
                  <span className="min-w-[2rem] text-center">
                    {obj.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-400 hover:bg-orange-500 text-white"
                  >
                    <FaPlus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item._id)}
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
          <form className="space-y-3 text-black">
            <input
              type="text"
              placeholder="Ime i prezime"
              className="w-full border rounded-lg p-2 text-black"
            />
            <input
              type="text"
              placeholder="Ulica i broj"
              className="w-full border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Telefon"
              className="w-full border rounded-lg p-2"
            />
          </form>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-gray-600">
              <span>Međuzbir</span>
              <span>${subtotal.toFixed(2)}</span>
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

          <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200">
            Naruči
          </button>
        </div>
      </div>
    </div>
  );
}
