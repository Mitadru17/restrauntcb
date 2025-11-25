import React from 'react';

interface CartItemProps {
  item: {
    name: string;
    qty: number;
    price: number;
  };
  onRemove: () => void;
  onUpdateQty: (newQty: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQty }) => {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 capitalize">{item.name}</h3>
          <p className="text-sm text-gray-600">₹{item.price} each</p>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQty(item.qty - 1)}
            className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            −
          </button>
          <span className="w-8 text-center font-semibold">{item.qty}</span>
          <button
            onClick={() => onUpdateQty(item.qty + 1)}
            className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
        <div className="text-lg font-bold text-orange-600">₹{item.price * item.qty}</div>
      </div>
    </div>
  );
};

export default CartItem;
