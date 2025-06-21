"use client";
import { useEffect, useState } from "react";
import CategoryManager from "./CategoryManager";
import ItemManager from "./ItemManager";

export default function AdminPanel() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }

  return (
    <>
      <CategoryManager onChange={fetchCategories} />
      <ItemManager categories={categories} />
    </>
  );
}
