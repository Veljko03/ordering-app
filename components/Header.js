"use client";
import { useContext, useState } from "react";
import { FaShoppingCart, FaLocationArrow, FaClock } from "react-icons/fa";
import { notFound, useRouter } from "next/navigation";
import { CartContext } from "@/app/context/CartContext";
import RestaurantStatus from "./RestaurantStatus";

const Header = ({ info, schedule }) => {
  //onst { toggleCart, itemCount } = useCart();
  const { itemsInCart, setItemsInCart } = useContext(CartContext);
  if (info) console.log("infooo ", info);

  const itemCount = itemsInCart.length;
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50  bg-background/95 backdrop-blur 0 border-b-1 border-orange-400">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo dodati mozda */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-14 h-14 bg-orange-400 rounded-full flex items-center justify-center">
            {info?.logoUrl ? (
              <img
                src={info.logoUrl}
                alt={info?.name}
                className="w-14 h-14 rounded-full"
              />
            ) : (
              <div className="w-14 h-14 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">K</span>
              </div>
            )}
          </div>
          <span className="font-display font-bold text-xl text-black">
            {info?.name}
          </span>
        </div>

        {/* // Restaurant Info - Hidden on mobile  */}
        <div className="hidden md:flex items-center ">
          {/* <div className="flex items-center space-x-2 text-sm">
            <Places />
          </div> */}
          {/* <div className="flex items-center space-x-2 text-sm">
            <FaClock className="w-4 h-4 text-black" />
          </div> */}
          <RestaurantStatus schedule={schedule} />
        </div>

        {/* Cart Button */}
        <button
          size="sm"
          className="relative transition-smooth hover:scale-105 cursor-pointer "
          onClick={() => router.push("/cart")}
        >
          <FaShoppingCart className="w-6 h-6  mr-2 text-black" />
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-orange-400 rounded-full text-black px-1.5 py-0.5 text-xs min-w-[1.25rem] h-5 flex items-center justify-center">
              {itemCount}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
