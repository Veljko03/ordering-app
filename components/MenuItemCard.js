import { FaPlus } from "react-icons/fa";

const MenuItemCard = ({ item, onClick }) => {
  //   const { addItem } = useCart();
  console.log("item ", item);

  return (
    <div
      className="group cursor-pointer bg-card shadow-md shadow-gray-400 hover:shadow-card  hover:scale-105 border-border"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        {item.imageUrl != "" && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-110 "
          />
        )}

        {/* Quick Add Button */}
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-medium text-lg line-clamp-1 text-black">
            {item.name}
          </h3>
          <p className="text-sm  line-clamp-2 text-black">{item.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-black">
            ${item.basePrice.toFixed(2)}
          </span>
          <button
            // onClick={handleAddToCart}
            className="transition-smooth hover:bg-primary text-black flex items-center gap-2 cursor-pointer"
          >
            Add
            <FaPlus className="w-4 h-4 text-green-400 " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
