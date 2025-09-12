"use client";
import CategoryFilter from "@/components/CategoryFilter";

import Header from "@/components/Header";
import ItemModal from "@/components/ItemModal";
import MenuGrid from "@/components/MenuGrid";
import Places from "@/components/PlacePicker";
import {
  fetchCategoriesReq,
  fetchInfoReq,
  fetchItemsWithoutSinitazeReq,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Footer from "./Footer";

const Menu = () => {
  const { data: categories = [], isloading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoriesReq,
  });
  const { data: info = [], isloading: loadingInfo } = useQuery({
    queryKey: ["info"],
    queryFn: fetchInfoReq,
  });
  const { data: items = [], isloading: loadingItems } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItemsWithoutSinitazeReq,
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.categoryId === selectedCategory);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (loadingCategories || loadingItems)
    return <div className="text-black text-3xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f3f3f4]">
      <Header info={info} />

      <div className="container mx-auto px-4 py-4"></div>
      <Places />
      {/* Page Header */}
      {/* <div className="container mx-auto px-4 pb-4">
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl text-black">
            Our Menu
          </h1>
          <p className="text-black">Choose from our delicious selection</p>
        </div>
      </div> */}

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <MenuGrid items={filteredItems} onItemClick={handleItemClick} />

      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

      <Footer info={info} />
    </div>
  );
};

export default Menu;
