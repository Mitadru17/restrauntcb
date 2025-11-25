import React from 'react';

interface ReceiptProps {
  receipt: {
    orderId: string;
    timestamp: string;
    items: Array<{
      name: string;
      qty: number;
      price: number;
    }>;
    total: number;
    status: string;
  };
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ receipt, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">Your delicious food is on its way</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex justify-between mb-4 pb-4 border-b">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-mono font-semibold">{receipt.orderId}</span>
          </div>

          <div className="space-y-3 mb-4 pb-4 border-b">
            {receipt.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="capitalize">
                  {item.name} x{item.qty}
                </span>
                <span className="font-semibold">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span className="text-green-600">₹{receipt.total}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Receipt;
