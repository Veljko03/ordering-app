"use client";
import { useState } from "react";
import { FaShoppingCart, FaLocationArrow, FaClock } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useCart } from "@/context/CartContext";
// import { restaurant } from "@/data/mockData";

const Header = () => {
  //onst { toggleCart, itemCount } = useCart();
  const [itemCount, setItemCount] = useState(1);
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">R</span>
          </div>
          <span className="font-display font-bold text-xl text-black">
            Restoran
          </span>
        </div>

        {/* Restaurant Info - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm">
            <FaLocationArrow className="w-4 h-4 text-black" />
            <span className="text-black">Delivering to your area</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <FaClock className="w-4 h-4 text-black" />
            {/* <span className="text-muted-foreground">{restaurant.deliveryTime}</span> */}
          </div>
        </div>

        {/* Cart Button */}
        <button
          size="sm"
          // onClick={toggleCart}
          className="relative transition-smooth hover:scale-105 cursor-pointer "
        >
          <FaShoppingCart className="w-6 h-6  mr-2 text-black" />
          <span className="hidden text-black sm:inline">Cart</span>
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
