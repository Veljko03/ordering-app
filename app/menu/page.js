"use client";
import CategoryFilter from "@/components/CategoryFilter";
// import CategoryFilter from '@/components/CategoryFilter';
// import MenuGrid from '@/components/MenuGrid';
// import ItemModal from '@/components/ItemModal';
// import Cart from '@/components/Cart';
// import { MenuItem } from '@/types/food';
// import { menuItems } from '@/data/mockData';
import Header from "@/components/Header";
import ItemModal from "@/components/ItemModal";
import MenuGrid from "@/components/MenuGrid";
import Places from "@/components/PlacePicker";
import {
  fetchCategoriesReq,
  fetchInfoReq,
  fetchItemsReq,
  fetchItemsWithoutSinitazeReq,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

const Menu = () => {
  const { data: categories = [], isloading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoriesReq,
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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href={"/"}
          className="transition-smooth hover:bg-muted text-black flex items-center"
        >
          <FaArrowLeft className="w-4 h-4 mr-2 text-black" />
          Back to Home
        </Link>
      </div>
      <Places />
      {/* Page Header */}
      <div className="container mx-auto px-4 pb-4">
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl text-black">
            Our Menu
          </h1>
          <p className="text-black">Choose from our delicious selection</p>
        </div>
      </div>

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
      {/*
      <Cart /> */}
    </div>
  );
};

export default Menu;
