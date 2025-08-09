const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {/* Dugme za All Items */}
          <button
            onClick={() => onCategoryChange("all")}
            className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium transition-colors duration-200
      ${
        selectedCategory === "all"
          ? "bg-orange-400 text-white"
          : "bg-gray-300 text-black hover:bg-gray-400"
      }`}
          >
            All Items
          </button>

          {/* Dugmad za kategorije */}
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategoryChange(category._id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium transition-colors duration-200
        ${
          selectedCategory === category._id
            ? "bg-orange-400 text-white"
            : "bg-gray-300 text-black hover:bg-gray-400"
        }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
