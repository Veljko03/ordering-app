"use client";
import Header from "@/components/Header";
import { CartContext } from "../context/CartContext";
import { useContext } from "react";

export default function Cart() {
  const { itemsInCart, setItemsInCart } = useContext(CartContext);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <h1 className="text-black">Ovde ce biti prikazani itemi</h1>
    </div>
  );
}
