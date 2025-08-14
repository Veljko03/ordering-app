import { useState } from "react";

import { FaMinus, FaPlus, FaX } from "react-icons/fa6";

const ItemModal = ({ item, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  //const { addItem } = useCart();

  if (!isOpen || !item) return null;
  const [selectedSize, setSelectedSize] = useState(
    item.sizes?.[0]?._id || null
  );
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Izračunavanje cene
  const totalPrice = useMemo(() => {
    let price = item.basePrice;

    // Dodaj cenu odabrane veličine
    const size = item.sizes?.find((s) => s._id === selectedSize);
    if (size) price += size.price;

    // Dodaj cenu svih izabranih dodataka
    selectedAddons.forEach((addonId) => {
      const addon = item.addons?.find((a) => a._id === addonId);
      if (addon) price += addon.price;
    });

    return price * quantity;
  }, [item, selectedSize, selectedAddons, quantity]);

  // Dodavanje/uklanjanje dodataka
  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };
  //   const handleAddToCart = () => {
  //     addItem(item, quantity);
  //     onClose();
  //     setQuantity(1);
  //   };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg text-black bg-white shadow-white border-border  rounded-2xl animate-fade-in">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 rounded-full cursor-pointer hover:text-red-600"
          onClick={onClose}
        >
          <FaX className="w-4 h-4" />
        </button>

        {/* Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-black">
              {item.name}
            </h2>
            <p className="text-gray-600">{item.description}</p>
          </div>

          {/* Ingredients */}
          {/* <div className="space-y-2">
            <h3 className="font-medium text-foreground">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ingredient, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div> */}

          <div className="flex items-center justify-between   ">
            <span className="font-bold text-2xl text-green-500">
              ${item.basePrice}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((prev) => prev - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300  cursor-pointer
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaMinus className="w-4 h-4" />
              </button>

              <span className="font-medium text-lg min-w-[2rem] text-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-400 hover:bg-orange-500  cursor-pointer
                 text-white transition-colors"
              >
                <FaPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg 
             shadow-md transition-colors duration-200"
            // onClick={handleAddToCart}
          >
            Add {quantity} to Cart • ${totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
