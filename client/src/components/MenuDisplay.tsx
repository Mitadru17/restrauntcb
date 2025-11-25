import React from 'react';

interface MenuDisplayProps {
  menu: Record<string, number>;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menu }) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📋 Menu
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(menu).map(([item, price]) => (
          <div
            key={item}
            className="bg-gradient-to-br from-orange-50 to-red-50 p-3 rounded-xl border border-orange-200"
          >
            <h3 className="font-semibold text-gray-800 capitalize text-sm">{item}</h3>
            <p className="text-orange-600 font-bold">₹{price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuDisplay;
