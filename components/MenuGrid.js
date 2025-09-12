import React from "react";
import MenuItemCard from "./MenuItemCard";

const MenuGrid = ({ items, onItemClick }) => {
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <div className="text-6xl">🍽️</div>
          <h3 className="text-xl font-medium text-black">Prazna sekcija</h3>
          <p className="text-black">Proverite neku drugu kategoriju</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <MenuItemCard
            key={item._id}
            item={item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;
