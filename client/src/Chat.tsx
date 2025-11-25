import React, { useState, useRef, useEffect } from 'react';
import CartItem from './components/CartItem';
import MenuDisplay from './components/MenuDisplay';
import Receipt from './components/Receipt';

interface CartItemType {
  name: string;
  qty: number;
  price: number;
}

interface Message {
  type: 'user' | 'bot';
  text: string;
  items?: CartItemType[];
  total?: number;
}

interface ReceiptType {
  orderId: string;
  timestamp: string;
  items: CartItemType[];
  total: number;
  status: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: 'Hello! Welcome to our restaurant. What would you like to order today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState<Record<string, number>>({});
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/menu');
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const newCart = [...cart];
        data.items.forEach((item: CartItemType) => {
          const existingIndex = newCart.findIndex(
            (cartItem) => cartItem.name.toLowerCase() === item.name.toLowerCase()
          );
          if (existingIndex >= 0) {
            newCart[existingIndex].qty += item.qty;
          } else {
            newCart.push(item);
          }
        });
        setCart(newCart);
        
        const newTotal = newCart.reduce((sum, item) => sum + item.price * item.qty, 0);
        setCartTotal(newTotal);
      }

      const botMessage: Message = {
        type: 'bot',
        text: data.reply,
        items: data.items,
        total: data.total,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total: cartTotal }),
      });

      const data = await response.json();

      if (data.success) {
        setReceipt(data.receipt);
        setCart([]);
        setCartTotal(0);
        const confirmMessage: Message = {
          type: 'bot',
          text: data.message,
        };
        setMessages((prev) => [...prev, confirmMessage]);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to process order. Please try again.');
    }
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    const newTotal = newCart.reduce((sum, item) => sum + item.price * item.qty, 0);
    setCartTotal(newTotal);
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    const newCart = [...cart];
    newCart[index].qty = newQty;
    setCart(newCart);
    const newTotal = newCart.reduce((sum, item) => sum + item.price * item.qty, 0);
    setCartTotal(newTotal);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen max-w-7xl mx-auto p-4 gap-4">
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <h1 className="text-3xl font-bold">🍕 Restaurant Chatbot</h1>
          <p className="text-orange-100 mt-1">Order your favorite food with ease</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm md:text-base">{msg.text}</p>
                {msg.items && msg.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
                    {msg.items.map((item, i) => (
                      <div key={i} className="text-xs md:text-sm">
                        <span className="font-semibold">{item.name}</span> x{item.qty} - ₹
                        {item.price * item.qty}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-50 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your order here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-96 flex flex-col gap-4">
        <MenuDisplay menu={menu} />

        <div className="bg-white rounded-2xl shadow-2xl p-6 flex-1 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🛒 Your Cart
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Your cart is empty</p>
            ) : (
              cart.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  onRemove={() => removeFromCart(index)}
                  onUpdateQty={(newQty) => updateQuantity(index, newQty)}
                />
              ))
            )}
          </div>

          {cart.length > 0 && (
            <>
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-orange-600">₹{cartTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold text-lg"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>

        {receipt && <Receipt receipt={receipt} onClose={() => setReceipt(null)} />}
      </div>
    </div>
  );
};

export default Chat;
