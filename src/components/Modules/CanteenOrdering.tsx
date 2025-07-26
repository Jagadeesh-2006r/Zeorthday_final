import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Star, Filter, Clock, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CanteenOrdering: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showCart, setShowCart] = useState(false);

  const menuItems = [
    {
      id: 'M001',
      name: 'Masala Dosa',
      price: 45,
      category: 'breakfast' as const,
      description: 'Crispy dosa with spiced potato filling, served with sambar and chutneys',
      image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
      rating: 4.5,
      preparationTime: '12 min',
    },
    {
      id: 'M002',
      name: 'Chicken Biryani',
      price: 120,
      category: 'lunch' as const,
      description: 'Aromatic basmati rice with tender chicken, spices, and herbs',
      image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
      rating: 4.8,
      preparationTime: '20 min',
    },
    {
      id: 'M003',
      name: 'Paneer Butter Masala',
      price: 85,
      category: 'lunch' as const,
      description: 'Rich and creamy paneer curry with butter and aromatic spices',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
      rating: 4.3,
      preparationTime: '15 min',
    },
    {
      id: 'M004',
      name: 'Samosa (2 pcs)',
      price: 25,
      category: 'snacks' as const,
      description: 'Crispy fried pastry with spiced potato and peas filling',
      image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
      rating: 4.2,
      preparationTime: '5 min',
    },
    {
      id: 'M005',
      name: 'Masala Chai',
      price: 15,
      category: 'beverages' as const,
      description: 'Traditional Indian spiced tea with milk and aromatic spices',
      image: 'https://images.pexels.com/photos/1415555/pexels-photo-1415555.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
      rating: 4.6,
      preparationTime: '3 min',
    },
    {
      id: 'M006',
      name: 'Dal Tadka',
      price: 55,
      category: 'lunch' as const,
      description: 'Yellow lentils tempered with cumin, garlic, and spices',
      image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: false,
      rating: 4.4,
      preparationTime: '10 min',
    },
  ];

  const categories = [
    { key: 'all', label: 'All Items' },
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snacks', label: 'Snacks' },
    { key: 'beverages', label: 'Beverages' },
  ];

  const filteredItems = menuItems.filter((item) => {
    return selectedCategory === 'all' || item.category === selectedCategory;
  });

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(item => item.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Canteen Menu</h1>
          <p className="mt-1 text-gray-600">Order your favorite food items</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Main Canteen</span>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.key
                    ? 'bg-orange-100 text-orange-800 border border-orange-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${!item.available ? 'opacity-60' : ''}`}>
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <div className="flex items-center space-x-1">
                  {renderStars(item.rating)}
                  <span className="text-sm text-gray-600">({item.rating})</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{item.preparationTime}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
              </div>

              <div className="flex items-center justify-between">
                {!item.available ? (
                  <span className="text-red-600 font-medium">Currently Unavailable</span>
                ) : cart[item.id] ? (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium">{cart[item.id]}</span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center hover:bg-orange-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item.id)}
                    className="flex-1 bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-orange-700 transition-colors duration-200"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:w-96 sm:rounded-lg shadow-xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Your Order</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {Object.keys(cart).length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(cart).map(([itemId, quantity]) => {
                    const item = menuItems.find(item => item.id === itemId);
                    if (!item) return null;
                    
                    return (
                      <div key={itemId} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.price} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(itemId)}
                            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center">{quantity}</span>
                          <button
                            onClick={() => addToCart(itemId)}
                            className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center hover:bg-orange-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {Object.keys(cart).length > 0 && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">₹{getCartTotal()}</span>
                </div>
                <button className="w-full bg-orange-600 text-white font-medium py-3 px-4 rounded-md hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Payment</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try selecting a different category.</p>
        </div>
      )}
    </div>
  );
};

export default CanteenOrdering;