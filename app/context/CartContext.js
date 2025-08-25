"use client";
import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [itemsInCart, setItemsInCart] = useState([]);
  const [deliveryPrice, setDeliveryPrice] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <CartContext.Provider
      value={{
        itemsInCart,
        setItemsInCart,
        deliveryPrice,
        setDeliveryPrice,
        selectedPlace,
        setSelectedPlace,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
