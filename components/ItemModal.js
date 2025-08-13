import { X, Plus, Minus, Flame, Leaf } from "lucide-react";

import { FaMinus, FaPlus, FaX } from "react-icons/fa6";

const ItemModal = ({ item, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  //const { addItem } = useCart();

  if (!isOpen || !item) return null;

  //   const handleAddToCart = () => {
  //     addItem(item, quantity);
  //     onClose();
  //     setQuantity(1);
  //   };

  //   const handleQuantityChange = (delta) => {
  //     setQuantity(Math.max(1, quantity + delta));
  //   };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card shadow-card border-border animate-fade-in">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 rounded-full"
          onClick={onClose}
        >
          <FaX className="w-4 h-4" />
        </button>

        {/* Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-foreground">
              {item.name}
            </h2>
            <p className="text-muted-foreground">{item.description}</p>
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

          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-2xl text-primary">
              ${item.price.toFixed(2)}
            </span>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-medium text-lg min-w-[2rem] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 rounded-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-gradient-primary hover:bg-primary-dark text-primary-foreground shadow-button transition-smooth font-medium"
            onClick={handleAddToCart}
          >
            Add {quantity} to Cart • ${(item.price * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
